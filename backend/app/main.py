from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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


# Create FastAPI application
app = FastAPI(
    title="ANNAM API"
)


# Allow React frontend to connect to FastAPI backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create database tables on startup
@app.on_event("startup")
def create_database_tables():
    Base.metadata.create_all(bind=engine)
    print("✅ ANNAM database tables created successfully!")


# Home route
@app.get("/")
def home():
    return {
        "message": "Welcome to ANNAM API"
    }


# Products API
app.include_router(
    products_router,
    prefix="/products",
    tags=["Products"]
)


# Farmers API
app.include_router(
    farmers_router,
    prefix="/farmers",
    tags=["Farmers"]
)


# Orders API
app.include_router(
    orders_router,
    prefix="/orders",
    tags=["Orders"]
)


# Payments API
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


# Buyers API
app.include_router(
    buyers_router,
    prefix="/buyers",
    tags=["Buyers"]
)