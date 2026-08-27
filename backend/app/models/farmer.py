from sqlalchemy import Column, Integer, String
from app.models.base import Base


class Farmer(Base):
    __tablename__ = "farmers"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String, nullable=False)

    phone = Column(String, nullable=False, unique=True)

    location = Column(String, nullable=True)

    farm_name = Column(String, nullable=True)

    farm_size = Column(String, nullable=True)