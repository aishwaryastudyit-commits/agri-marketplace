from sqlalchemy.orm import Session

from app.models.delivery import Delivery
from app.models.order import Order
from app.models.product import Product
from app.models.farmer import Farmer
from app.models.buyer import Buyer
from app.services.notification_service import create_notification


def queue_delivery(db: Session, order: Order, buyer: Buyer | None = None) -> Delivery:
    """Create the one shared logistics job as soon as an order is placed.

    Payment later confirms the order; it does not gate the worker's ability to
    see and plan the job.  The caller owns the transaction, keeping the order,
    stock reservation, and job creation atomic.
    """
    existing = db.query(Delivery).filter(Delivery.order_id == order.id).first()
    if existing:
        return existing
    delivery = Delivery(
        order_id=order.id,
        delivery_address=(buyer.location if buyer and buyer.location else "Address to be confirmed"),
        delivery_status="pending",
        tracking_number=f"ANNAM-{order.id:06d}",
        current_location="Order placed — payment verification pending",
        route="Farmer → Collection hub → Delivery address",
    )
    db.add(delivery)
    return delivery


def _delivery_payload(delivery, order=None, product=None, farmer=None, buyer=None):
    """Return delivery data enriched for each role's shared workspace."""
    data = {column.name: getattr(delivery, column.name) for column in Delivery.__table__.columns}
    if order:
        data.update({"order_status": order.status, "quantity": order.quantity, "total_amount": order.total_amount})
    if product:
        data.update({"product": product.name, "product_unit": product.unit, "farmer_id": product.farmer_id})
    if farmer:
        data.update({"farmer": farmer.full_name, "pickup_location": farmer.location})
    if buyer:
        data.update({"buyer": buyer.full_name})
    return data


# =========================================================
# GET ALL DELIVERIES
# =========================================================

def get_all_deliveries(db: Session, buyer_id: int = None):
    query = db.query(Delivery, Order, Product, Farmer, Buyer).join(Order, Delivery.order_id == Order.id) \
        .join(Product, Order.product_id == Product.id) \
        .outerjoin(Farmer, Product.farmer_id == Farmer.id) \
        .outerjoin(Buyer, Order.buyer_id == Buyer.id)
    if buyer_id is not None:
        query = query.filter(Order.buyer_id == buyer_id)
    return [_delivery_payload(delivery, order, product, farmer, buyer)
            for delivery, order, product, farmer, buyer in query.order_by(Delivery.id.desc()).all()]


# =========================================================
# CREATE DELIVERY
# =========================================================

def create_delivery(
    db: Session,
    order_id: int,
    delivery_address: str,
    assigned_driver: str = None,
    tracking_number: str = None,
    current_location: str = None,
    route: str = None
):
    # Find order
    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise ValueError("Order not found")

    # Only confirmed orders can be delivered
    if order.status != "confirmed":
        raise ValueError(
            "Order is not confirmed yet"
        )

    existing = db.query(Delivery).filter(Delivery.order_id == order_id).first()
    if existing:
        return existing

    # Create delivery
    new_delivery = Delivery(
        order_id=order_id,
        delivery_address=delivery_address,
        delivery_status="pending",
        assigned_driver=assigned_driver,
        tracking_number=tracking_number,
        current_location=current_location,
        route=route
    )

    db.add(new_delivery)
    db.commit()
    db.refresh(new_delivery)

    return new_delivery


# =========================================================
# UPDATE DELIVERY STATUS
# =========================================================

def update_delivery_status(
    db: Session,
    delivery_id: int,
    delivery_status: str
):
    delivery = (
        db.query(Delivery)
        .filter(Delivery.id == delivery_id)
        .first()
    )

    if not delivery:
        raise ValueError("Delivery not found")

    delivery.delivery_status = delivery_status
    order = db.query(Order).filter(Order.id == delivery.order_id).first()
    status_map = {
        "assigned": "confirmed", "going_to_pickup": "processing", "picking_up": "processing",
        "picked_up": "processing", "out_for_delivery": "shipped", "delivered": "delivered",
        "cancelled": "cancelled",
    }
    if order and delivery_status.lower() in status_map:
        order.status = status_map[delivery_status.lower()]

    db.commit()
    db.refresh(delivery)
    if order:
        create_notification(
            db, order.buyer_id, "Delivery update",
            f"Order #{order.id}: {delivery_status.replace('_', ' ').title()}.", "delivery"
        )

    return delivery


# =========================================================
# TRACK DELIVERY
# =========================================================

def track_delivery(
    db: Session,
    tracking_number: str
):
    delivery = (
        db.query(Delivery)
        .filter(
            Delivery.tracking_number == tracking_number
        )
        .first()
    )

    if not delivery:
        raise ValueError(
            "Tracking number not found"
        )

    return delivery


def update_delivery_location(
    db: Session,
    delivery_id: int,
    current_location: str,
    route: str = None
):
    delivery = db.query(Delivery).filter(Delivery.id == delivery_id).first()
    if not delivery:
        raise ValueError("Delivery not found")

    delivery.current_location = current_location
    if route is not None:
        delivery.route = route
    db.commit()
    db.refresh(delivery)
    return delivery


def assign_delivery(db: Session, delivery_id: int, assigned_driver: str, route: str = None):
    delivery = db.query(Delivery).filter(Delivery.id == delivery_id).first()
    if not delivery:
        raise ValueError("Delivery not found")
    delivery.assigned_driver = assigned_driver
    delivery.delivery_status = "assigned"
    delivery.current_location = "Driver assigned — awaiting pickup"
    if route:
        delivery.route = route
    order = db.query(Order).filter(Order.id == delivery.order_id).first()
    if order and order.status == "confirmed":
        order.status = "processing"
    db.commit()
    db.refresh(delivery)
    if order:
        create_notification(db, order.buyer_id, "Driver assigned", f"{assigned_driver} is assigned to order #{order.id}.", "delivery")
    return delivery


def mark_farmer_ready(db: Session, delivery_id: int, farmer_id: int):
    """Share the farm-gate readiness update with the delivery job."""
    row = (db.query(Delivery, Order, Product, Farmer, Buyer)
           .join(Order, Delivery.order_id == Order.id)
           .join(Product, Order.product_id == Product.id)
           .outerjoin(Farmer, Product.farmer_id == Farmer.id)
           .outerjoin(Buyer, Order.buyer_id == Buyer.id)
           .filter(Delivery.id == delivery_id, Product.farmer_id == farmer_id)
           .first())
    if not row:
        raise ValueError("Delivery not found for this farmer")

    delivery, order, product, farmer, buyer = row
    if (delivery.delivery_status or "pending").lower() not in {"pending", "assigned"}:
        raise ValueError("Farm readiness can only be updated before pickup begins")
    if delivery.current_location == "Farm gate: produce ready for pickup":
        return _delivery_payload(delivery, order, product, farmer, buyer)
    delivery.current_location = "Farm gate: produce ready for pickup"
    # Keep the delivery state unchanged: workers can still claim a paid job.
    from app.services.dispatch_service import event
    event(db, delivery.id, "farmer_ready", f"{farmer.full_name if farmer else 'Farmer'} marked {product.name} ready for pickup", delivery.delivery_status)
    create_notification(db, order.buyer_id, "Farm pickup ready", f"Your order #{order.id} is ready at the farm for the delivery partner.", "delivery", commit=False)
    db.commit()
    db.refresh(delivery)
    return _delivery_payload(delivery, order, product, farmer, buyer)
