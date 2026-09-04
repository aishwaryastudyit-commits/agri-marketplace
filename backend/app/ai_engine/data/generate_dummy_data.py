"""
Generates synthetic ANNAM data so the AI engine can be built and demoed
before real backend data exists. Run this once to create CSVs in data/.

Usage: python data/generate_dummy_data.py
"""
import numpy as np
import pandas as pd
from pathlib import Path

np.random.seed(42)
OUT_DIR = Path(__file__).parent

PRODUCTS = ["Tomato", "Onion", "Potato", "Rice", "Brinjal", "Cabbage", "Carrot"]
LOCATIONS = ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem"]

# ---------------------------------------------------------------------------
# 1. Farmers: who grows what, where, and how much they can supply
# ---------------------------------------------------------------------------
n_farmers = 60
farmers = pd.DataFrame({
    "farmer_id": [f"F{100+i}" for i in range(n_farmers)],
    "location": np.random.choice(LOCATIONS, n_farmers),
    "product": np.random.choice(PRODUCTS, n_farmers),
    "available_qty_kg": np.random.randint(50, 800, n_farmers),
    "price_per_kg": np.round(np.random.uniform(10, 60, n_farmers), 2),
    "rating": np.round(np.random.uniform(3.0, 5.0, n_farmers), 1),
})
farmers.to_csv(OUT_DIR / "farmers.csv", index=False)

# ---------------------------------------------------------------------------
# 2. Historical demand: daily quantity ordered per product/location for 180 days
#    Includes a weekly seasonality pattern + random noise so forecasting has
#    something real to learn from.
# ---------------------------------------------------------------------------
days = pd.date_range(end=pd.Timestamp.today(), periods=180, freq="D")
rows = []
for product in PRODUCTS:
    base = np.random.uniform(80, 300)  # baseline daily demand for this product
    for location in LOCATIONS:
        loc_factor = np.random.uniform(0.7, 1.4)
        for d in days:
            weekday_boost = 1.3 if d.dayofweek in (4, 5) else 1.0  # Fri/Sat spike
            seasonal = 1 + 0.15 * np.sin(2 * np.pi * d.dayofyear / 365)
            noise = np.random.normal(0, 15)
            qty = max(0, base * loc_factor * weekday_boost * seasonal + noise)
            rows.append([d.date().isoformat(), product, location, round(qty, 1)])

demand_history = pd.DataFrame(rows, columns=["date", "product", "location", "qty_kg"])
demand_history.to_csv(OUT_DIR / "demand_history.csv", index=False)

# ---------------------------------------------------------------------------
# 3. Bulk buyer requests: sample requests to test the matching/pooling engine
# ---------------------------------------------------------------------------
n_requests = 15
bulk_requests = pd.DataFrame({
    "request_id": [f"B{200+i}" for i in range(n_requests)],
    "product": np.random.choice(PRODUCTS, n_requests),
    "location": np.random.choice(LOCATIONS, n_requests),
    "required_qty_kg": np.random.randint(500, 3000, n_requests),
    "required_date": np.random.choice(
        pd.date_range(pd.Timestamp.today(), periods=14, freq="D").astype(str), n_requests
    ),
})
bulk_requests.to_csv(OUT_DIR / "bulk_requests.csv", index=False)

print("Generated: farmers.csv, demand_history.csv, bulk_requests.csv")
print(f"Farmers: {len(farmers)} | Demand rows: {len(demand_history)} | Bulk requests: {len(bulk_requests)}")
