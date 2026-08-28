from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.delivery import Delivery
from app.models.order import Order


router = APIRouter()


# GET ALL DELIVERIES
@router.get("/")
def get_deliveries(db: Session = Depends(get_db)):
    deliveries = db.query(Delivery).all()
    return deliveries


# CREATE DELIVERY
@router.post("/")
def create_delivery(
    order_id: int,
    delivery_address: str,
    assigned_driver: str = None,
    tracking_number: str = None,
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

    # Only confirmed orders can be delivered
    if order.status != "confirmed":
        raise HTTPException(
            status_code=400,
            detail="Order is not confirmed yet"
        )

    # Create delivery
    new_delivery = Delivery(
        order_id=order_id,
        delivery_address=delivery_address,
        delivery_status="pending",
        assigned_driver=assigned_driver,
        tracking_number=tracking_number
    )

    db.add(new_delivery)
    db.commit()
    db.refresh(new_delivery)

    return new_delivery


# UPDATE DELIVERY STATUS
@router.put("/{delivery_id}/status")
def update_delivery_status(
    delivery_id: int,
    delivery_status: str,
    db: Session = Depends(get_db)
):
    # Find delivery
    delivery = db.query(Delivery).filter(
        Delivery.id == delivery_id
    ).first()

    # Check whether delivery exists
    if not delivery:
        raise HTTPException(
            status_code=404,
            detail="Delivery not found"
        )

    # Update delivery status
    delivery.delivery_status = delivery_status

    db.commit()
    db.refresh(delivery)

    return delivery

# TRACK LOGISTICS BY TRACKING NUMBER
@router.get("/track/{tracking_number}")
def track_logistics(
    tracking_number: str,
    db: Session = Depends(get_db)
):
    logistics = db.query(Delivery).filter(
        Delivery.tracking_number == tracking_number
    ).first()

    if not logistics:
        raise HTTPException(
            status_code=404,
            detail="Tracking number not found"
        )

    return logistics