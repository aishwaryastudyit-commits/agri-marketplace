# ANNAM AI Engine

Standalone microservice providing demand forecasting, smart supply pooling / matching, and recommendations for the ANNAM Agri-Marketplace.

---

## 🚀 Quick Start (One Command)

### Option 1: Git Bash (MINGW64)
```bash
./run.sh
```

### Option 2: PowerShell
```powershell
.\run.ps1
```

### Option 3: Command Prompt (cmd.exe)
```cmd
run.bat
```

### Option 2: Manual Start
```powershell
# 1. Activate venv
.\venv\Scripts\Activate.ps1

# 2. Run server
uvicorn main:app --reload --port 8001
```

---

## 🌐 Endpoints & API Documentation

Once the server is running, access:

- **Interactive API Docs (Swagger UI)**: [http://127.0.0.1:8001/docs](http://127.0.0.1:8001/docs)
- **Alternative Docs (ReDoc)**: [http://127.0.0.1:8001/redoc](http://127.0.0.1:8001/redoc)
- **Health Check**: `GET http://127.0.0.1:8001/`

### Key Endpoints:
- `POST /forecast` : Predict demand (kg) for a product in a location over N days.
- `GET /forecast/top/{location}` : Ranked top demand products in a location.
- `POST /match` : Smart Supply Pooling & farmer matching for bulk orders.
- `POST /match/rematch` : Rematching logic after order cancellations.
- `POST /recommend/farmer` : Crop / product recommendations for farmers.
- `GET /recommend/buyer` : Recommended farmers for buyers browsing products.
