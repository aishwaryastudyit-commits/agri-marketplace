from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services import logistics_service


router = APIRouter()


# =========================================================
# GET ALL DELIVERIES
# =========================================================

@router.get("/")
def get_deliveries(
    db: Session = Depends(get_db)
):
    return logistics_service.get_all_deliveries(db)


# =========================================================
# CREATE DELIVERY
# =========================================================

@router.post("/")
def create_delivery(
    order_id: int,
    delivery_address: str,
    assigned_driver: str = None,
    tracking_number: str = None,
    db: Session = Depends(get_db)
):

    try:

        return logistics_service.create_delivery(
            db=db,
            order_id=order_id,
            delivery_address=delivery_address,
            assigned_driver=assigned_driver,
            tracking_number=tracking_number
        )

    except ValueError as error:

        message = str(error)

        if message == "Order not found":
            raise HTTPException(
                status_code=404,
                detail=message
            )

        raise HTTPException(
            status_code=400,
            detail=message
        )


# =========================================================
# UPDATE DELIVERY STATUS
# =========================================================

@router.put("/{delivery_id}/status")
def update_delivery_status(
    delivery_id: int,
    delivery_status: str,
    db: Session = Depends(get_db)
):

    try:

        return logistics_service.update_delivery_status(
            db=db,
            delivery_id=delivery_id,
            delivery_status=delivery_status
        )

    except ValueError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error)
        )


# =========================================================
# TRACK DELIVERY
# =========================================================

@router.get("/track/{tracking_number}")
def track_logistics(
    tracking_number: str,
    db: Session = Depends(get_db)
):

    try:

        return logistics_service.track_delivery(
            db=db,
            tracking_number=tracking_number
        )

    except ValueError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error)
        )