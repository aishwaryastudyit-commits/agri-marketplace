from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services import product_service


router = APIRouter()


# =========================================================
# GET ALL PRODUCTS
# =========================================================

@router.get("/")
def get_products(
    db: Session = Depends(get_db)
):
    return product_service.get_all_products(db)


# =========================================================
# ADD PRODUCT
# =========================================================

@router.post("/")
def add_product(
    product: dict,
    db: Session = Depends(get_db)
):
    return product_service.create_product(
        db=db,
        product_data=product
    )