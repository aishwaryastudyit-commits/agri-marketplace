from sqlalchemy.orm import Session

from app.models.product import Product


# =========================================================
# FIND MATCHING PRODUCTS
# =========================================================

def find_matching_products(
    db: Session,
    category: str = None,
    location: str = None
):
    query = db.query(Product).filter(
        Product.is_available == True
    )

    if category:
        query = query.filter(
            Product.category == category
        )

    if location:
        query = query.filter(
            Product.location == location
        )

    return query.all()