# ANNAM — Member 4 (AI & Smart Intelligence) — Complete Module Roadmap

**Owner:** Kalyaan Sundar A
**Module:** AI Engine (backend microservice) + AI Dashboard (frontend)
**Event:** SIH 2026

This is your single reference document for this module, start to finish. Follow it top to bottom.

---

## YOUR MODULE HAS TWO HALVES

```
┌─────────────────────────┐        ┌─────────────────────────┐
│   AI ENGINE (backend)    │  HTTP  │   AI DASHBOARD (frontend)│
│   Python + FastAPI       │◄──────►│   React                 │
│   forecasting, matching, │  JSON  │   charts, tables, UI    │
│   recommendations        │        │                         │
└─────────────────────────┘        └─────────────────────────┘
            ▲
            │ HTTP (same API)
            │
┌─────────────────────────┐
│  Aishwarya's Central     │
│  Backend calls your      │
│  engine too              │
└─────────────────────────┘
```

You own **both halves**. The backend engine is the brain (already built and running on your machine at `127.0.0.1:8001`). The frontend dashboard is the face — what judges and teammates actually see and click.

---

## PHASE 0 — Foundations (Do This First, Once)

- [ ] Confirm Node.js and Python versions match what the team agreed on (ask in group chat if unsure).
- [ ] Confirm your working folders:
  - Backend: `ai-engine/`
  - Frontend: `frontend/src/apps/admin/ai-dashboard/`
- [ ] Confirm your Git branch name (e.g. `member4-ai` or `feature/ai-engine`). **Never push directly to `main`.**
- [ ] Run `git pull` before starting any session, every single time.
- [ ] Do not touch: `farmer/`, `consumer/`, `bulk-buyer/`, `backend/` (Aishwarya's), `database/`, `App.jsx`, `main.jsx` in the frontend repo.

---

## PHASE 1 — Backend AI Engine (STATUS: Built, running locally)

You already have this working. Recap of what exists in `ai-engine/`:

```
ai-engine/
├── data/
│   └── generate_dummy_data.py   → creates farmers.csv, demand_history.csv, bulk_requests.csv
├── forecasting/
│   └── model.py                 → forecast_demand(), top_demand_products()
├── demand_matching/
│   └── matcher.py                → match_bulk_request(), rematch_after_cancellation()
├── recommendations/
│   └── recommender.py           → recommend_for_farmer(), recommend_farmers_for_buyer()
├── tests/
│   └── test_api.py              → 6 passing tests
├── main.py                      → FastAPI app, exposes all endpoints
└── requirements.txt
```

### 1.1 Verify it still runs
```
cd ai-engine
source venv/bin/activate      (or venv\Scripts\activate on Windows)
uvicorn main:app --reload --port 8001
```
Visit `127.0.0.1:8001/docs` and confirm all endpoints respond.

### 1.2 Endpoints you're shipping (this is your API contract)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Health check |
| POST | `/forecast` | Predict demand for a product+location |
| GET | `/forecast/top/{location}` | Top trending products in a location |
| POST | `/match` | Pool farmers to fulfil a bulk order |
| POST | `/match/rematch` | Find alternative buyer after cancellation |
| POST | `/recommend/farmer` | Suggest what a farmer should grow/sell |
| GET | `/recommend/buyer` | Rank farmers for a buyer's product search |

### 1.3 Things to improve here (in priority order, do only what time allows)

1. **Realism pass** — tune `generate_dummy_data.py` so numbers look sensible when judges see them (e.g. Tomato demand in Chennai should look bigger than a random village — adjust `base` values per product).
2. **Error handling** — make sure every endpoint returns a clean error (not a 500 crash) if given a product/location combo with no data. Already partly done in `forecast_demand`; check `/match` similarly.
3. **Add a `/summary` endpoint** (optional, high demo value) — one endpoint that returns forecast + matching + recommendation for a product+location in a single call, so your frontend dashboard can render everything with one fetch. This is a good "wow" endpoint for a live demo.
4. **CORS** — add this to `main.py` so your React frontend (running on a different port, e.g. 3000) can call your API without being blocked:
   ```python
   from fastapi.middleware.cors import CORSMiddleware
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["*"],   # tighten later to your frontend's actual URL
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```
   **Do this now** — it's the #1 thing that silently breaks frontend-backend integration and wastes hours if left for later.
5. **requirements.txt** — keep it updated if you add any new library. Tell the team in group chat when you do.

---

## PHASE 2 — AI Dashboard Frontend

This is what actually gets demoed. Build it in `frontend/src/apps/admin/ai-dashboard/`.

### 2.1 Folder structure (already scaffolded per your assignment)
```
ai-dashboard/
├── demand-forecast/
├── market-insights/
├── recommendations/
├── farmer-matching/
└── analytics/
```

### 2.2 Tech choices
- **React** (matches team stack)
- **Recharts** for charts (line chart for demand trend, bar chart for top products)
- **Axios or fetch** to call your FastAPI backend at `http://127.0.0.1:8001`
- **Tailwind** if the rest of the app uses it — check with Deepa/Harini's components for consistency

### 2.3 Build order (do in this sequence — each step is demoable on its own)

**Step 1 — API connection layer**
Create one file, e.g. `ai-dashboard/api.js`, with functions like:
```javascript
const BASE_URL = "http://127.0.0.1:8001";

export async function getForecast(product, location) {
  const res = await fetch(`${BASE_URL}/forecast`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product, location }),
  });
  return res.json();
}

export async function getTopProducts(location) {
  const res = await fetch(`${BASE_URL}/forecast/top/${location}`);
  return res.json();
}

export async function matchBulkRequest(product, location, required_qty_kg) {
  const res = await fetch(`${BASE_URL}/match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product, location, required_qty_kg }),
  });
  return res.json();
}

