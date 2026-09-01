from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func

from app.models.base import Base


class Forecast(Base):
    __tablename__ = "forecasts"

    id = Column(Integer, primary_key=True, index=True)

    product = Column(String, nullable=False, index=True)
    location = Column(String, nullable=False, index=True)
    horizon_days = Column(Integer, nullable=False, default=7)

    predicted_qty_kg = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False, default=0.0)
    trend = Column(String, nullable=False, default="stable")

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
