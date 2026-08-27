/**
 * ANNAM Agri-Marketplace — Master UI Controller
 * Manages view switching, interactive simulators, Chart rendering, role switching & toasts.
 */

import * as API from "./api.js";

// State
let currentRole = "Administrator";
let currentUserName = "Aishwarya";
let activeChartInstance = null;
let marketChartInstance = null;

// DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initRoleSwitcher();
  initDemandForecaster();
  initSupplyPooling();
  initMarketInsights();
  initRecommendations();
  loadInitialOverview();
});

/* ==========================================================================
   1. Navigation & View Switching
   ========================================================================== */
function initNavigation() {
  const navItems = document.querySelectorAll(".nav-item[data-view]");
  const views = document.querySelectorAll(".view-section");
  const mobileToggle = document.getElementById("mobileMenuToggle");
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("mobileBackdrop");

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const targetView = item.getAttribute("data-view");

      navItems.forEach((n) => n.classList.remove("active"));
      item.classList.add("active");

      views.forEach((v) => {
        v.style.display = v.id === targetView ? "block" : "none";
      });

      // Close mobile drawer if open
      if (sidebar.classList.contains("open")) {
        sidebar.classList.remove("open");
        backdrop.classList.remove("show");
      }

      // Trigger view-specific loads
      if (targetView === "view-market-insights") {
        updateMarketInsights();
      } else if (targetView === "view-forecast") {
        updateForecastData();
      }
    });
  });

  // Mobile menu toggle
  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      backdrop.classList.toggle("show");
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", () => {
      sidebar.classList.remove("open");
      backdrop.classList.remove("show");
    });
  }

  // Profile dropdown toggle
  const userMenu = document.getElementById("userProfileMenu");
  const profileDropdown = document.getElementById("profileDropdown");
  if (userMenu && profileDropdown) {
    userMenu.addEventListener("click", (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle("show");
    });
    document.addEventListener("click", () => {
      profileDropdown.classList.remove("show");
    });
  }
}

/* ==========================================================================
   2. Role Switcher
   ========================================================================== */
function initRoleSwitcher() {
  const roleItems = document.querySelectorAll(".role-select-item");
  const userNameEl = document.getElementById("currentUserName");
  const userRoleEl = document.getElementById("currentUserRole");
  const welcomeNameEl = document.getElementById("welcomeUserName");

  roleItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const role = item.getAttribute("data-role");
      const name = item.getAttribute("data-name");

      currentRole = role;
      currentUserName = name;

      if (userNameEl) userNameEl.textContent = name;
      if (userRoleEl) userRoleEl.textContent = `Role: ${role}`;
      if (welcomeNameEl) welcomeNameEl.textContent = name;

      showToast(`Switched view to ${role} (${name})`, "info");
    });
  });
}

/* ==========================================================================
   3. Demand Forecasting Simulator & Chart
   ========================================================================== */
function initDemandForecaster() {
  const productSelect = document.getElementById("forecastProductSelect");
  const locationSelect = document.getElementById("forecastLocationSelect");
  const horizonSelect = document.getElementById("forecastHorizonSelect");
  const runBtn = document.getElementById("runForecastBtn");

  if (runBtn) {
    runBtn.addEventListener("click", updateForecastData);
  }
  if (productSelect) productSelect.addEventListener("change", updateForecastData);
  if (locationSelect) locationSelect.addEventListener("change", updateForecastData);
  if (horizonSelect) horizonSelect.addEventListener("change", updateForecastData);

  // Initial run
  updateForecastData();
}

