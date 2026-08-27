from fastapi import FastAPI
from app.api.farmers.routes import router as farmers_router
from app.api.products.routes import router as products_router
from app.api.orders.routes import router as orders_router
from app.api.payments.routes import router as payments_router
from app.api.logistics.routes import router as logistics_router
from app.api.buyers.routes import router as buyers_router

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
from app.models.buyer import Buyer


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

# Farmers API router
app.include_router(
    farmers_router,
    prefix="/farmers",
    tags=["Farmers"]
)


# Orders API router
app.include_router(
    orders_router,
    prefix="/orders",
    tags=["Orders"]
)

# Payments API router
app.include_router(
    payments_router,
    prefix="/payments",
    tags=["Payments"]
)

# Logistics API
app.include_router(
    logistics_router,
    prefix="/logistics",
    tags=["Logistics"]
)

app.include_router(
    buyers_router,
    prefix="/buyers",
    tags=["Buyers"]
)