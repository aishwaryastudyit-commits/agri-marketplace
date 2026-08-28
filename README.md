# ANNAM agri-marketplace

AI-powered farm-to-market platform connecting farmers directly with buyers through demand prediction, cooperative pooling, and smart logistics.

## Run locally

The frontend and backend are independent services:

```powershell
# Terminal 1
cd frontend
npm install
npm run dev

# Terminal 2
cd backend
python -m venv .venv
\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The frontend is usable without the backend in its default mock mode. See [frontend/README.md](frontend/README.md) and [backend/README.md](backend/README.md) for configuration details.
