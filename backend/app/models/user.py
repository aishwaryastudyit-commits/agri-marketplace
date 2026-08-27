from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func

from app.models.base import Base


class User(Base):
    __tablename__ = "users"

    # Primary identity
    id = Column(Integer, primary_key=True, index=True)

    # Basic details
    full_name = Column(String(150), nullable=False)

    # Contact information
    email = Column(String(255), unique=True, nullable=True, index=True)
    phone = Column(String(20), unique=True, nullable=True, index=True)

    # ANNAM role
    role = Column(String(50), nullable=False)

    # Authentication
    password_hash = Column(String(255), nullable=True)

    # Account status
    is_active = Column(Boolean, default=True)

    # Timestamps
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        onupdate=func.now()
    )