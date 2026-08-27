from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.payment import Payment
from app.models.order import Order


router = APIRouter()


# GET ALL PAYMENTS
@router.get("/")
def get_payments(db: Session = Depends(get_db)):
    payments = db.query(Payment).all()
    return payments


# CREATE PAYMENT
@router.post("/")
def create_payment(
    order_id: int,
    payment_method: str = None,
    db: Session = Depends(get_db)
):
    # Find the order
    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    # Check whether order exists
    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    # Create payment using the order's total amount
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

# MARK PAYMENT AS SUCCESSFUL
@router.put("/{payment_id}/success")
def payment_success(
    payment_id: int,
    db: Session = Depends(get_db)
):
    # Find payment
    payment = db.query(Payment).filter(
        Payment.id == payment_id
    ).first()

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found"
        )

    # Find related order
    order = db.query(Order).filter(
        Order.id == payment.order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Related order not found"
        )

    # Update payment
    payment.payment_status = "successful"

    # Confirm order
    order.status = "confirmed"

    db.commit()

    return {
        "message": "Payment successful and order confirmed",
        "payment_id": payment.id,
        "order_id": order.id,
        "payment_status": payment.payment_status,
        "order_status": order.status
    }