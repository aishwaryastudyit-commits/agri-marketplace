from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.order import Order
from app.models.product import Product
from app.models.buyer import Buyer


router = APIRouter()


# GET ALL ORDERS
@router.get("/")
def get_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).all()
    return orders


# CREATE ORDER
@router.post("/")
def create_order(
    buyer_id: int,
    product_id: int,
    quantity: float,
    db: Session = Depends(get_db)
):

    # Check whether buyer exists
    buyer = db.query(Buyer).filter(
        Buyer.id == buyer_id
    ).first()

    if not buyer:
        raise HTTPException(
            status_code=404,
            detail="Buyer not found"
        )


    # Find the product
    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    # Check whether product exists
    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    # Check product availability
    if not product.is_available:
        raise HTTPException(
            status_code=400,
            detail="Product is not available"
        )

    # Check quantity
    if quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than zero"
        )

    if quantity > product.quantity:
        raise HTTPException(
            status_code=400,
            detail="Requested quantity is not available"
        )

    # Calculate total automatically
    total_amount = product.price * quantity


    # Create order
    new_order = Order(
        buyer_id=buyer_id,
        product_id=product_id,
        quantity=quantity,
        total_amount=total_amount,
        status="pending"
    )

    db.add(new_order)


    # Reduce available product quantity
    product.quantity -= quantity


    # Mark unavailable if stock is finished
    if product.quantity <= 0:
        product.quantity = 0
        product.is_available = False


    db.commit()
    db.refresh(new_order)

    return new_order