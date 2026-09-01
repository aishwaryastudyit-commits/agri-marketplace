from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# API Routes
from app.api.farmers.routes import router as farmers_router
from app.api.products.routes import router as products_router
from app.api.orders.routes import router as orders_router
from app.api.payments.routes import router as payments_router
from app.api.logistics.routes import router as logistics_router
from app.api.buyers.routes import router as buyers_router
from app.api.auth.routes import router as auth_router
from app.api.bulk_orders.routes import router as bulk_orders_router
from app.api.notifications.routes import router as notifications_router
from app.api.forecasts.routes import router as forecasts_router


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
from app.models.notification import Notification
from app.models.forecast import Forecast


# --------------------------------------------------
# CREATE FASTAPI APPLICATION
# --------------------------------------------------

app = FastAPI(
    title="ANNAM API"
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

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


# --------------------------------------------------
# DATABASE STARTUP
# --------------------------------------------------

@app.on_event("startup")
def create_database_tables():
    Base.metadata.create_all(bind=engine)
    print("✅ ANNAM database tables created successfully!")


# --------------------------------------------------
# HOME ROUTE
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "Welcome to ANNAM API"
    }


# --------------------------------------------------
# PRODUCTS API
# --------------------------------------------------

app.include_router(
    products_router,
    prefix="/products",
    tags=["Products"]
)


# --------------------------------------------------
# FARMERS API
# --------------------------------------------------

app.include_router(
    farmers_router,
    prefix="/farmers",
    tags=["Farmers"]
)


# --------------------------------------------------
# ORDERS API
# --------------------------------------------------

app.include_router(
    orders_router,
    prefix="/orders",
    tags=["Orders"]
)


# --------------------------------------------------
# PAYMENTS API
# --------------------------------------------------

app.include_router(
    payments_router,
    prefix="/payments",
    tags=["Payments"]
)


# --------------------------------------------------
# LOGISTICS API
# --------------------------------------------------

app.include_router(
    logistics_router,
    prefix="/logistics",
    tags=["Logistics"]
)


# --------------------------------------------------
# BUYERS API
# --------------------------------------------------

app.include_router(
    buyers_router,
    prefix="/buyers",
    tags=["Buyers"]
)


# --------------------------------------------------
# AUTHENTICATION API
# --------------------------------------------------

app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"]
)


# --------------------------------------------------
# BULK ORDERS API
# --------------------------------------------------

app.include_router(
    bulk_orders_router,
    prefix="/bulk-orders",
    tags=["Bulk Orders"]
)


# --------------------------------------------------
# NOTIFICATIONS API
# --------------------------------------------------

app.include_router(
    notifications_router,
    prefix="/notifications",
    tags=["Notifications"]
)


# --------------------------------------------------
# FORECASTS API
# --------------------------------------------------

app.include_router(
    forecasts_router,
    prefix="/forecasts",
    tags=["Forecasts"]
)