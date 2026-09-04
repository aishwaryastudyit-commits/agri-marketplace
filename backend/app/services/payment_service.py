from sqlalchemy.orm import Session

from app.models.payment import Payment
from app.models.order import Order
from app.models.buyer import Buyer
from app.models.delivery import Delivery
from app.services.notification_service import create_notification


# =========================================================
# GET ALL PAYMENTS
# =========================================================

def get_all_payments(db: Session):
    return db.query(Payment).all()


def get_buyer_payments(db: Session, buyer_id: int):
    return (
        db.query(Payment)
        .join(Order, Payment.order_id == Order.id)
        .filter(Order.buyer_id == buyer_id)
        .order_by(Payment.id.desc())
        .all()
    )


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

    # New orders already create their delivery job.  Keep this fallback for
    # older records that predate the immediate logistics handoff.
    existing_delivery = db.query(Delivery).filter(Delivery.order_id == order.id).first()
    if not existing_delivery:
        buyer = db.query(Buyer).filter(Buyer.id == order.buyer_id).first()
        delivery = Delivery(
            order_id=order.id,
            delivery_address=(buyer.location if buyer and buyer.location else "Address to be confirmed"),
            delivery_status="pending",
            tracking_number=f"ANNAM-{order.id:06d}",
            current_location="Order confirmed",
            route="Farmer → Collection hub → Delivery address",
        )
        db.add(delivery)

    db.commit()
    db.refresh(payment)
    db.refresh(order)

    create_notification(
        db, order.buyer_id, "Payment confirmed",
        f"Your order #{order.id} is confirmed and has been sent to logistics.", "success"
    )

    return {
        "message": "Payment successful and order confirmed",
        "payment_id": payment.id,
        "order_id": order.id,
        "payment_status": payment.payment_status,
        "order_status": order.status
    }
