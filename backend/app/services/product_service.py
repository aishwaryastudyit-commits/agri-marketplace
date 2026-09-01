from sqlalchemy.orm import Session

from app.models.product import Product


# =========================================================
# GET ALL PRODUCTS
# =========================================================

def get_all_products(db: Session):
    return db.query(Product).all()


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
        location=product_data.get("location"),
        description=product_data.get("description"),
        is_available=product_data.get(
            "is_available",
            True
        )
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product