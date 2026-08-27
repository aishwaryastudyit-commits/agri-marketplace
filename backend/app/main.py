from fastapi import FastAPI

from app.api.products.routes import router as products_router

# Database imports
from app.core.database import engine
from app.models.base import Base

# Import models so SQLAlchemy registers all tables
from app.models.user import User
from app.models.product import Product
from app.models.farmer import Farmer
from app.models.order import Order
from app.models.payment import Payment
from app.models.delivery import Delivery


app = FastAPI(
    title="ANNAM API"
)


@app.on_event("startup")
def create_database_tables():
    Base.metadata.create_all(bind=engine)
    print("✅ ANNAM database tables created successfully!")


@app.get("/")
def home():
    return {
        "message": "Welcome to ANNAM API"
    }


# Existing Products API router
app.include_router(
    products_router,
    prefix="/products",
    tags=["Products"]
)