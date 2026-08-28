from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.buyer import Buyer
from app.models.order import Order


router = APIRouter(
    tags=["Buyers"]
)


# CREATE BUYER
@router.post("/")
def create_buyer(
    full_name: str,
    phone: str,
    location: str = None,
    buyer_type: str = "consumer",
    db: Session = Depends(get_db)
):
    buyer = Buyer(
        full_name=full_name,
        phone=phone,
        location=location,
        buyer_type=buyer_type
    )

    db.add(buyer)
    db.commit()
    db.refresh(buyer)

    return buyer


# GET ALL BUYERS
@router.get("/")
def get_buyers(db: Session = Depends(get_db)):
    buyers = db.query(Buyer).all()
    return buyers


# GET ORDERS FOR A SPECIFIC BUYER
@router.get("/buyer/{buyer_id}")
def get_buyer_orders(
    buyer_id: int,
    db: Session = Depends(get_db)
):
    orders = db.query(Order).filter(
        Order.buyer_id == buyer_id
    ).all()

    return orders