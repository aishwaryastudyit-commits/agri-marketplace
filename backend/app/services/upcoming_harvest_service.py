from datetime import date

from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.upcoming_harvest import UpcomingHarvest
from app.services.harvest_reservation_service import mark_reservations_ready


def get_upcoming_harvests(db: Session, farmer_id: int | None = None):
    query = db.query(UpcomingHarvest).filter(UpcomingHarvest.is_available.is_(True))
    if farmer_id is not None:
        query = query.filter(UpcomingHarvest.farmer_id == farmer_id)
    return query.order_by(UpcomingHarvest.harvest_date.asc()).all()


def create_upcoming_harvest(db: Session, harvest_data: dict):
    harvest = UpcomingHarvest(
        name=harvest_data["name"],
        category=harvest_data["category"],
        price=harvest_data["price"],
        quantity=harvest_data["quantity"],
        unit=harvest_data["unit"],
        farmer_name=harvest_data["farmer_name"],
        farmer_id=harvest_data["farmer_id"],
        location=harvest_data.get("location"),
        description=harvest_data.get("description"),
        harvest_date=(date.fromisoformat(harvest_data["harvest_date"])
                      if harvest_data.get("harvest_date") else None),
    )
    db.add(harvest)
    db.commit()
    db.refresh(harvest)
    return harvest


def publish_upcoming_harvest(db: Session, harvest_id: int, farmer_id: int):
    """Promote a planned harvest to a live, purchasable product."""
    harvest = db.query(UpcomingHarvest).filter(
        UpcomingHarvest.id == harvest_id,
        UpcomingHarvest.farmer_id == farmer_id,
    ).first()
    if not harvest:
        raise ValueError("Upcoming harvest not found")

    product = Product(
        name=harvest.name,
        category=harvest.category,
        price=harvest.price,
        quantity=harvest.quantity,
        unit=harvest.unit,
        farmer_name=harvest.farmer_name,
        farmer_id=harvest.farmer_id,
        location=harvest.location,
        description=harvest.description,
        is_upcoming=False,
        harvest_date=None,
        is_available=harvest.quantity > 0,
    )
    db.add(product)
    mark_reservations_ready(db, harvest.id)
    db.delete(harvest)
    db.commit()
    db.refresh(product)
    return product
