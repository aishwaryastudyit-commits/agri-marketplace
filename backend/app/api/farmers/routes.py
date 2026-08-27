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
def add_farmer(
    full_name: str,
    phone: str,
    location: str = None,
    farm_name: str = None,
    farm_size: str = None,
    db: Session = Depends(get_db)
):
    new_farmer = Farmer(
        full_name=full_name,
        phone=phone,
        location=location,
        farm_name=farm_name,
        farm_size=farm_size
    )

    db.add(new_farmer)
    db.commit()
    db.refresh(new_farmer)

    return new_farmer