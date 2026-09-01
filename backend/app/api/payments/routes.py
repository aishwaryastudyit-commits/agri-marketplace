from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services import payment_service


router = APIRouter()


# =========================================================
# GET ALL PAYMENTS
# =========================================================

@router.get("/")
def get_payments(
    db: Session = Depends(get_db)
):
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