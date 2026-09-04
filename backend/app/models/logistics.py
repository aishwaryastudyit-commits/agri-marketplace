from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.sql import func

from app.models.base import Base


class Worker(Base):
    __tablename__ = "workers"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=True, index=True)
    full_name = Column(String(150), nullable=False)
    phone = Column(String(30), nullable=False, unique=True)
    availability = Column(String(30), nullable=False, default="available", index=True)
    active = Column(Boolean, nullable=False, default=True)


class Vehicle(Base):
    __tablename__ = "vehicles"
    id = Column(Integer, primary_key=True)
    worker_id = Column(Integer, ForeignKey("workers.id"), nullable=True, index=True)
    registration_number = Column(String(50), nullable=False, unique=True)
    vehicle_type = Column(String(50), nullable=False)
    capacity_kg = Column(Float, nullable=False)
    active = Column(Boolean, nullable=False, default=True)


class DeliveryAssignment(Base):
    __tablename__ = "delivery_assignments"
    id = Column(Integer, primary_key=True)
    delivery_id = Column(Integer, ForeignKey("deliveries.id"), nullable=False, unique=True, index=True)
    worker_id = Column(Integer, ForeignKey("workers.id"), nullable=False, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False, index=True)
    assigned_at = Column(DateTime(timezone=True), server_default=func.now())
    released_at = Column(DateTime(timezone=True), nullable=True)


class RouteStop(Base):
    __tablename__ = "route_stops"
    id = Column(Integer, primary_key=True)
    delivery_id = Column(Integer, ForeignKey("deliveries.id"), nullable=False, index=True)
    sequence = Column(Integer, nullable=False)
    stop_type = Column(String(20), nullable=False)  # pickup or dropoff
    label = Column(String(200), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)


class DeliveryEvent(Base):
    __tablename__ = "delivery_events"
    id = Column(Integer, primary_key=True)
    delivery_id = Column(Integer, ForeignKey("deliveries.id"), nullable=False, index=True)
    event_type = Column(String(50), nullable=False, index=True)
    status = Column(String(50), nullable=True)
    message = Column(String(500), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    occurred_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)


class ShortageReport(Base):
    __tablename__ = "shortage_reports"
    id = Column(Integer, primary_key=True)
    delivery_id = Column(Integer, ForeignKey("deliveries.id"), nullable=False, index=True)
    route_stop_id = Column(Integer, ForeignKey("route_stops.id"), nullable=True)
    expected_quantity = Column(Float, nullable=False)
    actual_quantity = Column(Float, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
