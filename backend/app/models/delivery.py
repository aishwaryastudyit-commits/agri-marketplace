from sqlalchemy import Column, Integer, String
from app.models.base import Base


class Delivery(Base):
    __tablename__ = "deliveries"

    id = Column(Integer, primary_key=True, index=True)

    order_id = Column(Integer, nullable=False)

    delivery_address = Column(String, nullable=False)

    delivery_status = Column(String, default="pending")

    assigned_driver = Column(String, nullable=True)

    tracking_number = Column(String, nullable=True)