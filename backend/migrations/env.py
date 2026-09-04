from alembic import context
from app.core.database import build_database_url
from app.models.base import Base
from app.models import user, product, farmer, buyer, order, payment, delivery, notification, forecast, cart_item, logistics  # noqa: F401

config = context.config
config.set_main_option("sqlalchemy.url", build_database_url())
target_metadata = Base.metadata

def run_migrations_offline():
    context.configure(url=config.get_main_option("sqlalchemy.url"), target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction(): context.run_migrations()

def run_migrations_online():
    from sqlalchemy import create_engine
    engine = create_engine(config.get_main_option("sqlalchemy.url"))
    with engine.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction(): context.run_migrations()

if context.is_offline_mode(): run_migrations_offline()
else: run_migrations_online()
