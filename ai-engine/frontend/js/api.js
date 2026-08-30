/**
 * ANNAM AI Engine — Unified API Client
 * Supports both direct REST calls and robust fallback data for live demos.
 */

const BASE_URL = window.location.origin.includes(":8001") 
  ? "" 
  : "http://127.0.0.1:8001";

// Safe JSON fetch wrapper with fallback support
async function safeFetch(endpoint, options = {}, fallback = null) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "API Error" }));
      console.warn(`API responded with ${res.status} for ${endpoint}:`, err);
      if (fallback) return fallback;
      throw new Error(err.detail || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.warn(`Network/Fetch failure on ${endpoint}, activating fallback:`, error.message);
    if (fallback) return fallback;
    throw error;
  }
}

export async function getHealth() {
  return safeFetch("/health", { method: "GET" }, { status: "ok", service: "annam-ai-engine", offline: true });
}

export async function getForecast(product, location, horizonDays = 7) {
  const fallback = {
    product,
    location,
    horizon_days: horizonDays,
    predicted_qty_kg: Math.round(1450 + Math.random() * 800),
    confidence: 84.5,
    trend: "rising",
    daily_avg_kg: 230.5,
    offline: true,
  };
  return safeFetch("/forecast", {
    method: "POST",
    body: JSON.stringify({ product, location, horizon_days: horizonDays }),
  }, fallback);
}

export async function getTopProducts(location, topN = 3) {
  const fallback = {
    location,
    top_products: [
      { product: "Tomato", location, horizon_days: 7, predicted_qty_kg: 2150.0, confidence: 88.0, trend: "rising" },
      { product: "Onion", location, horizon_days: 7, predicted_qty_kg: 1890.0, confidence: 82.5, trend: "stable" },
      { product: "Potato", location, horizon_days: 7, predicted_qty_kg: 1420.0, confidence: 79.0, trend: "rising" },
    ],
    offline: true,
  };
  return safeFetch(`/forecast/top/${encodeURIComponent(location)}?top_n=${topN}`, { method: "GET" }, fallback);
}

export async function getDemandHistory(product, location, limitDays = 30) {
  const dates = [];
  const quantities = [];
  const now = new Date();
  for (let i = limitDays - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);
    quantities.push(Math.round(180 + Math.sin(i / 2) * 50 + Math.random() * 30));
  }
  const fallback = {
    product,
    location,
    dates,
    quantities,
    forecast_7d_total: 1820.0,
    daily_projected_kg: 260.0,
    confidence: 86.0,
    trend: "rising",
    offline: true,
  };
  return safeFetch(`/forecast/history/${encodeURIComponent(product)}/${encodeURIComponent(location)}?limit_days=${limitDays}`, { method: "GET" }, fallback);
}

export async function matchBulkRequest(product, location, requiredQtyKg) {
  const fallback = {
    product,
    location,
    required_qty_kg: requiredQtyKg,
    fulfilled_qty_kg: requiredQtyKg,
    fulfillment_percentage: 100.0,
    status: "fully_fulfilled",
    farmers_used: 3,
    total_estimated_cost: Math.round(requiredQtyKg * 34.5),
    avg_price_per_kg: 34.5,
    matched_farmers: [
      { farmer_id: "F104", location, allocated_qty_kg: Math.round(requiredQtyKg * 0.45), price_per_kg: 32.0, rating: 4.8, match_score: 92.5, is_local: true },
      { farmer_id: "F118", location, allocated_qty_kg: Math.round(requiredQtyKg * 0.35), price_per_kg: 35.0, rating: 4.6, match_score: 87.0, is_local: true },
      { farmer_id: "F129", location: "Trichy", allocated_qty_kg: Math.round(requiredQtyKg * 0.20), price_per_kg: 38.0, rating: 4.5, match_score: 76.5, is_local: false },
    ],
    offline: true,
  };
  return safeFetch("/match", {
    method: "POST",
    body: JSON.stringify({ product, location, required_qty_kg: parseFloat(requiredQtyKg) }),
  }, fallback);
}

export async function recommendForFarmer(location, currentProduct = null) {
  const fallback = {
    location,
    recommended_products: [
      { product: "Tomato", location, horizon_days: 7, predicted_qty_kg: 2150.0, confidence: 88.0, trend: "rising" },
      { product: "Brinjal", location, horizon_days: 7, predicted_qty_kg: 1650.0, confidence: 81.0, trend: "rising" },
      { product: "Carrot", location, horizon_days: 7, predicted_qty_kg: 1320.0, confidence: 77.5, trend: "stable" },
    ],
    current_product_forecast: currentProduct ? {
      product: currentProduct,
      location,
      predicted_qty_kg: 1400.0,
      confidence: 82.0,
      trend: "stable",
    } : null,
    offline: true,
  };
  return safeFetch("/recommend/farmer", {
    method: "POST",
    body: JSON.stringify({ location, current_product: currentProduct }),
  }, fallback);
}

export async function recommendFarmersForBuyer(product, location, topN = 5) {
  const fallback = {
    product,
    location,
    recommended_farmers: [
      { farmer_id: "F108", location, price_per_kg: 30.5, rating: 4.9, available_qty_kg: 450 },
      { farmer_id: "F112", location, price_per_kg: 32.0, rating: 4.7, available_qty_kg: 620 },
      { farmer_id: "F135", location: "Salem", price_per_kg: 28.0, rating: 4.6, available_qty_kg: 780 },
      { farmer_id: "F149", location, price_per_kg: 35.0, rating: 4.8, available_qty_kg: 310 },
      { farmer_id: "F122", location: "Trichy", price_per_kg: 29.5, rating: 4.4, available_qty_kg: 500 },
    ],
    offline: true,
  };
  return safeFetch(`/recommend/buyer?product=${encodeURIComponent(product)}&location=${encodeURIComponent(location)}&top_n=${topN}`, { method: "GET" }, fallback);
}

export async function getAiSummary(product, location, requiredQtyKg = 1000, horizonDays = 7) {
  return safeFetch("/summary", {
    method: "POST",
    body: JSON.stringify({ product, location, required_qty_kg: requiredQtyKg, horizon_days: horizonDays }),
  });
}
