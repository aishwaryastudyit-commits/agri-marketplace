import React, { useState, useEffect } from "react";
import { matchBulkRequest } from "../api";

export default function FarmerMatchingPage() {
  const [product, setProduct] = useState("Tomato");
  const [location, setLocation] = useState("Chennai");
  const [qty, setQty] = useState(1200);
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    runMatch();
  }, [product, location]);

  async function runMatch() {
    setLoading(true);
    const res = await matchBulkRequest(product, location, qty);
    setMatchData(res);
    setLoading(false);
  }

  return (
    <div className="farmer-matching-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">Smart Supply Pooling & Farmer Matcher 🤝</h1>
          <p className="page-subtitle">Pools supply across multiple verified farmers to fulfill large bulk orders.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-gold" onClick={runMatch} disabled={loading}>
            {loading ? "Matching..." : "⚡ Run AI Pooling"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "24px" }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Bulk Buyer Simulator</h3>
          </div>
          <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Produce</label>
              <select className="form-control" value={product} onChange={(e) => setProduct(e.target.value)}>
                <option value="Tomato">🍅 Tomato</option>
                <option value="Onion">🧅 Onion</option>
                <option value="Potato">🥔 Potato</option>
                <option value="Brinjal">🍆 Brinjal</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Destination Mandi</label>
              <select className="form-control" value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="Chennai">Chennai Hub</option>
                <option value="Coimbatore">Coimbatore Hub</option>
                <option value="Madurai">Madurai Mandi</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Quantity Needed (kg)</label>
              <input
                type="number"
                className="form-control"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                min="100"
                max="10000"
                step="50"
              />
            </div>

            <button className="btn btn-primary" onClick={runMatch} style={{ width: "100%" }}>
              Pool Farmers
            </button>
          </div>
        </div>

        <div className="card pooling-card">
          <div className="card-header">
            <h3 className="card-title">AI Allocation Summary</h3>
          </div>
          <div className="card-body">
            {matchData && (
              <>
                <div style={{ background: "var(--primary-light)", padding: "14px", borderRadius: "12px", marginBottom: "18px" }}>
                  <strong style={{ color: "var(--primary)" }}>
                    Pooled {matchData.farmers_used} Farmers | Fulfilled {matchData.fulfilled_qty_kg} / {matchData.required_qty_kg} kg
                  </strong>
                  <div style={{ fontSize: "13px", color: "var(--text-primary)", marginTop: "4px" }}>
                    Total Estimated Cost: <strong>₹{matchData.total_estimated_cost?.toLocaleString()}</strong> (Avg ₹{matchData.avg_price_per_kg}/kg)
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {(matchData.matched_farmers || []).map((f) => (
                    <div key={f.farmer_id} className="farmer-allocation-item">
                      <div>
                        <strong>👨‍🌾 Farmer {f.farmer_id}</strong> ({f.location})
                        <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                          Rating: ★ {f.rating} | Match Score: {f.match_score}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--primary)" }}>
                          {f.allocated_qty_kg} kg
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                          ₹{f.price_per_kg}/kg
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
