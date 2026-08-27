from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.farmer import Farmer


router = APIRouter()


# GET ALL FARMERS
@router.get("/")
def get_farmers(db: Session = Depends(get_db)):
    farmers = db.query(Farmer).all()
    return farmers


# ADD FARMER
@router.post("/")
def add_farmer(farmer: dict, db: Session = Depends(get_db)):

    new_farmer = Farmer(
        full_name=farmer["full_name"],
        phone=farmer["phone"],
        location=farmer.get("location"),
        farm_name=farmer.get("farm_name"),
        farm_size=farmer.get("farm_size")
    )

    db.add(new_farmer)
    db.commit()
    db.refresh(new_farmer)

    return new_farmer