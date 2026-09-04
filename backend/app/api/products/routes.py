from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services import product_service


router = APIRouter()


# =========================================================
# GET ALL PRODUCTS
# =========================================================

@router.get("/")
def get_products(
    farmer_id: int = None,
    db: Session = Depends(get_db)
):
    return product_service.get_all_products(db, farmer_id=farmer_id)


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


@router.post("/{product_id}/publish-harvest")
def publish_harvest(product_id: int, farmer_id: int, db: Session = Depends(get_db)):
    try:
        return product_service.publish_harvest_as_product(db, product_id, farmer_id)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))
