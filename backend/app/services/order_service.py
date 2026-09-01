from sqlalchemy.orm import Session

from app.models.order import Order
from app.models.product import Product
from app.models.buyer import Buyer


def get_all_orders(db: Session):
    return db.query(Order).all()


def create_order(
    db: Session,
    buyer_id: int,
    product_id: int,
    quantity: float
):
    # Check whether buyer exists
    buyer = (
        db.query(Buyer)
        .filter(Buyer.id == buyer_id)
        .first()
    )

    if not buyer:
        raise ValueError("Buyer not found")

    # Find product
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise ValueError("Product not found")

    # Check product availability
    if not product.is_available:
        raise ValueError("Product is not available")

    # Check quantity
    if quantity <= 0:
        raise ValueError(
            "Quantity must be greater than zero"
        )

    if quantity > product.quantity:
        raise ValueError(
            "Requested quantity is not available"
        )

    # Calculate total
    total_amount = product.price * quantity

    # Create order
    new_order = Order(
        buyer_id=buyer_id,
        product_id=product_id,
        quantity=quantity,
        total_amount=total_amount,
        status="pending"
    )

    db.add(new_order)

    # Reduce product stock
    product.quantity -= quantity

    # Mark unavailable if stock is finished
    if product.quantity <= 0:
        product.quantity = 0
        product.is_available = False

    db.commit()
    db.refresh(new_order)

    return new_order