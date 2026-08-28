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

The frontend currently defaults to mock mode because the orders and payments routers are still under team development. Switch `VITE_USE_MOCKS=false` only after those routes are available and configured in the frontend environment.
