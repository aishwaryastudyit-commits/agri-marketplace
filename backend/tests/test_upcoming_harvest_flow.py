from fastapi.testclient import TestClient

from app.main import app


def test_upcoming_harvest_stays_separate_until_farmer_publishes_it():
    with TestClient(app) as client:
        farmer = client.post(
            "/farmers/",
            json={"full_name": "Harvest Farmer", "phone": "9000000199", "location": "Thanjavur"},
        ).json()
        payload = {
            "name": "Harvest Tomato",
            "category": "Vegetables",
            "price": 32,
            "quantity": 250,
            "unit": "kg",
            "farmer_name": "Harvest Farmer",
            "farmer_id": farmer["id"],
            "location": "Thanjavur",
            "harvest_date": "2026-09-15",
        }

        created = client.post("/upcoming-harvests/", json=payload)
        assert created.status_code == 200, created.text
        harvest = created.json()

        assert client.get("/products/").json() == []
        assert client.get("/upcoming-harvests/").json()[0]["id"] == harvest["id"]

        published = client.post(
            f"/upcoming-harvests/{harvest['id']}/publish",
            params={"farmer_id": farmer["id"]},
        )
        assert published.status_code == 200, published.text
        assert published.json()["name"] == "Harvest Tomato"
        assert client.get("/upcoming-harvests/").json() == []
        assert client.get("/products/").json()[0]["name"] == "Harvest Tomato"
