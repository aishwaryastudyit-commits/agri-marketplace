from sqlalchemy.orm import Session

from app.models.buyer import Buyer
from app.models.order import Order
from app.models.product import Product
from app.models.farmer import Farmer
from app.models.payment import Payment
from app.services.logistics_service import queue_delivery


def bulk_order_payload(order, product=None, farmer=None, payment=None):
    return {
        "id": order.id,
        "buyer_id": order.buyer_id,
        "product_id": order.product_id,
        "product": product.name if product else f"Product #{order.product_id}",
        "farmer": farmer.full_name if farmer else (product.farmer_name if product else "Farmer"),
        "unit": product.unit if product else "kg",
        "price": product.price if product else 0,
        "quantity": order.quantity,
        "total_amount": order.total_amount,
        "status": order.status,
        "payment_status": payment.payment_status if payment else "pending",
        "payment_id": payment.id if payment else None,
        "created_at": order.created_at,
    }


# =========================================================
# CREATE BULK ORDER
# =========================================================

def create_bulk_order(
    db: Session,
    buyer_id: int,
    items
):
    # Check buyer
    buyer = (
        db.query(Buyer)
        .filter(Buyer.id == buyer_id)
        .first()
    )

    if not buyer:
        raise ValueError("Buyer not found")

    if not items:
        raise ValueError(
            "Bulk order must contain at least one product"
        )

    created_orders = []

    try:

        for item in items:

            # Validate quantity
            if item.quantity <= 0:
                raise ValueError(
                    "Quantity must be greater than zero"
                )

            # Find product
            product = (
                db.query(Product)
                .filter(Product.id == item.product_id)
                .first()
            )

            if not product:
                raise ValueError(
                    f"Product {item.product_id} not found"
                )

            # Check availability
            if not product.is_available:
                raise ValueError(
                    f"Product {item.product_id} is not available"
                )

            # Check stock
            if item.quantity > product.quantity:
                raise ValueError(
                    f"Insufficient stock for product {item.product_id}"
                )

            # Calculate amount from actual product price
            total_amount = product.price * item.quantity

            # Create order
            order = Order(
                buyer_id=buyer_id,
                product_id=item.product_id,
                quantity=item.quantity,
                total_amount=total_amount,
                status="pending"
            )

            db.add(order)

            # Reduce stock
            product.quantity -= item.quantity

            if product.quantity <= 0:
                product.quantity = 0
                product.is_available = False

            db.flush()

            queue_delivery(db, order, buyer)

            created_orders.append(order)

        db.commit()

        for order in created_orders:
            db.refresh(order)

        return created_orders

    except Exception:
        db.rollback()
        raise


# =========================================================
# GET BUYER ORDERS
# =========================================================

def get_buyer_bulk_orders(
    db: Session,
    buyer_id: int
):
    buyer = (
        db.query(Buyer)
        .filter(Buyer.id == buyer_id)
        .first()
    )

    if not buyer:
        raise ValueError("Buyer not found")

    rows = (
        db.query(Order, Product, Farmer, Payment)
        .join(Product, Order.product_id == Product.id)
        .outerjoin(Farmer, Product.farmer_id == Farmer.id)
        .outerjoin(Payment, Payment.order_id == Order.id)
        .filter(Order.buyer_id == buyer_id)
        .order_by(Order.created_at.desc())
        .all()
    )
    return [bulk_order_payload(order, product, farmer, payment) for order, product, farmer, payment in rows]


# =========================================================
# GET SINGLE ORDER
# =========================================================

def get_bulk_order(
    db: Session,
    order_id: int
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise ValueError("Order not found")

    return order


# =========================================================
# UPDATE ORDER STATUS
# =========================================================

def update_order_status(
    db: Session,
    order_id: int,
    status: str
):
    allowed_statuses = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled"
    ]

    if status not in allowed_statuses:
        raise ValueError(
            f"Invalid status. Allowed: {allowed_statuses}"
        )

    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise ValueError("Order not found")

    order.status = status

    db.commit()
    db.refresh(order)

    return order
