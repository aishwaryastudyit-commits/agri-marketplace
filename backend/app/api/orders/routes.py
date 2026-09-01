from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services import order_service


router = APIRouter()


# =========================================================
# GET ALL ORDERS
# =========================================================

@router.get("/")
def get_orders(
    db: Session = Depends(get_db)
):
    return order_service.get_all_orders(db)


# =========================================================
# CREATE ORDER
# =========================================================

@router.post("/")
def create_order(
    buyer_id: int,
    product_id: int,
    quantity: float,
    db: Session = Depends(get_db)
):

    try:

        return order_service.create_order(
            db=db,
            buyer_id=buyer_id,
            product_id=product_id,
            quantity=quantity
        )

    except ValueError as error:

        message = str(error)

        if message == "Buyer not found":
            raise HTTPException(
                status_code=404,
                detail=message
            )

        if message == "Product not found":
            raise HTTPException(
                status_code=404,
                detail=message
            )

        raise HTTPException(
            status_code=400,
            detail=message
        )