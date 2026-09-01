from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.forecast import Forecast


router = APIRouter()


class ForecastRequest(BaseModel):
    product: str
    location: str
    horizon_days: int = 7


def _forecast_from_history(product: str, location: str, horizon_days: int = 7) -> dict:
    import numpy as np

    product_name = product.strip()
    location_name = location.strip()

    if not product_name or not location_name:
        raise HTTPException(status_code=400, detail="Product and location are required")

    if horizon_days <= 0:
        raise HTTPException(status_code=400, detail="horizon_days must be greater than 0")

    base = max(horizon_days, 1)
    base_qty = 120.0 if product_name.lower() == "tomato" else 95.0
    seasonal = 1.18 if location_name.lower() in {"chennai", "madurai", "coimbatore", "trichy"} else 1.0
    trend_factor = 1.0 + (horizon_days - 7) * 0.03
    predicted_qty = round(float(base_qty * seasonal * trend_factor * (1 + np.random.default_rng(42).uniform(0.05, 0.22))), 2)

    confidence = 78.0 if horizon_days <= 7 else 72.0
    trend = "rising" if predicted_qty > base_qty else "stable"

    return {
        "product": product_name,
        "location": location_name,
        "horizon_days": horizon_days,
        "predicted_qty_kg": predicted_qty,
        "confidence": confidence,
        "trend": trend,
        "daily_avg_kg": round(predicted_qty / base, 2),
        "message": "Forecast generated successfully",
    }


@router.get("/")
def get_forecasts(db: Session = Depends(get_db)):
    forecasts = db.query(Forecast).order_by(Forecast.created_at.desc()).all()
    return forecasts


@router.post("/predict")
def predict_forecast(data: ForecastRequest, db: Session = Depends(get_db)):
    result = _forecast_from_history(data.product, data.location, data.horizon_days)

    forecast_record = Forecast(
        product=data.product,
        location=data.location,
        horizon_days=data.horizon_days,
        predicted_qty_kg=result["predicted_qty_kg"],
        confidence=result["confidence"],
        trend=result["trend"],
    )

    db.add(forecast_record)
    db.commit()
    db.refresh(forecast_record)

    return result


@router.get("/{forecast_id}")
def get_forecast(forecast_id: int, db: Session = Depends(get_db)):
    forecast = db.query(Forecast).filter(Forecast.id == forecast_id).first()
    if not forecast:
        raise HTTPException(status_code=404, detail="Forecast not found")
    return forecast
