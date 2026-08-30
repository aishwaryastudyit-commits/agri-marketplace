from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.product import Product

router = APIRouter()


# GET ALL PRODUCTS
@router.get("/")
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    return products


# ADD PRODUCT
@router.post("/")
def add_product(product: dict, db: Session = Depends(get_db)):

    new_product = Product(
        name=product["name"],
        category=product["category"],
        price=product["price"],
        quantity=product["quantity"],
        unit=product["unit"],
        farmer_name=product["farmer_name"],
        location=product.get("location"),
        description=product.get("description"),
        is_available=product.get("is_available", True)
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product