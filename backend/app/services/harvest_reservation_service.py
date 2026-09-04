from sqlalchemy.orm import Session

from app.models.buyer import Buyer
from app.models.harvest_reservation import HarvestReservation
from app.models.upcoming_harvest import UpcomingHarvest


def reserve_harvest(db: Session, harvest_id: int, buyer_id: int, quantity: float, delivery_location: str | None = None):
    buyer = db.query(Buyer).filter(Buyer.id == buyer_id, Buyer.buyer_type == "bulk").first()
    if not buyer:
        raise ValueError("Bulk buyer not found")
    harvest = db.query(UpcomingHarvest).filter(UpcomingHarvest.id == harvest_id, UpcomingHarvest.is_available.is_(True)).with_for_update().first()
    if not harvest:
        raise ValueError("Upcoming harvest is no longer available for reservation")
    if quantity <= 0:
        raise ValueError("Reservation quantity must be greater than zero")
    already_reserved = sum(value for value, in db.query(HarvestReservation.reserved_quantity)
                           .filter(HarvestReservation.harvest_id == harvest_id, HarvestReservation.status == "reserved").all())
    if quantity + already_reserved > harvest.quantity:
        remaining = max(0, harvest.quantity - already_reserved)
        raise ValueError(f"Only {remaining:g} {harvest.unit} remains available for reservation")

    reservation = HarvestReservation(
        harvest_id=harvest.id, buyer_id=buyer.id, farmer_id=harvest.farmer_id,
        crop_name=harvest.name, farmer_name=harvest.farmer_name, unit=harvest.unit,
        price=harvest.price, reserved_quantity=quantity,
        delivery_location=delivery_location or buyer.location, harvest_date=harvest.harvest_date,
        status="reserved",
    )
    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return reservation


def get_buyer_reservations(db: Session, buyer_id: int):
    return (db.query(HarvestReservation).filter(HarvestReservation.buyer_id == buyer_id)
            .order_by(HarvestReservation.created_at.desc()).all())


def mark_reservations_ready(db: Session, harvest_id: int):
    """Keep a buyer's requirement visible after its farmer publishes the crop."""
    db.query(HarvestReservation).filter(
        HarvestReservation.harvest_id == harvest_id,
        HarvestReservation.status == "reserved",
    ).update({HarvestReservation.status: "ready_to_order"}, synchronize_session=False)
