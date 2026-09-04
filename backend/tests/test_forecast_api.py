from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_forecast_prediction_endpoint():
    response = client.post(
        "/forecasts/predict",
        json={
            "product": "Tomato",
            "location": "Chennai",
            "horizon_days": 7,
        },
    )

    assert response.status_code == 200, response.text
    payload = response.json()
    assert payload["product"] == "Tomato"
    assert payload["location"] == "Chennai"
    assert payload["horizon_days"] == 7
    assert payload["predicted_qty_kg"] is not None
