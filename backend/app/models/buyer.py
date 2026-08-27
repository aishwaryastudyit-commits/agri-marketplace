from sqlalchemy import Column, Integer, String
from app.models.base import Base


class Buyer(Base):
    __tablename__ = "buyers"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String, nullable=False)

    phone = Column(String, nullable=False, unique=True)

    location = Column(String, nullable=True)

    buyer_type = Column(String, nullable=False)