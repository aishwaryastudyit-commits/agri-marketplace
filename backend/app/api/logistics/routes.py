from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services import logistics_service
from app.services import dispatch_service
from app.models.logistics import DeliveryEvent, Vehicle, Worker
from app.core.security import require_roles


router = APIRouter()
subscribers: set[WebSocket] = set()


class WorkerRequest(BaseModel):
    full_name: str
    phone: str
    vehicle_registration: str
    vehicle_type: str = "Truck"
    capacity_kg: float = Field(gt=0)


class AssignmentRequest(BaseModel):
    worker_id: int
    vehicle_id: int


class StopRequest(BaseModel):
    stop_type: str
    label: str
    latitude: float | None = Field(None, ge=-90, le=90)
    longitude: float | None = Field(None, ge=-180, le=180)


class LocationRequest(BaseModel):
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    recorded_at: datetime


async def broadcast(event: dict):
    stale = []
    for socket in subscribers:
        try: await socket.send_json(event)
        except Exception: stale.append(socket)
    for socket in stale: subscribers.discard(socket)


@router.websocket("/ws")
async def logistics_updates(socket: WebSocket):
    await socket.accept(); subscribers.add(socket)
    try:
        while True: await socket.receive_text()
    except WebSocketDisconnect:
        subscribers.discard(socket)


@router.post("/workers")
def register_worker(data: WorkerRequest, db: Session = Depends(get_db), identity=Depends(require_roles("worker", "logistics", "admin"))):
    worker = db.query(Worker).filter_by(phone=data.phone).first()
    is_self_service = identity["role"] == "worker"
    if not worker:
        worker = Worker(full_name=data.full_name, phone=data.phone, user_id=int(identity["sub"]) if is_self_service else None)
        db.add(worker); db.flush()
    else:
        if is_self_service and worker.user_id not in (None, int(identity["sub"])):
            raise HTTPException(status_code=403, detail="This worker profile belongs to another account")
        if is_self_service:
            worker.user_id = int(identity["sub"])
        worker.full_name = data.full_name
    vehicle = db.query(Vehicle).filter_by(registration_number=data.vehicle_registration).first()
    if not vehicle:
        vehicle = Vehicle(worker_id=worker.id, registration_number=data.vehicle_registration, vehicle_type=data.vehicle_type, capacity_kg=data.capacity_kg)
        db.add(vehicle)
    else:
        vehicle.worker_id, vehicle.vehicle_type, vehicle.capacity_kg, vehicle.active = worker.id, data.vehicle_type, data.capacity_kg, True
    db.commit(); db.refresh(worker); db.refresh(vehicle)
    return {"worker": worker, "vehicle": vehicle}


@router.get("/workers")
def list_workers(db: Session = Depends(get_db), identity=Depends(require_roles("worker", "logistics", "admin"))):
    workers = db.query(Worker).filter_by(active=True)
    if identity["role"] == "worker":
        workers = workers.filter(Worker.user_id == int(identity["sub"]))
    workers = workers.all()
    return [{"worker": worker, "vehicle": db.query(Vehicle).filter_by(worker_id=worker.id, active=True).first()} for worker in workers]


@router.post("/{delivery_id}/dispatch")
async def dispatch_delivery(delivery_id: int, data: AssignmentRequest, db: Session = Depends(get_db), identity=Depends(require_roles("worker", "logistics", "admin"))):
    try:
        if identity["role"] == "worker":
            worker = db.query(Worker).filter_by(id=data.worker_id).first()
            if not worker or worker.user_id != int(identity["sub"]):
                raise HTTPException(status_code=403, detail="Workers can only accept deliveries assigned to themselves")
        assignment = dispatch_service.assign(db, delivery_id, data.worker_id, data.vehicle_id)
        await broadcast({"type": "assignment", "delivery_id": delivery_id, "status": "assigned"})
        return assignment
    except ValueError as error: raise HTTPException(status_code=400, detail=str(error))


@router.post("/{delivery_id}/route")
async def plan_route(delivery_id: int, stops: list[StopRequest], db: Session = Depends(get_db), identity=Depends(require_roles("logistics", "admin"))):
    if not stops or stops[0].stop_type != "pickup" or stops[-1].stop_type != "dropoff":
        raise HTTPException(status_code=400, detail="Route must begin with pickup and end with dropoff")
    try:
        route = dispatch_service.create_route(db, delivery_id, [stop.model_dump() for stop in stops])
        await broadcast({"type": "route", "delivery_id": delivery_id})
        return route
    except ValueError as error: raise HTTPException(status_code=404, detail=str(error))


