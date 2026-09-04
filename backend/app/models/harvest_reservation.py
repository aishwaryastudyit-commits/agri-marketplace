from sqlalchemy import Column, Date, DateTime, Float, Integer, String
from sqlalchemy.sql import func

from app.models.base import Base


class HarvestReservation(Base):
    """A bulk buyer's non-binding reservation for a farmer's future harvest."""

    __tablename__ = "harvest_reservations"

    id = Column(Integer, primary_key=True, index=True)
    harvest_id = Column(Integer, nullable=False, index=True)
    buyer_id = Column(Integer, nullable=False, index=True)
    farmer_id = Column(Integer, nullable=False, index=True)
    crop_name = Column(String, nullable=False)
    farmer_name = Column(String, nullable=False)
    unit = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    reserved_quantity = Column(Float, nullable=False)
    delivery_location = Column(String, nullable=True)
    harvest_date = Column(Date, nullable=True)
    status = Column(String, nullable=False, default="reserved")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
