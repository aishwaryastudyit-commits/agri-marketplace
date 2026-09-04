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
    buyer_id: int = None,
    db: Session = Depends(get_db)
):
    return order_service.get_all_orders(db, buyer_id=buyer_id)


@router.get("/{order_id}")
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = order_service.get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.put("/{order_id}/cancel")
def cancel_order(order_id: int, db: Session = Depends(get_db)):
    try:
        return order_service.cancel_order(db, order_id)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


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
