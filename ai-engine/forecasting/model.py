"""
Demand forecasting: predicts expected demand (kg) for a product+location
combo over the next N days, using historical demand_history.csv.

Approach (deliberately simple for a hackathon timeline, but real):
- Rolling average as the baseline signal
- Linear regression on day-index to capture trend
- Confidence = inverse of recent volatility, scaled to a percentage

This is intentionally lightweight (no heavy ML infra) so it trains and
predicts in milliseconds, which matters for a live demo.
"""
import pandas as pd
import numpy as np
from pathlib import Path
from sklearn.linear_model import LinearRegression

DATA_PATH = Path(__file__).parent.parent / "data" / "demand_history.csv"
_df_cache = None


def _load_data() -> pd.DataFrame:
    global _df_cache
    if _df_cache is None:
        if not DATA_PATH.exists():
            # Fallback auto-generate if missing
            from data.generate_dummy_data import generate_data
            generate_data()
        _df_cache = pd.read_csv(DATA_PATH, parse_dates=["date"])
    return _df_cache


def forecast_demand(product: str, location: str, horizon_days: int = 7) -> dict:
    """
    Returns predicted demand for `product` in `location` for the next
    `horizon_days`, plus a confidence score and trend label.
    """
    df = _load_data()
    subset = df[(df["product"].str.lower() == product.lower()) & (df["location"].str.lower() == location.lower())].sort_values("date")

    if subset.empty:
        return {
            "product": product,
            "location": location,
            "horizon_days": horizon_days,
            "predicted_qty_kg": None,
            "confidence": 0,
            "trend": "no_data",
            "message": f"No historical data for {product} in {location}.",
        }

    subset = subset.reset_index(drop=True)
    subset["day_index"] = np.arange(len(subset))

    X = subset[["day_index"]].values
    y = subset["qty_kg"].values

    model = LinearRegression().fit(X, y)

    future_index = np.arange(len(subset), len(subset) + horizon_days).reshape(-1, 1)
    predictions = model.predict(future_index)
    predicted_total = max(0, float(np.sum(predictions)))

    # Confidence: lower recent volatility (std dev of last 14 days) -> higher confidence
    recent = subset.tail(14)["qty_kg"]
    volatility = float(recent.std()) / (float(recent.mean()) + 1e-6)
    confidence = round(max(45.0, min(98.0, 95.0 - volatility * 80.0)), 1)

    slope = float(model.coef_[0])
    trend = "rising" if slope > 0.4 else "falling" if slope < -0.4 else "stable"

    return {
        "product": product,
        "location": location,
        "horizon_days": horizon_days,
        "predicted_qty_kg": round(predicted_total, 1),
        "confidence": confidence,
        "trend": trend,
        "daily_avg_kg": round(float(predicted_total / max(horizon_days, 1)), 1),
    }


def top_demand_products(location: str, top_n: int = 3) -> list[dict]:
    """Ranks products by predicted 7-day demand for a given location."""
    df = _load_data()
    products = df["product"].unique()
    results = [forecast_demand(p, location) for p in products]
    results = [r for r in results if r["predicted_qty_kg"] is not None]
    results.sort(key=lambda r: r["predicted_qty_kg"], reverse=True)
    return results[:top_n]


def get_demand_history(product: str, location: str, limit_days: int = 30) -> dict:
    """
    Returns daily historical demand series plus forecasted trend projection
    for plotting responsive charts on the frontend dashboard.
    """
    df = _load_data()
    subset = df[(df["product"].str.lower() == product.lower()) & (df["location"].str.lower() == location.lower())].sort_values("date")

    if subset.empty:
        return {"dates": [], "quantities": [], "projected": []}

    subset = subset.tail(limit_days)
    dates = [d.strftime("%Y-%m-%d") if hasattr(d, "strftime") else str(d) for d in subset["date"]]
    quantities = [round(float(q), 1) for q in subset["qty_kg"]]

    # Quick 7-day projection points
    fc = forecast_demand(product, location, horizon_days=7)
    daily_pred = fc.get("daily_avg_kg", 0)
    
    return {
        "product": product,
        "location": location,
        "dates": dates,
        "quantities": quantities,
        "forecast_7d_total": fc.get("predicted_qty_kg", 0),
        "daily_projected_kg": daily_pred,
        "confidence": fc.get("confidence", 0),
        "trend": fc.get("trend", "stable"),
    }

