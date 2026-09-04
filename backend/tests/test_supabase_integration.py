import os

from app.core import database
from app.models.notification import Notification


def test_build_database_url_from_supabase_env(monkeypatch):
    monkeypatch.delenv("DATABASE_URL", raising=False)
    monkeypatch.delenv("SUPABASE_DATABASE_URL", raising=False)
    monkeypatch.setenv("DB_USER", "demo_user")
    monkeypatch.setenv("DB_PASSWORD", "demo_pass")
    monkeypatch.setenv("DB_HOST", "aws-0-ap-southeast-1.pooler.supabase.com")
    monkeypatch.setenv("DB_PORT", "6543")
    monkeypatch.setenv("DB_NAME", "postgres")

    url = database.build_database_url()

    assert url.startswith("postgresql+psycopg://demo_user:demo_pass@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres")
    assert "sslmode=require" in url
    assert "pgbouncer" not in url


def test_notification_model_is_registered():
    assert Notification.__tablename__ == "notifications"


def test_normalizes_supabase_dashboard_database_url(monkeypatch):
    monkeypatch.setenv("DATABASE_URL", "postgresql://postgres:secret@example.supabase.co:5432/postgres")

    assert database.build_database_url().startswith("postgresql+psycopg://")