export async function recommendForFarmer(location, current_product) {
  const res = await fetch(`${BASE_URL}/recommend/farmer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ location, current_product }),
  });
  return res.json();
}

export async function recommendFarmersForBuyer(product, location) {
  const res = await fetch(`${BASE_URL}/recommend/buyer?product=${product}&location=${location}`);
  return res.json();
}
```
Later, when it goes live, `BASE_URL` just changes to your deployed URL — nothing else changes. This is the payoff of the API-first approach.

**Step 2 — `demand-forecast/` page**
- A dropdown for Product, a dropdown for Location.
- On selection, call `getForecast()`, show:
  - Predicted quantity (big number)
  - Confidence % (progress bar or badge)
  - Trend (rising/falling/stable) with an arrow icon
- Below it, a line chart of historical demand (you can add a `/forecast/history/{product}/{location}` endpoint later that returns the raw series if you want a real chart, not just the prediction).

**Step 3 — `market-insights/` page**
- Call `getTopProducts(location)` for a chosen location.
- Show a bar chart: top 3 products ranked by predicted demand.
- This page answers "what's hot right now" — good visual for judges.

**Step 4 — `farmer-matching/` page**
- A form: Product, Location, Required Quantity (simulating a bulk buyer request).
- On submit, call `matchBulkRequest()`.
- Show the result as a table: farmer ID, allocated qty, price, match score — and a summary line like "Fulfilled: 950 / 1000 kg using 3 farmers."
- This is your **Smart Supply Pooling** demo — probably your strongest visual moment.

**Step 5 — `recommendations/` page**
- Two tabs or sections:
  - **For Farmers**: pick a location + current product → show recommended products to grow.
  - **For Buyers**: pick a product + location → show ranked farmer list.

**Step 6 — `analytics/` page**
- Simple dashboard summary: cards showing total farmers, total products tracked, avg confidence across recent forecasts, etc. Mostly for visual polish — build this last, only if time remains.

### 2.4 Handling the "what if the backend isn't running" problem
Add a fallback: if a fetch fails (backend down, e.g. during judging if something crashes), show cached/dummy data instead of a blank error screen. A try/catch around each API call with a hardcoded fallback object keeps your dashboard from looking broken live.

---

## PHASE 3 — Integration With the Team

- [ ] Share the endpoint table (Phase 1.2) with Aishwarya so her central backend can call your engine the same way your frontend does.
- [ ] Confirm the actual field names your backend expects (`product`, `location`, `required_qty_kg` etc.) match what her database uses — small naming mismatches are the #1 integration bug. Get on a call and check field-by-field if possible.
- [ ] Agree on where your AI engine will run when deployed (same server as main backend? separate service? separate port?). For the hackathon, running it locally alongside the rest of the demo is fine.
- [ ] Push your work to your branch regularly (small commits, not one giant commit at the end). Suggested commit message pattern: `ai-engine: add forecasting confidence scoring`, `ai-dashboard: add farmer-matching page`.

---

## PHASE 4 — Testing & Polish

- [ ] Run `pytest tests/` in `ai-engine/` before every commit — should stay green.
- [ ] Click through every dashboard page yourself, pretending to be a judge — does every dropdown/button actually do something? Any dead links?
- [ ] Test with unusual inputs: a product/location combo with no data, quantity of 0, huge quantity (10,000 kg) — make sure nothing crashes on screen.
- [ ] Check loading states — while waiting for the API response, show a spinner or "Loading..." text instead of a blank flash.

---

## PHASE 5 — Demo Prep

Your module has 3 genuinely strong demo moments — plan to show these live, in this order:

1. **Demand Forecast** — "Here's what our AI predicts farmers should grow, based on demand trends" (shows intelligence).
2. **Smart Supply Pooling** (`farmer-matching`) — "A bulk buyer needs 1000kg tomatoes — no single farmer has that much, so our AI pools supply from multiple farmers automatically" (shows the actual innovation — this is ANNAM's core differentiator from a normal marketplace).
3. **Recommendations** — "The system tells farmers what to grow next based on demand, not guesswork" (ties back to the "why this matters" narrative).

Have one line ready for judges on **how** it works technically (e.g. "We use historical demand trend analysis with confidence scoring, and a weighted scoring algorithm for farmer-buyer matching factoring in location, price, and rating") — judges often ask "is this real ML or just hardcoded," so be ready to show the `/docs` Swagger page live as proof it's a real running service, not screenshots.

---

## QUICK REFERENCE — Your Full Checklist

- [ ] Phase 0: environment + branch confirmed
- [ ] Phase 1: backend engine running, CORS added, `/summary` endpoint (optional)
- [ ] Phase 2: all 5 dashboard pages built and connected to live API
- [ ] Phase 3: endpoint contract shared with Aishwarya, regular commits pushed
- [ ] Phase 4: tests passing, edge cases handled, loading states in place
- [ ] Phase 5: demo script rehearsed, `/docs` ready to show as proof of a real backend

You already have Phase 1 done and running. Everything above is what's left.
