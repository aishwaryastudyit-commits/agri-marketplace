"""Keep API tests independent from developer or production database settings."""
import os

# This must be set before any test imports app.main, which constructs the
# SQLAlchemy engine at import time.
os.environ["DATABASE_URL"] = "sqlite:///./annam_test.db"

import pytest
from app.core.database import engine
from app.models.base import Base
from app import models  # noqa: F401 - registers SQLAlchemy models


@pytest.fixture(autouse=True)
def database_schema():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
