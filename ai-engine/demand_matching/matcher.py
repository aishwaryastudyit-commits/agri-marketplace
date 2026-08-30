"""
Matches a bulk buyer's request against available farmers, pooling supply
from multiple farmers when a single farmer can't fulfil the full quantity.

Scoring considers: same-location bonus, price competitiveness, and rating.
This is the "Smart Supply Pooling" feature from the ANNAM architecture.
"""
import pandas as pd
from pathlib import Path

FARMERS_PATH = Path(__file__).parent.parent / "data" / "farmers.csv"
_farmers_cache = None


def _load_farmers() -> pd.DataFrame:
    global _farmers_cache
    if _farmers_cache is None:
        _farmers_cache = pd.read_csv(FARMERS_PATH)
    return _farmers_cache


def _score_farmer(farmer: pd.Series, location: str, avg_price: float) -> float:
    score = 0.0
    score += 30 if str(farmer["location"]).lower() == str(location).lower() else 5
    score += (float(farmer["rating"]) / 5.0) * 30
    # Cheaper than average price -> higher score, capped contribution
    price_ratio = avg_price / max(float(farmer["price_per_kg"]), 1.0)
    score += min(price_ratio, 1.5) * 20
    score += min(float(farmer["available_qty_kg"]) / 500.0, 1.0) * 20
    return round(score, 2)


def match_bulk_request(product: str, location: str, required_qty_kg: float) -> dict:
    """
    Finds enough farmers (same product) to fulfil required_qty_kg, prioritising
    same-location, well-rated, competitively-priced farmers. Pools supply
    across multiple farmers if needed.
    """
    farmers = _load_farmers()
    candidates = farmers[farmers["product"].str.lower() == str(product).lower()].copy()

    if candidates.empty:
        return {
            "product": product,
            "location": location,
            "required_qty_kg": required_qty_kg,
            "fulfilled_qty_kg": 0.0,
            "fulfillment_percentage": 0.0,
            "status": "no_farmers_found",
            "farmers_used": 0,
            "total_estimated_cost": 0.0,
            "avg_price_per_kg": 0.0,
            "matched_farmers": [],
        }

    avg_price = float(candidates["price_per_kg"].mean())
    candidates["match_score"] = candidates.apply(
        lambda f: _score_farmer(f, location, avg_price), axis=1
    )
    candidates = candidates.sort_values("match_score", ascending=False)

    matched = []
    remaining = float(required_qty_kg)
    total_cost = 0.0

    for _, farmer in candidates.iterrows():
        if remaining <= 0:
            break
        take_qty = min(float(farmer["available_qty_kg"]), remaining)
        item_cost = take_qty * float(farmer["price_per_kg"])
        total_cost += item_cost
        matched.append({
            "farmer_id": farmer["farmer_id"],
            "location": farmer["location"],
            "allocated_qty_kg": round(float(take_qty), 1),
            "available_qty_kg": float(farmer["available_qty_kg"]),
            "price_per_kg": round(float(farmer["price_per_kg"]), 2),
            "rating": float(farmer["rating"]),
            "match_score": float(farmer["match_score"]),
            "is_local": str(farmer["location"]).lower() == str(location).lower(),
        })
        remaining -= take_qty

    fulfilled_qty = float(required_qty_kg) - max(remaining, 0.0)
    status = "fully_fulfilled" if remaining <= 0 else (
        "partially_fulfilled" if fulfilled_qty > 0 else "unfulfilled"
    )
    fulfillment_pct = round((fulfilled_qty / max(float(required_qty_kg), 1.0)) * 100.0, 1)
    avg_blended_price = round(total_cost / max(fulfilled_qty, 1.0), 2) if fulfilled_qty > 0 else 0.0

    return {
        "product": product,
        "location": location,
        "required_qty_kg": float(required_qty_kg),
        "fulfilled_qty_kg": round(fulfilled_qty, 1),
        "fulfillment_percentage": fulfillment_pct,
        "status": status,
        "farmers_used": len(matched),
        "total_estimated_cost": round(total_cost, 2),
        "avg_price_per_kg": avg_blended_price,
        "matched_farmers": matched,
    }


def rematch_after_cancellation(product: str, location: str, freed_qty_kg: float) -> dict:
    """
    Simplified rematching: when a buyer cancels, look for another bulk
    request (product+location) that could absorb the freed supply.
    """
    requests_path = Path(__file__).parent.parent / "data" / "bulk_requests.csv"
    requests = pd.read_csv(requests_path)
    open_matches = requests[
        (requests["product"].str.lower() == str(product).lower()) & (requests["location"].str.lower() == str(location).lower())
    ]
    if open_matches.empty:
        # Broader search for same product across nearby regions
        broader = requests[requests["product"].str.lower() == str(product).lower()]
        if broader.empty:
            return {"status": "no_alternative_buyer_found", "freed_qty_kg": freed_qty_kg}
        best = broader.iloc[0]
        return {
            "status": "alternative_buyer_found_nearby",
            "matched_request_id": str(best["request_id"]),
            "buyer_location": str(best["location"]),
            "freed_qty_kg": freed_qty_kg,
            "requested_qty_kg": int(best["required_qty_kg"]),
        }

    best = open_matches.iloc[0]
    return {
        "status": "alternative_buyer_found",
        "matched_request_id": str(best["request_id"]),
        "buyer_location": str(best["location"]),
        "freed_qty_kg": freed_qty_kg,
        "requested_qty_kg": int(best["required_qty_kg"]),
    }

