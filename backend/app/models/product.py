from sqlalchemy import Column, Integer, String, Float, Boolean, Date
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
    # Kept alongside farmer_name for backwards compatible display data.  New
    # writes should always set this so listings can be owned and filtered.
    farmer_id = Column(Integer, nullable=True, index=True)

    location = Column(String, nullable=True)
    description = Column(String, nullable=True)

    # Future crops are displayed to bulk buyers for reservation before harvest.
    is_upcoming = Column(Boolean, default=False, nullable=False)
    harvest_date = Column(Date, nullable=True)

    is_available = Column(Boolean, default=True)
