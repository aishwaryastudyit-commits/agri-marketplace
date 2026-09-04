## ANNAM backend

The backend is a FastAPI application. Python 3.11 or newer is recommended.

### Setup on Windows PowerShell

```powershell
cd backend
python -m venv .venv
\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```

The API is available at `http://localhost:8000`; interactive documentation is at `/docs`.

## Supabase database

Copy `.env.example` to `.env`, then put the Supabase PostgreSQL connection URI
in `DATABASE_URL`. The API uses that database automatically. The React frontend
uses `VITE_API_URL` (see `frontend/.env.example`) and should not receive the
Supabase database password or service-role key.
AI forecasting, supplier matching, and recommendations are included in this
same API under `/ai` (for example, `POST /ai/summary`). No separate AI server
on port 8001 is required.

The frontend currently defaults to mock mode because the orders and payments routers are still under team development. Switch `VITE_USE_MOCKS=false` only after those routes are available and configured in the frontend environment.
