"""
ANNAM AI Engine — standalone microservice (Member 4 module).

Run:
    pip install -r requirements.txt
    python data/generate_dummy_data.py     # only needed once, or when you want fresh data
    uvicorn main:app --reload --port 8001

Then open http://127.0.0.1:8001 for the AI Smart Dashboard & Master UI Template,
or http://127.0.0.1:8001/docs for interactive OpenAPI docs.

Aishwarya's central backend calls this service over HTTP — this engine
never touches the main ANNAM database directly, keeping AI fully decoupled.
"""
from pathlib import Path
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

from forecasting.model import forecast_demand, top_demand_products, get_demand_history
from demand_matching.matcher import match_bulk_request, rematch_after_cancellation
from recommendations.recommender import recommend_for_farmer, recommend_farmers_for_buyer

app = FastAPI(
    title="ANNAM AI Engine & Smart Intelligence",
    description="Demand forecasting, smart supply pooling, farmer-buyer matching, and crop recommendations for the ANNAM Agri-Marketplace.",
    version="0.2.0",
)

# ---------------------------------------------------------------------------
# CORS Middleware — Allows React frontend, team repos & external calls
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Request/response schemas
# ---------------------------------------------------------------------------
class ForecastRequest(BaseModel):
    product: str
    location: str
    horizon_days: int = 7


class MatchRequest(BaseModel):
    product: str
    location: str
    required_qty_kg: float


class RematchRequest(BaseModel):
    product: str
    location: str
    freed_qty_kg: float


class FarmerRecommendRequest(BaseModel):
    location: str
    current_product: str | None = None


class SummaryRequest(BaseModel):
    product: str
    location: str
    required_qty_kg: float = 1000.0
    horizon_days: int = 7


# ---------------------------------------------------------------------------
# Static Frontend Setup
# ---------------------------------------------------------------------------
FRONTEND_DIR = Path(__file__).parent / "frontend"
if FRONTEND_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@app.get("/")
def index_or_health(request: Request):
    """
    Renders the ANNAM Master UI Template and AI Dashboard if opened in browser,
    or returns API health JSON if called programmatically.
    """
    accept_header = request.headers.get("accept", "")
    index_file = FRONTEND_DIR / "index.html"
    if "text/html" in accept_header and index_file.exists():
        return FileResponse(index_file)
    return {"status": "ok", "service": "annam-ai-engine", "version": "0.2.0"}


@app.get("/health")
def health():
    return {"status": "ok", "service": "annam-ai-engine", "version": "0.2.0"}


@app.post("/forecast")
def forecast(req: ForecastRequest):
    result = forecast_demand(req.product, req.location, req.horizon_days)
    if result["predicted_qty_kg"] is None:
        raise HTTPException(status_code=404, detail=result["message"])
    return result


@app.get("/forecast/top/{location}")
def top_products(location: str, top_n: int = 3):
    return {"location": location, "top_products": top_demand_products(location, top_n)}


@app.get("/forecast/history/{product}/{location}")
def demand_history(product: str, location: str, limit_days: int = 30):
    return get_demand_history(product, location, limit_days)


@app.post("/match")
def match(req: MatchRequest):
    return match_bulk_request(req.product, req.location, req.required_qty_kg)


@app.post("/match/rematch")
def rematch(req: RematchRequest):
    return rematch_after_cancellation(req.product, req.location, req.freed_qty_kg)


@app.post("/recommend/farmer")
def recommend_farmer(req: FarmerRecommendRequest):
    return recommend_for_farmer(req.location, req.current_product)


@app.get("/recommend/buyer")
def recommend_buyer(product: str, location: str, top_n: int = 5):
    return {
        "product": product,
        "location": location,
        "recommended_farmers": recommend_farmers_for_buyer(product, location, top_n),
    }


@app.post("/summary")
def ai_summary(req: SummaryRequest):
    """
    High-value unified endpoint returning demand forecast, trending crops,
    smart supply pooling match, and farmer recommendations in a single call.
    """
    fc = forecast_demand(req.product, req.location, req.horizon_days)
    top_crops = top_demand_products(req.location, top_n=3)
    matching = match_bulk_request(req.product, req.location, req.required_qty_kg)
    buyer_recs = recommend_farmers_for_buyer(req.product, req.location, top_n=4)
    farmer_recs = recommend_for_farmer(req.location, req.product)

    return {
        "product": req.product,
        "location": req.location,
        "forecast": fc,
        "top_trending_crops": top_crops,
        "smart_supply_pooling": matching,
        "buyer_recommended_farmers": buyer_recs,
        "farmer_crop_advice": farmer_recs,
    }

