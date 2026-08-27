from sqlalchemy import Column, Integer, String, Float, Boolean
from app.models.base import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    category = Column(String, nullable=False)

    price = Column(Float, nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(String, nullable=False)

    farmer_name = Column(String, nullable=False)

    location = Column(String, nullable=True)
    description = Column(String, nullable=True)

    is_available = Column(Boolean, default=True)