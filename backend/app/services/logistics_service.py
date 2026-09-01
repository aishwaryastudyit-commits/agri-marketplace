from sqlalchemy.orm import Session

from app.models.delivery import Delivery
from app.models.order import Order


# =========================================================
# GET ALL DELIVERIES
# =========================================================

def get_all_deliveries(db: Session):
    return db.query(Delivery).all()


# =========================================================
# CREATE DELIVERY
# =========================================================

def create_delivery(
    db: Session,
    order_id: int,
    delivery_address: str,
    assigned_driver: str = None,
    tracking_number: str = None
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

    # Create delivery
    new_delivery = Delivery(
        order_id=order_id,
        delivery_address=delivery_address,
        delivery_status="pending",
        assigned_driver=assigned_driver,
        tracking_number=tracking_number
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

    db.commit()
    db.refresh(delivery)

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