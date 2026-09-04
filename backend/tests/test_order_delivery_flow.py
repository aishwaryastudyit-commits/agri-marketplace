from fastapi.testclient import TestClient

from app.main import app


def test_paid_order_can_be_dispatched_and_tracked():
    with TestClient(app) as client:
        buyer = client.post("/buyers/", params={"full_name": "Flow Buyer", "phone": "9000000101", "location": "Chennai", "buyer_type": "consumer"}).json()
        farmer = client.post("/farmers/", json={"full_name": "Flow Farmer", "phone": "9000000102", "location": "Madurai"}).json()
        product = client.post("/products/", json={"name": "Flow Tomato", "category": "Vegetables", "price": 20, "quantity": 500, "unit": "kg", "farmer_name": "Flow Farmer", "farmer_id": farmer["id"], "location": "Madurai"}).json()
        order = client.post("/orders/", params={"buyer_id": buyer["id"], "product_id": product["id"], "quantity": 100}).json()
        queued_delivery = client.get("/logistics/", params={"buyer_id": buyer["id"]}).json()[0]
        assert queued_delivery["order_id"] == order["id"]
        assert queued_delivery["current_location"] == "Order placed — payment verification pending"
        payment = client.post("/payments/", params={"order_id": order["id"], "payment_method": "UPI"}).json()
        assert client.put(f"/payments/{payment['id']}/success").status_code == 200
        delivery = client.get("/logistics/", params={"buyer_id": buyer["id"]}).json()[0]
        assert delivery["id"] == queued_delivery["id"]
        ready = client.post(f"/logistics/{delivery['id']}/farmer-ready", params={"farmer_id": farmer["id"]})
        assert ready.status_code == 200, ready.text
        assert ready.json()["current_location"] == "Farm gate: produce ready for pickup"
        # The same farmer action is safely idempotent and does not create a
        # second delivery job or duplicate handover state.
        assert client.post(f"/logistics/{delivery['id']}/farmer-ready", params={"farmer_id": farmer["id"]}).status_code == 200
        farmer_order = client.get(f"/farmers/{farmer['id']}/orders").json()[0]
        assert farmer_order["delivery_id"] == delivery["id"]
        assert farmer_order["buyer_type"] == "consumer"

        client.post("/auth/register", json={"full_name": "Dispatcher", "email": "dispatcher-flow@example.com", "password": "safe-password", "role": "logistics"})
        token = client.post("/auth/login", json={"email": "dispatcher-flow@example.com", "password": "safe-password"}).json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        worker_data = client.post("/logistics/workers", headers=headers, json={"full_name": "Driver One", "phone": "9000000103", "vehicle_registration": "TN-01-TEST", "capacity_kg": 200}).json()
        dispatched = client.post(f"/logistics/{delivery['id']}/dispatch", headers=headers, json={"worker_id": worker_data["worker"]["id"], "vehicle_id": worker_data["vehicle"]["id"]})
        assert dispatched.status_code == 200, dispatched.text
        assert client.post(f"/logistics/{delivery['id']}/route", headers=headers, json=[{"stop_type": "pickup", "label": "Madurai Farm"}, {"stop_type": "dropoff", "label": "Chennai Buyer"}]).status_code == 200
        assert client.post(f"/logistics/{delivery['id']}/transition/going_to_pickup", headers=headers).status_code == 200
        for status in ("picking_up", "picked_up", "out_for_delivery", "delivered"):
            assert client.post(f"/logistics/{delivery['id']}/transition/{status}", headers=headers).status_code == 200
        events = client.get(f"/logistics/{delivery['id']}/events", headers=headers).json()
        assert any(event["event_type"] == "assignment" for event in events)
        assert any(event["event_type"] == "farmer_ready" for event in events)
        assert client.get("/orders/", params={"buyer_id": buyer["id"]}).json()[0]["status"] == "delivered"
        notifications = client.get(f"/notifications/user/{buyer['id']}").json()
        assert any(item["title"] == "Farm pickup ready" for item in notifications)
        assert any(item["message"].endswith("Delivered.") for item in notifications)
