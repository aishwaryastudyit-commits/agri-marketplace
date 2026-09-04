from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.integrations.ai_engine.service import (
    forecast_demand,
    get_demand_history,
    match_bulk_request,
    recommend_farmers_for_buyer,
    recommend_for_farmer,
    rematch_after_cancellation,
    top_demand_products,
)


router = APIRouter()


class ForecastRequest(BaseModel):
    product: str
    location: str
    horizon_days: int = Field(default=7, gt=0)


class MatchRequest(BaseModel):
    product: str
    location: str
    required_qty_kg: float = Field(gt=0)


class RematchRequest(BaseModel):
    product: str
    location: str
    freed_qty_kg: float = Field(gt=0)


class FarmerRecommendRequest(BaseModel):
    location: str
    current_product: str | None = None


class SummaryRequest(MatchRequest):
    horizon_days: int = Field(default=7, gt=0)


@router.get("/health")
def health():
    return {"status": "ok", "service": "annam-ai", "host": "main-backend"}


@router.post("/forecast")
def forecast(request: ForecastRequest):
    result = forecast_demand(request.product, request.location, request.horizon_days)
    if result["predicted_qty_kg"] is None:
        raise HTTPException(status_code=404, detail=result["message"])
    return result


@router.get("/forecast/top/{location}")
def top_products(location: str, top_n: int = 3):
    return {"location": location, "top_products": top_demand_products(location, top_n)}


@router.get("/forecast/history/{product}/{location}")
def demand_history(product: str, location: str, limit_days: int = 30):
    return get_demand_history(product, location, limit_days)


@router.post("/match")
def match(request: MatchRequest):
    return match_bulk_request(request.product, request.location, request.required_qty_kg)


@router.post("/match/rematch")
def rematch(request: RematchRequest):
    return rematch_after_cancellation(request.product, request.location, request.freed_qty_kg)


@router.post("/recommend/farmer")
def recommend_farmer(request: FarmerRecommendRequest):
    return recommend_for_farmer(request.location, request.current_product)


@router.get("/recommend/buyer")
def recommend_buyer(product: str, location: str, top_n: int = 5):
    return {
        "product": product,
        "location": location,
        "recommended_farmers": recommend_farmers_for_buyer(product, location, top_n),
    }


@router.post("/summary")
def ai_summary(request: SummaryRequest):
    return {
        "product": request.product,
        "location": request.location,
        "forecast": forecast_demand(request.product, request.location, request.horizon_days),
        "top_trending_crops": top_demand_products(request.location, top_n=3),
        "smart_supply_pooling": match_bulk_request(
            request.product, request.location, request.required_qty_kg
        ),
        "buyer_recommended_farmers": recommend_farmers_for_buyer(
            request.product, request.location, top_n=4
        ),
        "farmer_crop_advice": recommend_for_farmer(request.location, request.product),
    }
