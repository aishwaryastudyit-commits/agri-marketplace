from fastapi import FastAPI
from app.api.products.routes import router as products_router

app = FastAPI(
    title="ANNAM API"
)


@app.get("/")
def home():
    return {
        "message": "Welcome to ANNAM API"
    }


app.include_router(
    products_router,
    prefix="/products",
    tags=["Products"]
)