from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.delivery import Delivery
from app.models.logistics import DeliveryAssignment, DeliveryEvent, RouteStop, ShortageReport, Vehicle, Worker
from app.models.order import Order
from app.services.notification_service import create_notification

STATUS_FLOW = {"pending": {"assigned"}, "assigned": {"going_to_pickup", "cancelled"}, "going_to_pickup": {"picking_up"}, "picking_up": {"picked_up"}, "picked_up": {"out_for_delivery"}, "out_for_delivery": {"delivered"}}


def event(db: Session, delivery_id: int, event_type: str, message: str, status=None, latitude=None, longitude=None):
    item = DeliveryEvent(delivery_id=delivery_id, event_type=event_type, status=status, message=message, latitude=latitude, longitude=longitude)
    db.add(item)
    return item


def assign(db: Session, delivery_id: int, worker_id: int, vehicle_id: int):
    delivery = db.query(Delivery).filter_by(id=delivery_id).with_for_update().first()
    worker = db.query(Worker).filter_by(id=worker_id, active=True).first()
    vehicle = db.query(Vehicle).filter_by(id=vehicle_id, active=True).first()
    order = db.query(Order).filter_by(id=delivery.order_id if delivery else None).first()
    if not delivery or not worker or not vehicle:
        raise ValueError("Delivery, worker, or vehicle not found")
    if vehicle.worker_id not in (None, worker.id):
        raise ValueError("Vehicle is not assigned to this worker")
    if worker.availability != "available":
        raise ValueError("Worker is not available")
    if vehicle.capacity_kg < order.quantity:
        raise ValueError("Vehicle capacity is below the delivery quantity")
    assignment = db.query(DeliveryAssignment).filter_by(delivery_id=delivery_id).first()
    if assignment:
        assignment.worker_id, assignment.vehicle_id = worker.id, vehicle.id
    else:
        assignment = DeliveryAssignment(delivery_id=delivery_id, worker_id=worker.id, vehicle_id=vehicle.id)
        db.add(assignment)
    worker.availability = "on_route"
    delivery.assigned_driver = worker.full_name
    delivery.delivery_status = "assigned"
    if order and order.status == "confirmed":
        order.status = "processing"
    delivery.current_location = "Driver assigned — awaiting pickup"
    event(db, delivery.id, "assignment", f"{worker.full_name} assigned with {vehicle.registration_number}", "assigned")
    db.commit(); db.refresh(assignment)
    return assignment


def transition(db: Session, delivery_id: int, status: str, actor_role: str):
    delivery = db.query(Delivery).filter_by(id=delivery_id).with_for_update().first()
    if not delivery:
        raise ValueError("Delivery not found")
    current, target = (delivery.delivery_status or "pending").lower(), status.lower()
    if target not in STATUS_FLOW.get(current, set()):
        raise ValueError(f"Invalid delivery transition: {current} → {target}")
    if actor_role not in {"worker", "logistics", "admin"}:
        raise ValueError("Only logistics staff can update delivery status")
    delivery.delivery_status = target
    order = db.query(Order).filter_by(id=delivery.order_id).first()
    order_statuses = {
        "going_to_pickup": "processing",
        "picking_up": "processing",
        "picked_up": "processing",
        "out_for_delivery": "shipped",
        "delivered": "delivered",
        "cancelled": "cancelled",
    }
    if order and target in order_statuses:
        order.status = order_statuses[target]
    event(db, delivery.id, "status", f"Delivery is {target.replace('_', ' ')}", target)
    if target in {"delivered", "cancelled"}:
        assignment = db.query(DeliveryAssignment).filter_by(delivery_id=delivery.id).first()
        if assignment:
            assignment.released_at = datetime.now(timezone.utc)
            worker = db.query(Worker).filter_by(id=assignment.worker_id).first()
            if worker: worker.availability = "available"
    db.commit(); db.refresh(delivery)
    if order:
        create_notification(
            db, order.buyer_id, "Delivery update",
            f"Order #{order.id}: {target.replace('_', ' ').title()}.", "delivery"
        )
    return delivery


def record_location(db: Session, delivery_id: int, latitude: float, longitude: float, recorded_at: datetime):
    delivery = db.query(Delivery).filter_by(id=delivery_id).first()
    if not delivery: raise ValueError("Delivery not found")
    if recorded_at > datetime.now(timezone.utc).replace(tzinfo=None): raise ValueError("Location timestamp cannot be in the future")
    delivery.current_location = f"{latitude:.5f}, {longitude:.5f}"
    event(db, delivery_id, "gps", "Driver GPS location updated", delivery.delivery_status, latitude, longitude)
    db.commit()
    return delivery


def create_route(db: Session, delivery_id: int, stops: list):
    if not db.query(Delivery).filter_by(id=delivery_id).first(): raise ValueError("Delivery not found")
    db.query(RouteStop).filter_by(delivery_id=delivery_id).delete()
    for index, stop in enumerate(stops, start=1):
        db.add(RouteStop(delivery_id=delivery_id, sequence=index, **stop))
    event(db, delivery_id, "route", f"Route planned with {len(stops)} stops")
    db.commit()
    return db.query(RouteStop).filter_by(delivery_id=delivery_id).order_by(RouteStop.sequence).all()
