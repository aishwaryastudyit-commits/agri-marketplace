from sqlalchemy import Boolean, Column, Date, Float, Integer, String

from app.models.base import Base


class UpcomingHarvest(Base):
    """A farmer's planned crop, kept separate from saleable products."""

    __tablename__ = "upcoming_harvests"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(String, nullable=False)
    farmer_name = Column(String, nullable=False)
    farmer_id = Column(Integer, nullable=False, index=True)
    location = Column(String, nullable=True)
    description = Column(String, nullable=True)
    harvest_date = Column(Date, nullable=True)
    is_available = Column(Boolean, default=True, nullable=False)
