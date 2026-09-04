from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.farmer import Farmer
from app.models.product import Product
from app.models.order import Order
from app.models.buyer import Buyer
from app.models.payment import Payment
from app.models.delivery import Delivery


router = APIRouter()


# GET ALL FARMERS
@router.get("/")
def get_farmers(db: Session = Depends(get_db)):
    farmers = db.query(Farmer).all()
    return farmers


# ADD FARMER
@router.post("/")
def add_farmer(farmer: dict, db: Session = Depends(get_db)):

    existing = db.query(Farmer).filter(Farmer.phone == farmer["phone"]).first()
    if existing:
        for field in ("full_name", "location", "farm_name", "farm_size"):
            if field in farmer and farmer[field] is not None:
                setattr(existing, field, farmer[field])
        db.commit()
        db.refresh(existing)
        return existing

    new_farmer = Farmer(
        full_name=farmer["full_name"],
        phone=farmer["phone"],
        location=farmer.get("location"),
        farm_name=farmer.get("farm_name"),
        farm_size=farmer.get("farm_size")
    )

    db.add(new_farmer)
    db.commit()
    db.refresh(new_farmer)

    return new_farmer


@router.get("/phone/{phone}")
def get_farmer_by_phone(phone: str, db: Session = Depends(get_db)):
    farmer = db.query(Farmer).filter(Farmer.phone == phone).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
    return farmer


@router.patch("/{farmer_id}")
def update_farmer(farmer_id: int, farmer: dict, db: Session = Depends(get_db)):
    existing = db.query(Farmer).filter(Farmer.id == farmer_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Farmer not found")

    for field in ("full_name", "phone", "location", "farm_name", "farm_size"):
        if field in farmer:
            setattr(existing, field, farmer[field])

    db.commit()
    db.refresh(existing)
    return existing


@router.get("/{farmer_id}/orders")
def get_farmer_orders(farmer_id: int, db: Session = Depends(get_db)):
    rows = (db.query(Order, Product, Buyer, Delivery).join(Product, Product.id == Order.product_id)
            .join(Buyer, Buyer.id == Order.buyer_id).filter(Product.farmer_id == farmer_id)
            .outerjoin(Delivery, Delivery.order_id == Order.id)
            .order_by(Order.created_at.desc()).all())
    return [{"id": order.id, "status": order.status, "quantity": order.quantity,
             "total_amount": order.total_amount, "created_at": order.created_at,
             "product": product.name, "buyer": buyer.full_name, "buyer_type": buyer.buyer_type,
             "delivery_id": delivery.id if delivery else None,
             "delivery_status": delivery.delivery_status if delivery else None,
             "assigned_driver": delivery.assigned_driver if delivery else None,
             "current_location": delivery.current_location if delivery else None,
             "tracking_number": delivery.tracking_number if delivery else None}
            for order, product, buyer, delivery in rows]


@router.get("/{farmer_id}/wallet")
def get_farmer_wallet(farmer_id: int, db: Session = Depends(get_db)):
    amounts = (db.query(Payment.amount).join(Order, Payment.order_id == Order.id)
               .join(Product, Product.id == Order.product_id)
               .filter(Product.farmer_id == farmer_id, Payment.payment_status == "successful").all())
    return {"available_balance": sum(amount for amount, in amounts), "currency": "INR"}
