from fastapi.testclient import TestClient

from app.main import app


def test_paid_bulk_order_is_persisted_as_a_logistics_job():
    with TestClient(app) as client:
        buyer = client.post(
            "/buyers/",
            params={"full_name": "Bulk Logistics Buyer", "phone": "9000000201", "location": "Chennai", "buyer_type": "bulk"},
        ).json()
        farmer = client.post(
            "/farmers/",
            json={"full_name": "Bulk Logistics Farmer", "phone": "9000000202", "location": "Madurai"},
        ).json()
        product = client.post(
            "/products/",
            json={"name": "Bulk Logistics Onion", "category": "Vegetables", "price": 30, "quantity": 500, "unit": "kg", "farmer_name": "Bulk Logistics Farmer", "farmer_id": farmer["id"], "location": "Madurai"},
        ).json()

        order = client.post(
            "/bulk-orders/",
            json={"buyer_id": buyer["id"], "items": [{"product_id": product["id"], "quantity": 100}]},
        ).json()["orders"][0]
        queued_delivery = client.get("/logistics/", params={"buyer_id": buyer["id"]}).json()[0]
        assert queued_delivery["order_id"] == order["id"]
        assert queued_delivery["current_location"] == "Order placed — payment verification pending"
        payment = client.post("/payments/", params={"order_id": order["id"], "payment_method": "UPI"}).json()
        assert client.put(f"/payments/{payment['id']}/success").status_code == 200

        delivery = client.get("/logistics/", params={"buyer_id": buyer["id"]}).json()[0]
        assert delivery["id"] == queued_delivery["id"]
        assert delivery["order_id"] == order["id"]
        assert delivery["farmer"] == "Bulk Logistics Farmer"
        assert delivery["buyer"] == "Bulk Logistics Buyer"
        assert delivery["delivery_status"] == "pending"
