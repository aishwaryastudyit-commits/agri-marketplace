"""In-process access to ANNAM's AI models hosted by the main backend."""
from pathlib import Path
import sys


AI_ENGINE_DIR = Path(__file__).resolve().parents[2] / "ai_engine"
if str(AI_ENGINE_DIR) not in sys.path:
    sys.path.insert(0, str(AI_ENGINE_DIR))

from demand_matching.matcher import match_bulk_request, rematch_after_cancellation
from forecasting.model import forecast_demand, get_demand_history, top_demand_products
from recommendations.recommender import recommend_farmers_for_buyer, recommend_for_farmer


__all__ = [
    "forecast_demand",
    "get_demand_history",
    "top_demand_products",
    "match_bulk_request",
    "rematch_after_cancellation",
    "recommend_for_farmer",
    "recommend_farmers_for_buyer",
]
