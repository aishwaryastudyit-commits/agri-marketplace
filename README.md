# 🌾 ANNAM: AI-Powered Farm-to-Market Platform

> **Connecting farmers directly with buyers through demand prediction, cooperative pooling, smart logistics, and multilingual voice assistance.**

---

## 📌 Overview

**ANNAM** is an end-to-end intelligent agricultural marketplace ecosystem designed to eliminate middlemen, stabilize agricultural pricing, and optimize supply-chain logistics. By combining real-time demand forecasting with cooperative pooling and voice-first interfaces, ANNAM empowers smallholder farmers and provides bulk institutional buyers with reliable, transparent sourcing.

---

## 🚀 Key Features

- **📊 AI-Driven Demand Forecasting**: Predictive models analyzing seasonal trends, historical consumption, and market patterns to estimate demand across regional hubs.
- **🤝 Smart Cooperative Supply Pooling**: Automated multi-farmer order matching to fulfill large-scale institutional demands seamlessly.
- **🎙️ AgriVoice Multilingual Assistant**: Voice and IVR/DTMF interface designed for rural farmers to list produce, check market rates, and accept orders in their native languages.
- **🚚 Smart Logistics & Route Optimization**: Aggregated pickup scheduling, route planning, and batch delivery dispatch to minimize transport overhead and spoilage.
- **⚡ High-Performance Backend**: Fast, scalable FastAPI microservices with clean relational schemas and robust RESTful APIs.

---

## 🏗️ Architecture & Module Structure

```
annam-agri-marketplace/
├── 🤖 ai-engine/          # Machine learning microservice (Forecasting, Matching, Recommenders)
│   ├── forecasting/       # Demand & price prediction algorithms
│   ├── demand_matching/   # Cooperative pooling and rematching logic
│   ├── recommendations/   # Farmer crop guidance & buyer discovery
│   └── main.py            # FastAPI AI service entrypoint (Port 8001)
├── 🎙️ agrivoice/          # Voice & telephony services (IVR, DTMF, SMS, Voice AI)
├── ⚙️ backend/            # Primary marketplace API (Orders, Users, Listings, Auth)
├── 🚚 logistics/          # Delivery routing, aggregation pooling & dispatch
├── 💻 frontend/           # Farmer & buyer web applications
├── 🗄️ database/           # DB schema migrations and seed scripts
├── 🧪 tests/              # End-to-end and integration test suites
└── 📄 docker-compose.yml  # Multi-container orchestration
```

---

## 🛠️ Quick Start

### 1. Prerequisites
- **Python 3.10+** (Python 3.11 / 3.12 recommended)
- **Node.js 18+** & `npm`
- **Git**

### 2. AI Engine Setup
```bash
cd ai-engine

# Run the automated bootstrap script:
# On Windows (PowerShell):
.\run.ps1

# On Windows (CMD):
run.bat

# On Linux / macOS / Git Bash:
./run.sh
```
The AI Engine Swagger UI will be available at: **[http://127.0.0.1:8001/docs](http://127.0.0.1:8001/docs)**

### 3. Backend Setup
```bash
cd backend
python -m venv venv
# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 API Overview

| Service | Endpoint | Method | Description |
|---|---|---|---|
| **AI Engine** | `/forecast` | `POST` | Demand prediction (kg) for crops by region & horizon |
| **AI Engine** | `/forecast/top/{location}` | `GET` | Top high-demand crops in a specific region |
| **AI Engine** | `/match` | `POST` | Cooperative multi-farmer supply pooling |
| **AI Engine** | `/recommend/farmer` | `POST` | Actionable crop & planting recommendations |
| **AgriVoice** | `/voice/webhook` | `POST` | Telephony & speech-to-intent incoming webhook |
| **Logistics** | `/routes/optimize` | `POST` | Multi-stop pickup and delivery route planner |

---

## 🤝 Contribution & Branching

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd agri-marketplace
   ```
2. Create your feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "feat: add feature description"
   ```
4. Push to branch and open a Pull Request:
   ```bash
   git push origin feature/your-feature-name
   ```

---

## 📄 License
This project is licensed under the MIT License.
