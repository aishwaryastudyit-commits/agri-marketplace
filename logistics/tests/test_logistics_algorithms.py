import pytest

from logistics.delivery.vehicle_assignment import assign_vehicle
from logistics.pooling.quantity_matching import can_pool, compatible_orders
from logistics.pooling.supply_pooling import create_pools
from logistics.routing.route_optimizer import optimize_route
from logistics.routing.distance_service import haversine_km
from logistics.optimization.priority_engine import prioritize_jobs, priority_score
from logistics.delivery.delivery_tracking import (
    can_transition,
    normalize_status,
    tracking_summary,
    tracking_timeline,
)


def test_assigns_smallest_available_vehicle_that_fits():
    result = assign_vehicle(
        {"id": "order-1", "quantity": 80},
        [
            {"id": "truck", "capacity": 500, "available": True},
            {"id": "van", "capacity": 100, "available": True},
            {"id": "bike", "capacity": 50, "available": True},
        ],
    )
    assert result["vehicle_id"] == "van"


def test_vehicle_assignment_returns_none_when_capacity_is_insufficient():
    assert assign_vehicle({"quantity": 501}, [{"id": "van", "capacity": 500}]) is None


def test_pooling_respects_capacity_and_compatibility():
    orders = [
        {"id": 1, "product_id": 10, "quantity": 40, "delivery_location": "Chennai"},
        {"id": 2, "product_id": 10, "quantity": 50, "delivery_location": "Chennai"},
        {"id": 3, "product_id": 10, "quantity": 30, "delivery_location": "Chennai"},
        {"id": 4, "product_id": 11, "quantity": 20, "delivery_location": "Chennai"},
    ]
    pools = create_pools(orders, max_quantity=100)
    assert [[order["id"] for order in pool] for pool in pools] == [[1, 2], [3], [4]]
    assert can_pool(pools[0], 100)
    assert compatible_orders(orders[0], orders[1])
    assert not compatible_orders(orders[0], orders[3])


def test_pooling_rejects_order_larger_than_capacity():
    with pytest.raises(ValueError, match="exceeds capacity"):
        create_pools([{"id": 1, "quantity": 101}], max_quantity=100)


def test_route_optimizer_visits_nearest_stops_first():
    start = {"latitude": 0, "longitude": 0}
    stops = [
        {"id": "far", "latitude": 4, "longitude": 0},
        {"id": "near", "latitude": 1, "longitude": 0},
        {"id": "middle", "latitude": 2, "longitude": 0},
    ]
    assert [stop["id"] for stop in optimize_route(start, stops)] == ["near", "middle", "far"]


def test_priority_score_and_sorting_put_urgent_perishables_first():
    jobs = [
        {"id": "normal", "priority": "normal"},
        {"id": "urgent", "priority": "urgent", "is_perishable": True},
        {"id": "high", "priority": "high", "customer_waiting": True},
    ]
    assert priority_score(jobs[1]) > priority_score(jobs[2])
    assert [job["id"] for job in prioritize_jobs(jobs)] == ["urgent", "high", "normal"]


def test_haversine_distance_is_zero_for_same_location():
    point = {"latitude": 13.0827, "longitude": 80.2707}
    assert haversine_km(point, point) == pytest.approx(0)


def test_tracking_normalizes_backend_statuses_and_marks_progress():
    assert normalize_status("processing") == "picked_up"
    timeline = tracking_timeline("out_for_delivery")
    assert [step["completed"] for step in timeline] == [True, True, True, False]
    assert timeline[2]["current"] is True


def test_tracking_rejects_status_regression():
    assert can_transition("picked_up", "out_for_delivery")
    assert can_transition("out_for_delivery", "out_for_delivery")
    assert not can_transition("out_for_delivery", "picked_up")
    with pytest.raises(ValueError, match="Unknown delivery status"):
        tracking_timeline("lost")


def test_tracking_summary_keeps_shared_order_and_delivery_ids():
    result = tracking_summary({
        "id": 8,
        "order_id": 105,
        "tracking_number": "ANNAM-105",
        "delivery_status": "delivered",
        "delivery_address": "Chennai",
        "assigned_driver": "Kishore",
    })
    assert result["delivery_id"] == 8
    assert result["order_id"] == 105
    assert result["timeline"][-1]["current"] is True