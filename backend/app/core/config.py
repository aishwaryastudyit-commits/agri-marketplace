import os

from dotenv import load_dotenv


load_dotenv()


class Settings:
    @staticmethod
    def get_database_url():
        return os.getenv("DATABASE_URL") or os.getenv("SUPABASE_DATABASE_URL")

    @staticmethod
    def get_db_user():
        return os.getenv("DB_USER") or os.getenv("user")

    @staticmethod
    def get_db_password():
        return os.getenv("DB_PASSWORD") or os.getenv("password")

    @staticmethod
    def get_db_host():
        return os.getenv("DB_HOST") or os.getenv("host")

    @staticmethod
    def get_db_port():
        return os.getenv("DB_PORT") or os.getenv("port") or "5432"

    @staticmethod
    def get_db_name():
        return os.getenv("DB_NAME") or os.getenv("dbname") or os.getenv("POSTGRES_DB")

    @staticmethod
    def get_db_sslmode():
        return os.getenv("DB_SSLMODE") or os.getenv("sslmode") or "require"

    @staticmethod
    def get_cors_origins():
        """Return the browser origins permitted to call the API.

        Comma-separate values in ``CORS_ORIGINS`` make deployments configurable
        without exposing database credentials to the frontend.
        """
        configured = os.getenv("CORS_ORIGINS", "")
        if configured:
            return [origin.strip() for origin in configured.split(",") if origin.strip()]

        return [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ]


settings = Settings()