async function updateForecastData() {
  const product = document.getElementById("forecastProductSelect")?.value || "Tomato";
  const location = document.getElementById("forecastLocationSelect")?.value || "Chennai";
  const horizon = parseInt(document.getElementById("forecastHorizonSelect")?.value || "7", 10);

  const predQtyEl = document.getElementById("forecastPredictedQty");
  const confEl = document.getElementById("forecastConfidence");
  const confBar = document.getElementById("forecastConfidenceBar");
  const trendBadge = document.getElementById("forecastTrendBadge");
  const dailyAvgEl = document.getElementById("forecastDailyAvg");

  try {
    const data = await API.getForecast(product, location, horizon);
    const historyData = await API.getDemandHistory(product, location, 20);

    if (predQtyEl) predQtyEl.textContent = `${data.predicted_qty_kg.toLocaleString()} kg`;
    if (confEl) confEl.textContent = `${data.confidence}%`;
    if (confBar) confBar.style.width = `${Math.min(data.confidence, 100)}%`;
    if (dailyAvgEl) dailyAvgEl.textContent = `~${data.daily_avg_kg || Math.round(data.predicted_qty_kg / horizon)} kg/day`;

    if (trendBadge) {
      trendBadge.className = `trend-badge ${data.trend === "rising" ? "trend-up" : data.trend === "falling" ? "trend-down" : "trend-neutral"}`;
      trendBadge.innerHTML = `${data.trend === "rising" ? "↑" : data.trend === "falling" ? "↓" : "→"} ${data.trend.toUpperCase()} TREND`;
    }

    renderForecastChart(historyData, data);
  } catch (err) {
    console.error("Forecast error:", err);
    showToast("Failed to fetch forecast: " + err.message, "danger");
  }
}

function renderForecastChart(history, forecast) {
  const canvas = document.getElementById("demandChartCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (activeChartInstance) {
    activeChartInstance.destroy();
  }

  const labels = [...(history.dates || [])];
  const dataPoints = [...(history.quantities || [])];

  // Add 3 projection days for visual demonstration
  const lastVal = dataPoints[dataPoints.length - 1] || 200;
  labels.push("Tomorrow (Pred)", "+3 Days", "+7 Days");
  const step = (forecast.daily_avg_kg || lastVal) - lastVal;
  dataPoints.push(Math.round(lastVal + step * 0.3));
  dataPoints.push(Math.round(lastVal + step * 0.7));
  dataPoints.push(Math.round(forecast.daily_avg_kg || lastVal));

  if (window.Chart) {
    activeChartInstance = new window.Chart(ctx, {
      type: "line",
      data: {
        labels: labels.map((l) => l.length > 10 ? l.slice(5) : l),
        datasets: [
          {
            label: `${forecast.product} Demand (kg)`,
            data: dataPoints,
            borderColor: "#1F6B45",
            backgroundColor: "rgba(61, 155, 104, 0.12)",
            borderWidth: 2.5,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: "#1F6B45",
            pointRadius: 3,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#102820",
            padding: 10,
            titleFont: { family: "Inter", size: 12 },
            bodyFont: { family: "Inter", size: 13, weight: "bold" },
            displayColors: false,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { family: "Inter", size: 11 }, color: "#6B7280" },
          },
          y: {
            grid: { color: "#E5E7EB", borderDash: [4, 4] },
            ticks: { font: { family: "Inter", size: 11 }, color: "#6B7280" },
          },
        },
      },
    });
  }
}

/* ==========================================================================
   4. Smart Supply Pooling Simulator
   ========================================================================== */
function initSupplyPooling() {
  const matchBtn = document.getElementById("runMatchBtn");
  if (matchBtn) {
    matchBtn.addEventListener("click", updateSupplyMatch);
  }
  updateSupplyMatch();
}

