from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services import upcoming_harvest_service


router = APIRouter()


@router.get("/")
def get_upcoming_harvests(farmer_id: int = None, db: Session = Depends(get_db)):
    return upcoming_harvest_service.get_upcoming_harvests(db, farmer_id)


@router.post("/")
def add_upcoming_harvest(harvest: dict, db: Session = Depends(get_db)):
    try:
        return upcoming_harvest_service.create_upcoming_harvest(db, harvest)
    except (KeyError, ValueError) as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.post("/{harvest_id}/publish")
def publish_upcoming_harvest(harvest_id: int, farmer_id: int, db: Session = Depends(get_db)):
    try:
        return upcoming_harvest_service.publish_upcoming_harvest(db, harvest_id, farmer_id)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))
