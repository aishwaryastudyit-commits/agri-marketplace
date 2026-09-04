from datetime import date
from sqlalchemy.orm import Session

from app.models.product import Product


# =========================================================
# GET ALL PRODUCTS
# =========================================================

def get_all_products(db: Session, farmer_id: int = None):
    # Products are live listings only. Planned harvests live in
    # ``upcoming_harvests`` until the farmer explicitly publishes them.
    query = db.query(Product).filter(Product.is_upcoming.is_(False))
    if farmer_id is not None:
        query = query.filter(Product.farmer_id == farmer_id)
    return query.order_by(Product.is_upcoming.asc(), Product.harvest_date.asc()).all()


# =========================================================
# CREATE PRODUCT
# =========================================================

def create_product(
    db: Session,
    product_data: dict
):
    new_product = Product(
        name=product_data["name"],
        category=product_data["category"],
        price=product_data["price"],
        quantity=product_data["quantity"],
        unit=product_data["unit"],
        farmer_name=product_data["farmer_name"],
        farmer_id=product_data.get("farmer_id"),
        location=product_data.get("location"),
        description=product_data.get("description"),
        is_upcoming=product_data.get("is_upcoming", False),
        harvest_date=(date.fromisoformat(product_data["harvest_date"])
                      if product_data.get("harvest_date") else None),
        is_available=product_data.get(
            "is_available",
            True
        )
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


def publish_harvest_as_product(db: Session, product_id: int, farmer_id: int):
    """Move an upcoming listing into the live product exchange."""
    product = db.query(Product).filter(Product.id == product_id, Product.farmer_id == farmer_id).first()
    if not product:
        raise ValueError("Harvest listing not found")
    if not product.is_upcoming:
        raise ValueError("This listing is already a live product")
    product.is_upcoming = False
    product.harvest_date = None
    product.is_available = product.quantity > 0
    db.commit()
    db.refresh(product)
    return product
