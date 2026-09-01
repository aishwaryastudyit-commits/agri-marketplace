from sqlalchemy.orm import Session

from app.models.payment import Payment
from app.models.order import Order


# =========================================================
# GET ALL PAYMENTS
# =========================================================

def get_all_payments(db: Session):
    return db.query(Payment).all()


# =========================================================
# CREATE PAYMENT
# =========================================================

def create_payment(
    db: Session,
    order_id: int,
    payment_method: str = None
):
    # Find the order
    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise ValueError("Order not found")

    # Create payment using order total
    new_payment = Payment(
        order_id=order_id,
        amount=order.total_amount,
        payment_method=payment_method,
        payment_status="pending"
    )

    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)

    return new_payment


# =========================================================
# MARK PAYMENT AS SUCCESSFUL
# =========================================================

def mark_payment_successful(
    db: Session,
    payment_id: int
):
    # Find payment
    payment = (
        db.query(Payment)
        .filter(Payment.id == payment_id)
        .first()
    )

    if not payment:
        raise ValueError("Payment not found")

    # Find related order
    order = (
        db.query(Order)
        .filter(Order.id == payment.order_id)
        .first()
    )

    if not order:
        raise ValueError("Related order not found")

    # Update payment
    payment.payment_status = "successful"

    # Confirm order
    order.status = "confirmed"

    db.commit()
    db.refresh(payment)
    db.refresh(order)

    return {
        "message": "Payment successful and order confirmed",
        "payment_id": payment.id,
        "order_id": order.id,
        "payment_status": payment.payment_status,
        "order_status": order.status
    }