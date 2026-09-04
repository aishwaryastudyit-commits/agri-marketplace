from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services import upcoming_harvest_service
from app.services import harvest_reservation_service


router = APIRouter()


class ReservationRequest(BaseModel):
    buyer_id: int
    quantity: float = Field(gt=0)
    delivery_location: str | None = None


@router.get("/")
def get_upcoming_harvests(farmer_id: int = None, db: Session = Depends(get_db)):
    return upcoming_harvest_service.get_upcoming_harvests(db, farmer_id)


@router.post("/")
def add_upcoming_harvest(harvest: dict, db: Session = Depends(get_db)):
    try:
        return upcoming_harvest_service.create_upcoming_harvest(db, harvest)
    except (KeyError, ValueError) as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.post("/{harvest_id}/reserve")
def reserve_upcoming_harvest(harvest_id: int, data: ReservationRequest, db: Session = Depends(get_db)):
    try:
        return harvest_reservation_service.reserve_harvest(
            db, harvest_id, data.buyer_id, data.quantity, data.delivery_location
        )
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.get("/reservations/buyer/{buyer_id}")
def get_buyer_reservations(buyer_id: int, db: Session = Depends(get_db)):
    return harvest_reservation_service.get_buyer_reservations(db, buyer_id)


@router.post("/{harvest_id}/publish")
def publish_upcoming_harvest(harvest_id: int, farmer_id: int, db: Session = Depends(get_db)):
    try:
        return upcoming_harvest_service.publish_upcoming_harvest(db, harvest_id, farmer_id)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))
