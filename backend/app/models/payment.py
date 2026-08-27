from sqlalchemy import Column, Integer, String, Float
from app.models.base import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)

    order_id = Column(Integer, nullable=False)

    amount = Column(Float, nullable=False)

    payment_method = Column(String, nullable=True)

    payment_status = Column(String, default="pending")