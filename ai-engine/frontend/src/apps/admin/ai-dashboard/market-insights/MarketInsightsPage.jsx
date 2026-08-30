import React, { useState, useEffect } from "react";
import { getTopProducts } from "../api";

export default function MarketInsightsPage() {
  const [location, setLocation] = useState("Chennai");
  const [topCrops, setTopCrops] = useState([]);

  useEffect(() => {
    fetchTopCrops();
  }, [location]);

  async function fetchTopCrops() {
    const res = await getTopProducts(location, 4);
    setTopCrops(res.top_products || []);
  }

  return (
    <div className="market-insights-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">Market Insights & Top Crops 📊</h1>
          <p className="page-subtitle">Ranked regional demand for the next 7 days across Tamil Nadu mandis.</p>
        </div>
        <div className="page-actions">
          <select className="form-control" value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="Chennai">Chennai Region</option>
            <option value="Coimbatore">Coimbatore Region</option>
            <option value="Madurai">Madurai Region</option>
            <option value="Trichy">Trichy Region</option>
            <option value="Salem">Salem Region</option>
          </select>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {topCrops.map((c, idx) => (
          <div key={c.product} className="card card-hover" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontSize: "20px", fontWeight: "700", color: "var(--primary)" }}>#{idx + 1}</span>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-primary)" }}>{c.product}</h3>
                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                  Projected Demand: <strong>{c.predicted_qty_kg?.toLocaleString()} kg</strong>
                </span>
              </div>
            </div>
            <span className={`badge ${c.trend === "rising" ? "badge-available" : "badge-pending"}`}>
              {c.trend === "rising" ? "↑ Rising Demand" : "→ Steady"} ({c.confidence}% Conf)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