async function updateSupplyMatch() {
  const product = document.getElementById("matchProductSelect")?.value || "Tomato";
  const location = document.getElementById("matchLocationSelect")?.value || "Chennai";
  const qty = parseFloat(document.getElementById("matchQuantityInput")?.value || "1200");

  const summaryEl = document.getElementById("matchingSummaryBanner");
  const progressBar = document.getElementById("matchProgressBar");
  const progressLabel = document.getElementById("matchProgressLabel");
  const farmerListEl = document.getElementById("matchedFarmersList");

  try {
    const res = await API.matchBulkRequest(product, location, qty);

    if (summaryEl) {
      const statusBadge = res.status === "fully_fulfilled" 
        ? '<span class="badge badge-available">● FULLY FULFILLED</span>'
        : '<span class="badge badge-pending">● PARTIALLY FULFILLED</span>';
      summaryEl.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
          <div>
            <strong style="color: var(--dark); font-size: 16px;">AI Pooled ${res.farmers_used} Farmers</strong>
            <p style="color: var(--text-secondary); font-size: 13px; margin-top: 2px;">
              Fulfilled <strong>${res.fulfilled_qty_kg} kg</strong> of requested <strong>${res.required_qty_kg} kg</strong> | Total Est. Cost: <strong>₹${res.total_estimated_cost.toLocaleString()}</strong> (Avg ₹${res.avg_price_per_kg}/kg)
            </p>
          </div>
          ${statusBadge}
        </div>
      `;
    }

    if (progressBar && progressLabel) {
      progressBar.style.width = `${res.fulfillment_percentage}%`;
      progressLabel.textContent = `${res.fulfillment_percentage}% Fulfilled (${res.fulfilled_qty_kg} / ${res.required_qty_kg} kg)`;
    }

    if (farmerListEl) {
      if (!res.matched_farmers || res.matched_farmers.length === 0) {
        farmerListEl.innerHTML = '<p style="color: var(--text-muted); padding: 16px;">No farmers currently registered for this product.</p>';
      } else {
        farmerListEl.innerHTML = res.matched_farmers.map((f) => `
          <div class="farmer-allocation-item">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px;">
                ${f.farmer_id}
              </div>
              <div>
                <strong style="color: var(--text-primary); font-size: 14px;">Farmer ${f.farmer_id}</strong>
                <div style="font-size: 12px; color: var(--text-secondary); display: flex; gap: 8px; align-items: center; margin-top: 2px;">
                  <span>📍 ${f.location}</span>
                  <span>•</span>
                  <span>★ ${f.rating}</span>
                  ${f.is_local ? '<span class="badge badge-available" style="padding: 2px 6px; font-size: 10px;">Same Mandi</span>' : ""}
                </div>
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 15px; font-weight: 700; color: var(--primary);">
                ${f.allocated_qty_kg} kg
              </div>
              <div style="font-size: 12px; color: var(--text-secondary);">
                ₹${f.price_per_kg}/kg (Score: ${f.match_score})
              </div>
            </div>
          </div>
        `).join("");
      }
    }
  } catch (err) {
    console.error("Match error:", err);
    showToast("Failed to match farmers: " + err.message, "danger");
  }
}

/* ==========================================================================
   5. Market Insights & Top Crops
   ========================================================================== */
function initMarketInsights() {
  const locSelect = document.getElementById("marketLocationSelect");
  if (locSelect) {
    locSelect.addEventListener("change", updateMarketInsights);
  }
}

async function updateMarketInsights() {
  const location = document.getElementById("marketLocationSelect")?.value || "Chennai";
  const listEl = document.getElementById("topCropsList");

  try {
    const data = await API.getTopProducts(location, 4);
    const products = data.top_products || [];

    if (listEl) {
      listEl.innerHTML = products.map((item, idx) => `
        <div class="card card-hover" style="display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="font-size: 22px; font-weight: 700; color: var(--primary); width: 28px;">#${idx + 1}</div>
            <div>
              <h4 style="font-size: 16px; font-weight: 600; color: var(--text-primary);">${item.product}</h4>
              <p style="font-size: 13px; color: var(--text-secondary); margin-top: 2px;">
                Predicted 7-Day Regional Demand: <strong>${item.predicted_qty_kg.toLocaleString()} kg</strong>
              </p>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 16px;">
            <span class="badge ${item.trend === "rising" ? "badge-available" : "badge-pending"}">
              ${item.trend === "rising" ? "↑ Rising Demand" : "→ Steady Demand"}
            </span>
            <div style="text-align: right;">
              <span style="font-size: 11px; color: var(--text-muted); display: block;">CONFIDENCE</span>
              <strong style="color: var(--dark);">${item.confidence}%</strong>
            </div>
          </div>
        </div>
      `).join("");
    }

    renderMarketChart(products);
  } catch (err) {
    console.error("Market Insights error:", err);
  }
}

function renderMarketChart(products) {
  const canvas = document.getElementById("marketChartCanvas");
  if (!canvas || !window.Chart) return;

  const ctx = canvas.getContext("2d");
  if (marketChartInstance) {
    marketChartInstance.destroy();
  }

  marketChartInstance = new window.Chart(ctx, {
    type: "bar",
    data: {
      labels: products.map((p) => p.product),
      datasets: [
        {
          label: "7-Day Projected Demand (kg)",
          data: products.map((p) => p.predicted_qty_kg),
          backgroundColor: ["#1F6B45", "#3D9B68", "#D9A441", "#3B82C4"],
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: "#E5E7EB" } },
      },
    },
  });
}

/* ==========================================================================
   6. AI Recommendations
   ========================================================================== */
function initRecommendations() {
  const farmerRecBtn = document.getElementById("getFarmerRecBtn");
  const buyerRecBtn = document.getElementById("getBuyerRecBtn");

  if (farmerRecBtn) farmerRecBtn.addEventListener("click", updateFarmerRecommendations);
  if (buyerRecBtn) buyerRecBtn.addEventListener("click", updateBuyerRecommendations);

  updateFarmerRecommendations();
  updateBuyerRecommendations();
}

async function updateFarmerRecommendations() {
  const loc = document.getElementById("recFarmerLocation")?.value || "Coimbatore";
  const currentProd = document.getElementById("recFarmerCurrentCrop")?.value || "Tomato";
  const resultsEl = document.getElementById("farmerRecResults");

  try {
    const res = await API.recommendForFarmer(loc, currentProd);
    if (resultsEl) {
      resultsEl.innerHTML = `
        <div style="background-color: var(--primary-light); padding: 14px 18px; border-radius: var(--radius-md); margin-bottom: 16px; border: 1px solid rgba(31, 107, 69, 0.2);">
          <strong style="color: var(--primary);">🌾 AI Crop Advisory for ${loc}</strong>
          <p style="font-size: 13px; color: var(--text-primary); margin-top: 4px;">
            Current produce <strong>${currentProd}</strong> is forecasted with <strong>${res.current_product_forecast?.confidence || 82}% confidence</strong> (${res.current_product_forecast?.trend || "stable"} trend).
          </p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${(res.recommended_products || []).map((p, idx) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background-color: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm);">
              <div>
                <strong>${idx + 1}. ${p.product}</strong>
                <span style="font-size: 12px; color: var(--text-secondary); display: block;">Expected Demand: ${p.predicted_qty_kg} kg</span>
              </div>
              <span class="badge badge-gold">Top Opportunity</span>
            </div>
          `).join("")}
        </div>
      `;
    }
  } catch (err) {
    console.error("Farmer Rec error:", err);
  }
}

async function updateBuyerRecommendations() {
  const prod = document.getElementById("recBuyerProduct")?.value || "Tomato";
  const loc = document.getElementById("recBuyerLocation")?.value || "Chennai";
  const resultsEl = document.getElementById("buyerRecResults");

  try {
    const res = await API.recommendFarmersForBuyer(prod, loc, 4);
    const farmers = res.recommended_farmers || [];

    if (resultsEl) {
      resultsEl.innerHTML = farmers.map((f) => `
        <div class="farmer-allocation-item" style="margin-bottom: 8px;">
          <div>
            <strong>👨‍🌾 Farmer ${f.farmer_id}</strong> (${f.location})
            <div style="font-size: 12px; color: var(--text-secondary);">
              Rating: ★ ${f.rating} | Available: ${f.available_qty_kg} kg
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 16px; font-weight: 700; color: var(--primary);">₹${f.price_per_kg} / kg</div>
            <button class="btn btn-sm btn-outline" style="margin-top: 4px; padding: 4px 8px; font-size: 11px;">Direct Order</button>
          </div>
        </div>
      `).join("");
    }
  } catch (err) {
    console.error("Buyer Rec error:", err);
  }
}

/* ==========================================================================
   7. Initial Overview & Live Counters
   ========================================================================== */
async function loadInitialOverview() {
  try {
    const health = await API.getHealth();
    const livePill = document.getElementById("aiEngineStatusPill");
    if (livePill) {
      livePill.innerHTML = '<span class="badge-dot" style="background-color: #3D9B68;"></span> AI Engine Active (:8001)';
    }
  } catch (e) {
    console.warn("Could not reach AI engine health check");
  }
}

/* ==========================================================================
   8. Global Toast Notification
   ========================================================================== */
export function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer") || createToastContainer();
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span style="font-size: 16px;">${type === "success" ? "✓" : type === "danger" ? "✕" : "ℹ"}</span>
    <span style="font-size: 13px; font-weight: 500;">${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(12px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function createToastContainer() {
  const c = document.createElement("div");
  c.id = "toastContainer";
  c.className = "toast-container";
  document.body.appendChild(c);
  return c;
}
