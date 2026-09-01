from urllib.parse import quote_plus

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings


def build_database_url() -> str:
    database_url = settings.get_database_url()
    if database_url:
        return database_url

    db_user = settings.get_db_user()
    db_password = settings.get_db_password()
    db_host = settings.get_db_host()
    db_name = settings.get_db_name()
    db_port = settings.get_db_port()
    db_sslmode = settings.get_db_sslmode()

    if db_user and db_password and db_host and db_name:
        password = quote_plus(db_password)
        url = (
            f"postgresql+psycopg://{db_user}:{password}"
            f"@{db_host}:{db_port}/{db_name}"
        )

        if db_sslmode:
            url = f"{url}?sslmode={db_sslmode}"

        return url

    return "sqlite:///./annam.db"


database_url = build_database_url()


connect_args = {}
if database_url.startswith("postgresql"):
    connect_args.update({
        "sslmode": "require",
        "prepare_threshold": 0,
    })
else:
    connect_args = {"check_same_thread": False}


engine = create_engine(
    database_url,
    pool_pre_ping=True,
    connect_args=connect_args
)


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()