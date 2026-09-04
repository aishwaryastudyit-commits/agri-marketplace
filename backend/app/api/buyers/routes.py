from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.buyer import Buyer
from app.models.order import Order
from app.services import matching_service


router = APIRouter(
    tags=["Buyers"]
)


# =========================================================
# CREATE BUYER
# =========================================================

@router.post("/")
def create_buyer(
    full_name: str,
    phone: str,
    location: str = None,
    buyer_type: str = "consumer",
    db: Session = Depends(get_db)
):
    existing = db.query(Buyer).filter(Buyer.phone == phone).first()
    if existing:
        existing.full_name = full_name
        existing.location = location or existing.location
        existing.buyer_type = buyer_type or existing.buyer_type
        db.commit()
        db.refresh(existing)
        return existing
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


@router.get("/phone/{phone}")
def get_buyer_by_phone(phone: str, db: Session = Depends(get_db)):
    buyer = db.query(Buyer).filter(Buyer.phone == phone).first()
    if not buyer:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Buyer not found")
    return buyer


# =========================================================
# GET ALL BUYERS
# =========================================================

@router.get("/")
def get_buyers(
    db: Session = Depends(get_db)
):
    buyers = db.query(Buyer).all()

    return buyers


# =========================================================
# GET ORDERS FOR A SPECIFIC BUYER
# =========================================================

@router.get("/buyer/{buyer_id}")
def get_buyer_orders(
    buyer_id: int,
    db: Session = Depends(get_db)
):
    orders = (
        db.query(Order)
        .filter(Order.buyer_id == buyer_id)
        .all()
    )

    return orders


# =========================================================
# MATCH PRODUCTS FOR BUYER
# =========================================================

@router.get("/match-products")
def match_products(
    category: str = None,
    location: str = None,
    db: Session = Depends(get_db)
):
    return matching_service.find_matching_products(
        db=db,
        category=category,
        location=location
    )