@router.post("/{delivery_id}/transition/{status}")
async def transition_delivery(delivery_id: int, status: str, db: Session = Depends(get_db), identity=Depends(require_roles("worker", "logistics", "admin"))):
    try:
        delivery = dispatch_service.transition(db, delivery_id, status, identity["role"])
        await broadcast({"type": "status", "delivery_id": delivery_id, "status": delivery.delivery_status})
        return delivery
    except ValueError as error: raise HTTPException(status_code=400, detail=str(error))


@router.post("/{delivery_id}/farmer-ready")
async def farmer_ready_for_pickup(delivery_id: int, farmer_id: int, db: Session = Depends(get_db)):
    try:
        delivery = logistics_service.mark_farmer_ready(db, delivery_id, farmer_id)
        await broadcast({"type": "farmer_ready", "delivery_id": delivery_id, "status": delivery["delivery_status"]})
        return delivery
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))


@router.post("/{delivery_id}/gps")
async def update_gps(delivery_id: int, data: LocationRequest, db: Session = Depends(get_db), identity=Depends(require_roles("worker", "logistics", "admin"))):
    try:
        delivery = dispatch_service.record_location(db, delivery_id, data.latitude, data.longitude, data.recorded_at.replace(tzinfo=None))
        await broadcast({"type": "gps", "delivery_id": delivery_id, "latitude": data.latitude, "longitude": data.longitude})
        return delivery
    except ValueError as error: raise HTTPException(status_code=400, detail=str(error))


@router.get("/{delivery_id}/events")
def delivery_events(delivery_id: int, db: Session = Depends(get_db), identity=Depends(require_roles("worker", "logistics", "admin", "consumer", "bulk_buyer"))):
    return db.query(DeliveryEvent).filter_by(delivery_id=delivery_id).order_by(DeliveryEvent.occurred_at.desc()).all()


# =========================================================
# GET ALL DELIVERIES
# =========================================================

@router.get("/")
def get_deliveries(
    buyer_id: int = None,
    db: Session = Depends(get_db)
):
    return logistics_service.get_all_deliveries(db, buyer_id=buyer_id)


# =========================================================
# CREATE DELIVERY
# =========================================================

@router.post("/")
def create_delivery(
    order_id: int,
    delivery_address: str,
    assigned_driver: str = None,
    tracking_number: str = None,
    current_location: str = None,
    route: str = None,
    db: Session = Depends(get_db)
):

    try:

        return logistics_service.create_delivery(
            db=db,
            order_id=order_id,
            delivery_address=delivery_address,
            assigned_driver=assigned_driver,
            tracking_number=tracking_number,
            current_location=current_location,
            route=route
        )

    except ValueError as error:

        message = str(error)

        if message == "Order not found":
            raise HTTPException(
                status_code=404,
                detail=message
            )

        raise HTTPException(
            status_code=400,
            detail=message
        )


# =========================================================
# UPDATE DELIVERY STATUS
# =========================================================

@router.put("/{delivery_id}/status")
def update_delivery_status(
    delivery_id: int,
    delivery_status: str,
    db: Session = Depends(get_db)
):

    try:

        return logistics_service.update_delivery_status(
            db=db,
            delivery_id=delivery_id,
            delivery_status=delivery_status
        )

    except ValueError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error)
        )


@router.put("/{delivery_id}/location")
def update_delivery_location(
    delivery_id: int,
    current_location: str,
    route: str = None,
    db: Session = Depends(get_db)
):
    try:
        return logistics_service.update_delivery_location(
            db=db,
            delivery_id=delivery_id,
            current_location=current_location,
            route=route
        )
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))


# =========================================================
# TRACK DELIVERY
# =========================================================

@router.get("/track/{tracking_number}")
def track_logistics(
    tracking_number: str,
    db: Session = Depends(get_db)
):

    try:

        return logistics_service.track_delivery(
            db=db,
            tracking_number=tracking_number
        )

    except ValueError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error)
        )


@router.put("/{delivery_id}/assign")
def assign_delivery(
    delivery_id: int,
    assigned_driver: str,
    route: str = None,
    db: Session = Depends(get_db)
):
    try:
        return logistics_service.assign_delivery(db, delivery_id, assigned_driver, route)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))
