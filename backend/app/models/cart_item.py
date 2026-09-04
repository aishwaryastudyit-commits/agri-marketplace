from sqlalchemy import Column, Integer, Float, DateTime, UniqueConstraint
from sqlalchemy.sql import func

from app.models.base import Base


class CartItem(Base):
    __tablename__ = "cart_items"
    __table_args__ = (UniqueConstraint("buyer_id", "product_id", name="uq_cart_buyer_product"),)

    id = Column(Integer, primary_key=True, index=True)
    buyer_id = Column(Integer, nullable=False, index=True)
    product_id = Column(Integer, nullable=False, index=True)
    quantity = Column(Float, nullable=False, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
