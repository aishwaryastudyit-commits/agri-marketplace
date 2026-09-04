from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

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
from app.api.ai_insights.routes import router as ai_insights_router
from app.api.cart.routes import router as cart_router
from app.api.upcoming_harvests.routes import router as upcoming_harvests_router


# Database imports
from app.core.config import settings
from app.core.database import engine
from app.models.base import Base


# Import models so SQLAlchemy registers all tables
from app.models.user import User
from app.models.product import Product
from app.models.upcoming_harvest import UpcomingHarvest
from app.models.farmer import Farmer
from app.models.order import Order
from app.models.payment import Payment
from app.models.delivery import Delivery
from app.models.buyer import Buyer
from app.models.notification import Notification
from app.models.forecast import Forecast
from app.models.cart_item import CartItem
from app.models.logistics import Worker, Vehicle, DeliveryAssignment, RouteStop, DeliveryEvent, ShortageReport


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
    allow_origins=settings.get_cors_origins(),
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
    delivery_columns = {column["name"] for column in inspect(engine).get_columns("deliveries")}
    product_columns = {column["name"] for column in inspect(engine).get_columns("products")}
    with engine.begin() as connection:
        if "current_location" not in delivery_columns:
            connection.execute(text("ALTER TABLE deliveries ADD COLUMN current_location VARCHAR"))
        if "route" not in delivery_columns:
            connection.execute(text("ALTER TABLE deliveries ADD COLUMN route VARCHAR"))
        if "farmer_id" not in product_columns:
            connection.execute(text("ALTER TABLE products ADD COLUMN farmer_id INTEGER"))
        if "is_upcoming" not in product_columns:
            connection.execute(text("ALTER TABLE products ADD COLUMN is_upcoming BOOLEAN DEFAULT FALSE"))
        if "harvest_date" not in product_columns:
            connection.execute(text("ALTER TABLE products ADD COLUMN harvest_date DATE"))
    print("✅ ANNAM database tables created successfully!")


# --------------------------------------------------
# HOME ROUTE
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "Welcome to ANNAM API"
    }


@app.get("/health")
def health_check():
    """Readiness probe: only healthy when the API can query its configured DB."""
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception as error:
        # Do not expose credentials or driver details to callers.
        return {"status": "degraded", "database": "unavailable", "detail": str(error).split("\n")[0]}


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

app.include_router(
    upcoming_harvests_router,
    prefix="/upcoming-harvests",
    tags=["Upcoming Harvests"]
)

app.include_router(
    cart_router,
    prefix="/cart",
    tags=["Cart"]
)

# AI intelligence endpoints are served by this application (not a separate
# Swagger server), and are documented at the primary /docs URL.
app.include_router(
    ai_insights_router,
    prefix="/ai",
    tags=["AI Insights"]
)
