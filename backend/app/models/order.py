from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func

from app.models.base import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    # Who placed the order
    buyer_id = Column(Integer, nullable=False)

    # Product being ordered
    product_id = Column(Integer, nullable=False)

    # Order details
    quantity = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False)

    # Order status
    status = Column(String, default="pending")

    # Timestamp
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )