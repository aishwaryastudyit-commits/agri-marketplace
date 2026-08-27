"""
Recommendation layer: combines forecasting + farmer data to answer
"what should this farmer grow/sell more of?" and "which farmers should
this buyer consider?".
"""
import pandas as pd
from pathlib import Path
from forecasting.model import top_demand_products, forecast_demand

FARMERS_PATH = Path(__file__).parent.parent / "data" / "farmers.csv"


def recommend_for_farmer(farmer_location: str, current_product: str | None = None) -> dict:
    """
    Suggests high-demand products a farmer in this location should consider,
    optionally flagging whether their current product is trending up or down.
    """
    top_products = top_demand_products(farmer_location, top_n=3)

    current_status = None
    if current_product:
        current_status = forecast_demand(current_product, farmer_location)

    return {
        "location": farmer_location,
        "recommended_products": top_products,
        "current_product_forecast": current_status,
    }


def recommend_farmers_for_buyer(product: str, location: str, top_n: int = 5) -> list[dict]:
    """
    Ranks individual farmers for a buyer browsing a specific product,
    factoring in rating and price (distinct from bulk-pooling logic in
    demand_matching, which is for fulfilling large orders).
    """
    farmers = pd.read_csv(FARMERS_PATH)
    candidates = farmers[farmers["product"].str.lower() == str(product).lower()].copy()
    if candidates.empty:
        return []

    candidates["same_location"] = candidates["location"].str.lower() == str(location).lower()
    max_price = float(candidates["price_per_kg"].max())
    candidates["score"] = (
        candidates["same_location"].astype(int) * 25
        + (candidates["rating"] / 5.0) * 40
        + (1.0 - (candidates["price_per_kg"] / max(max_price, 1.0))) * 35
    )
    candidates = candidates.sort_values("score", ascending=False).head(top_n)

    return candidates[
        ["farmer_id", "location", "price_per_kg", "rating", "available_qty_kg"]
    ].round(2).to_dict(orient="records")

