from sqlalchemy.orm import Session

from app.models.user import User
from app.models.order import Order
from app.models.product import Product


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
        db.query(User)
        .filter(User.id == buyer_id)
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
        db.query(User)
        .filter(User.id == buyer_id)
        .first()
    )

    if not buyer:
        raise ValueError("Buyer not found")

    return (
        db.query(Order)
        .filter(Order.buyer_id == buyer_id)
        .order_by(Order.created_at.desc())
        .all()
    )


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