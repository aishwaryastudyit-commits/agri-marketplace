import hashlib
import hmac
import json
import os

from fastapi import APIRouter, Depends, HTTPException, Header, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.database import get_db
from app.services import payment_service


router = APIRouter()


class PaymentWebhook(BaseModel):
    payment_id: int
    status: str


# =========================================================
# GET ALL PAYMENTS
# =========================================================

@router.get("/")
def get_payments(
    buyer_id: int = None,
    db: Session = Depends(get_db)
):
    if buyer_id is not None:
        return payment_service.get_buyer_payments(db, buyer_id)
    return payment_service.get_all_payments(db)


# =========================================================
# CREATE PAYMENT
# =========================================================

@router.post("/")
def create_payment(
    order_id: int,
    payment_method: str = None,
    db: Session = Depends(get_db)
):

    try:

        return payment_service.create_payment(
            db=db,
            order_id=order_id,
            payment_method=payment_method
        )

    except ValueError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error)
        )


# =========================================================
# MARK PAYMENT AS SUCCESSFUL
# =========================================================

@router.put("/{payment_id}/success")
def payment_success(
    payment_id: int,
    db: Session = Depends(get_db)
):

    try:

        return payment_service.mark_payment_successful(
            db=db,
            payment_id=payment_id
        )

    except ValueError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error)
        )


@router.post("/webhook")
async def payment_webhook(
    request: Request,
    payload: PaymentWebhook,
    x_annam_signature: str = Header(default=""),
    db: Session = Depends(get_db),
):
    """Gateway callback. Configure PAYMENT_WEBHOOK_SECRET before enabling it."""
    secret = os.getenv("PAYMENT_WEBHOOK_SECRET")
    if not secret:
        raise HTTPException(status_code=503, detail="Payment webhook is not configured")
    raw = await request.body()
    expected = hmac.new(secret.encode(), raw, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, x_annam_signature):
        raise HTTPException(status_code=401, detail="Invalid webhook signature")
    if payload.status.lower() not in {"paid", "successful", "succeeded"}:
        return {"accepted": True, "processed": False}
    try:
        # This operation is idempotent: payment service does not create a
        # second delivery when a gateway retries the same callback.
        return payment_service.mark_payment_successful(db, payload.payment_id)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))
