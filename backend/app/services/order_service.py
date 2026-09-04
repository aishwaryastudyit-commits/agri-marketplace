from sqlalchemy.orm import Session

from app.models.order import Order
from app.models.product import Product
from app.models.buyer import Buyer
from app.models.farmer import Farmer
from app.models.payment import Payment
from app.services.logistics_service import queue_delivery


def _order_payload(order, product=None, farmer=None, payment=None):
    """A role-friendly representation shared by buyer, farmer and tracking views."""
    data = {column.name: getattr(order, column.name) for column in Order.__table__.columns}
    data.update({
        "product": product.name if product else None,
        "farmer": farmer.full_name if farmer else (product.farmer_name if product else None),
        "price": product.price if product else None,
        "unit": product.unit if product else "kg",
        "total": order.total_amount,
        "paymentStatus": payment.payment_status.title() if payment else "Pending",
        "date": order.created_at,
    })
    return data


def get_all_orders(db: Session, buyer_id: int = None):
    query = db.query(Order, Product, Farmer, Payment).join(Product, Order.product_id == Product.id) \
        .outerjoin(Farmer, Product.farmer_id == Farmer.id) \
        .outerjoin(Payment, Payment.order_id == Order.id)
    if buyer_id is not None:
        query = query.filter(Order.buyer_id == buyer_id)
    return [_order_payload(order, product, farmer, payment)
            for order, product, farmer, payment in query.order_by(Order.created_at.desc()).all()]


def get_order(db: Session, order_id: int):
    row = db.query(Order, Product, Farmer, Payment).join(Product, Order.product_id == Product.id) \
        .outerjoin(Farmer, Product.farmer_id == Farmer.id) \
        .outerjoin(Payment, Payment.order_id == Order.id).filter(Order.id == order_id).first()
    return _order_payload(*row) if row else None


def get_order_model(db: Session, order_id: int):
    return db.query(Order).filter(Order.id == order_id).first()


def cancel_order(db: Session, order_id: int):
    order = get_order_model(db, order_id)
    if not order:
        raise ValueError("Order not found")
    if order.status not in ("pending", "confirmed"):
        raise ValueError("This order can no longer be cancelled")
    order.status = "cancelled"
    db.commit()
    return get_order(db, order_id)


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
    # Lock the inventory row until commit so simultaneous checkouts cannot
    # both reserve the same final stock.
    product = db.query(Product).filter(Product.id == product_id).with_for_update().first()

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

    try:
        db.add(new_order)
        db.flush()
        queue_delivery(db, new_order, buyer)
        product.quantity -= quantity
        if product.quantity <= 0:
            product.quantity = 0
            product.is_available = False
        db.commit()
    except Exception:
        db.rollback()
        raise
    db.refresh(new_order)

    return new_order
