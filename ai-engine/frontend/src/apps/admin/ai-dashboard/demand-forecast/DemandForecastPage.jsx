import React, { useState, useEffect } from "react";
import { getForecast, getDemandHistory } from "../api";

export default function DemandForecastPage() {
  const [product, setProduct] = useState("Tomato");
  const [location, setLocation] = useState("Chennai");
  const [horizon, setHorizon] = useState(7);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [product, location, horizon]);

  async function fetchData() {
    setLoading(true);
    const res = await getForecast(product, location, horizon);
    setForecast(res);
    setLoading(false);
  }

  return (
    <div className="demand-forecast-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">Demand Forecasting & Trends 📈</h1>
          <p className="page-subtitle">AI predicts expected demand (kg) over the next 7–30 days.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={fetchData} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh Forecast"}
          </button>
        </div>
      </div>

      <div className="filter-bar">
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div className="form-group">
            <label className="form-label">Produce</label>
            <select className="form-control" value={product} onChange={(e) => setProduct(e.target.value)}>
              <option value="Tomato">🍅 Tomato</option>
              <option value="Onion">🧅 Onion</option>
              <option value="Potato">🥔 Potato</option>
              <option value="Brinjal">🍆 Brinjal</option>
              <option value="Cabbage">🥬 Cabbage</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Mandi Hub</label>
            <select className="form-control" value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="Chennai">Chennai</option>
              <option value="Coimbatore">Coimbatore</option>
              <option value="Madurai">Madurai</option>
              <option value="Trichy">Trichy</option>
              <option value="Salem">Salem</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Horizon</label>
            <select className="form-control" value={horizon} onChange={(e) => setHorizon(Number(e.target.value))}>
              <option value={7}>Next 7 Days</option>
              <option value={14}>Next 14 Days</option>
              <option value={30}>Next 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {forecast && (
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "24px" }}>
          <div className="forecast-visual-box">
            <span className="forecast-meta-label">Predicted Demand</span>
            <div className="forecast-meta-val" style={{ fontSize: "32px" }}>
              {forecast.predicted_qty_kg?.toLocaleString()} kg
            </div>

            <div style={{ marginTop: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                <span>Confidence</span>
                <strong>{forecast.confidence}%</strong>
              </div>
              <div className="progress-bar-container" style={{ marginTop: "6px" }}>
                <div className="progress-bar-fill" style={{ width: `${forecast.confidence}%` }} />
              </div>
            </div>

            <div className="forecast-meta-grid" style={{ marginTop: "16px" }}>
              <div className="forecast-meta-item">
                <span className="forecast-meta-label">Daily Avg</span>
                <span className="forecast-meta-val" style={{ fontSize: "16px" }}>
                  ~{forecast.daily_avg_kg || Math.round(forecast.predicted_qty_kg / horizon)} kg/day
                </span>
              </div>
              <div className="forecast-meta-item">
                <span className="forecast-meta-label">Direction</span>
                <span className={`trend-badge ${forecast.trend === "rising" ? "trend-up" : "trend-neutral"}`}>
                  {forecast.trend?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Historical & Model Projections</h3>
            </div>
            <div className="card-body">
              <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                Trained on 6,300 historical transactions with linear regression and seasonality weights.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
