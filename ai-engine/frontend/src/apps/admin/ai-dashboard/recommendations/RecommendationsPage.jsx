import React, { useState, useEffect } from "react";
import { recommendForFarmer, recommendFarmersForBuyer } from "../api";

export default function RecommendationsPage() {
  const [farmerLoc, setFarmerLoc] = useState("Coimbatore");
  const [farmerCrop, setFarmerCrop] = useState("Tomato");
  const [farmerRecs, setFarmerRecs] = useState(null);

  const [buyerCrop, setBuyerCrop] = useState("Tomato");
  const [buyerLoc, setBuyerLoc] = useState("Chennai");
  const [buyerRecs, setBuyerRecs] = useState([]);

  useEffect(() => {
    fetchFarmer();
    fetchBuyer();
  }, []);

  async function fetchFarmer() {
    const res = await recommendForFarmer(farmerLoc, farmerCrop);
    setFarmerRecs(res);
  }

  async function fetchBuyer() {
    const res = await recommendFarmersForBuyer(buyerCrop, buyerLoc, 4);
    setBuyerRecs(res.recommended_farmers || []);
  }

  return (
    <div className="recommendations-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">Crop & Supplier Recommendations 🌱</h1>
          <p className="page-subtitle">Personalized AI advisory for farmers and buyers.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">👨‍🌾 Farmer Crop Advisory</h3>
          </div>
          <div className="card-body">
            <div style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>
              <select className="form-control" value={farmerLoc} onChange={(e) => setFarmerLoc(e.target.value)}>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Madurai">Madurai</option>
                <option value="Salem">Salem</option>
              </select>
              <button className="btn btn-secondary" onClick={fetchFarmer}>Advise</button>
            </div>

            {farmerRecs && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {(farmerRecs.recommended_products || []).map((p, idx) => (
                  <div key={p.product} style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "var(--surface-subtle)", borderRadius: "8px" }}>
                    <strong>{idx + 1}. {p.product}</strong>
                    <span className="badge badge-gold">High Demand ({p.predicted_qty_kg} kg)</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🏢 Buyer Recommended Suppliers</h3>
          </div>
          <div className="card-body">
            <div style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>
              <select className="form-control" value={buyerCrop} onChange={(e) => setBuyerCrop(e.target.value)}>
                <option value="Tomato">Tomato</option>
                <option value="Onion">Onion</option>
              </select>
              <button className="btn btn-secondary" onClick={fetchBuyer}>Find</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {buyerRecs.map((f) => (
                <div key={f.farmer_id} className="farmer-allocation-item">
                  <div>
                    <strong>👨‍🌾 Farmer {f.farmer_id}</strong> ({f.location})
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>★ {f.rating} | Avail: {f.available_qty_kg} kg</div>
                  </div>
                  <strong style={{ color: "var(--primary)" }}>₹{f.price_per_kg}/kg</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
