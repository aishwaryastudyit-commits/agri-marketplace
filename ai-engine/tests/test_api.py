"""
Run with: pytest tests/
Requires data/generate_dummy_data.py to have been run first.
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health():
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


def test_forecast():
    resp = client.post("/forecast", json={"product": "Tomato", "location": "Chennai"})
    assert resp.status_code == 200
    body = resp.json()
    assert "predicted_qty_kg" in body
    assert body["confidence"] > 0


def test_forecast_history():
    resp = client.get("/forecast/history/Tomato/Chennai?limit_days=15")
    assert resp.status_code == 200
    body = resp.json()
    assert "dates" in body
    assert "quantities" in body
    assert len(body["dates"]) > 0


def test_top_products():
    resp = client.get("/forecast/top/Chennai")
    assert resp.status_code == 200
    assert len(resp.json()["top_products"]) > 0


def test_match():
    resp = client.post("/match", json={
        "product": "Tomato", "location": "Chennai", "required_qty_kg": 1000
    })
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] in ("fully_fulfilled", "partially_fulfilled", "unfulfilled")
    assert "total_estimated_cost" in body


def test_recommend_farmer():
    resp = client.post("/recommend/farmer", json={"location": "Chennai", "current_product": "Onion"})
    assert resp.status_code == 200
    assert "recommended_products" in resp.json()


def test_recommend_buyer():
    resp = client.get("/recommend/buyer", params={"product": "Tomato", "location": "Chennai"})
    assert resp.status_code == 200
    assert isinstance(resp.json()["recommended_farmers"], list)


def test_ai_summary():
    resp = client.post("/summary", json={"product": "Tomato", "location": "Chennai", "required_qty_kg": 1000})
    assert resp.status_code == 200
    body = resp.json()
    assert "forecast" in body
    assert "smart_supply_pooling" in body
    assert "top_trending_crops" in body

