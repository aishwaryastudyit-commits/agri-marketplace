"""add persistent logistics foundation"""
from alembic import op
import sqlalchemy as sa

revision = "20260904_logistics_foundation"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table("workers", sa.Column("id", sa.Integer, primary_key=True), sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id"), unique=True), sa.Column("full_name", sa.String(150), nullable=False), sa.Column("phone", sa.String(30), nullable=False, unique=True), sa.Column("availability", sa.String(30), nullable=False, server_default="available"), sa.Column("active", sa.Boolean, nullable=False, server_default=sa.true()))
    op.create_table("vehicles", sa.Column("id", sa.Integer, primary_key=True), sa.Column("worker_id", sa.Integer, sa.ForeignKey("workers.id")), sa.Column("registration_number", sa.String(50), nullable=False, unique=True), sa.Column("vehicle_type", sa.String(50), nullable=False), sa.Column("capacity_kg", sa.Float, nullable=False), sa.Column("active", sa.Boolean, nullable=False, server_default=sa.true()))
    op.create_table("delivery_assignments", sa.Column("id", sa.Integer, primary_key=True), sa.Column("delivery_id", sa.Integer, sa.ForeignKey("deliveries.id"), nullable=False, unique=True), sa.Column("worker_id", sa.Integer, sa.ForeignKey("workers.id"), nullable=False), sa.Column("vehicle_id", sa.Integer, sa.ForeignKey("vehicles.id"), nullable=False), sa.Column("assigned_at", sa.DateTime(timezone=True), server_default=sa.func.now()), sa.Column("released_at", sa.DateTime(timezone=True)))
    op.create_table("route_stops", sa.Column("id", sa.Integer, primary_key=True), sa.Column("delivery_id", sa.Integer, sa.ForeignKey("deliveries.id"), nullable=False), sa.Column("sequence", sa.Integer, nullable=False), sa.Column("stop_type", sa.String(20), nullable=False), sa.Column("label", sa.String(200), nullable=False), sa.Column("latitude", sa.Float), sa.Column("longitude", sa.Float), sa.Column("completed_at", sa.DateTime(timezone=True)))
    op.create_table("delivery_events", sa.Column("id", sa.Integer, primary_key=True), sa.Column("delivery_id", sa.Integer, sa.ForeignKey("deliveries.id"), nullable=False), sa.Column("event_type", sa.String(50), nullable=False), sa.Column("status", sa.String(50)), sa.Column("message", sa.String(500), nullable=False), sa.Column("latitude", sa.Float), sa.Column("longitude", sa.Float), sa.Column("occurred_at", sa.DateTime(timezone=True), server_default=sa.func.now()))
    op.create_table("shortage_reports", sa.Column("id", sa.Integer, primary_key=True), sa.Column("delivery_id", sa.Integer, sa.ForeignKey("deliveries.id"), nullable=False), sa.Column("route_stop_id", sa.Integer, sa.ForeignKey("route_stops.id")), sa.Column("expected_quantity", sa.Float, nullable=False), sa.Column("actual_quantity", sa.Float, nullable=False), sa.Column("notes", sa.Text), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()))


def downgrade():
    for table in ("shortage_reports", "delivery_events", "route_stops", "delivery_assignments", "vehicles", "workers"):
        op.drop_table(table)
