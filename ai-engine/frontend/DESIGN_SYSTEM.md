# 🌾 ANNAM Application UI Design System & Team Specification

> **Design Standard:** Modern + Professional + Agricultural + Slightly Premium  
> **Color Ratio:** 70% Cream/Surface | 20% Agricultural Greens | 10% Accents  
> **Typography:** Inter (`32px` page title, `22px` section, `16px` card, `15px` body, `13px` small)  

---

## 1. Master Color Tokens (`frontend/css/global.css`)

```css
:root {
  /* 20% Greens */
  --primary: #1F6B45;            /* Deep agricultural green */
  --primary-hover: #175436;
  --secondary: #3D9B68;          /* Fresh green */
  --primary-light: #E8F5EC;      /* Soft background / active state accent */
  --dark: #102820;               /* Deep charcoal green */

  /* 70% Cream & Surfaces */
  --bg-cream: #F7F6F0;           /* Warm white app background */
  --surface: #FFFFFF;            /* Cards & dialog surfaces */
  --surface-subtle: #FAF9F5;     /* Table headers */
  --border: #E5E7EB;             /* Standard border */

  /* 10% Accents */
  --gold: #D9A441;               /* Harvest gold */
  --info: #3B82C4;               /* Blue / information */
  --danger: #D9534F;             /* Red / warning */
  --warning: #E89B3C;            /* Orange / pending */

  /* Border Radii */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;             /* All ANNAM Cards */
  --radius-full: 9999px;         /* Badges */
}
```

---

## 2. Standard Application Layout

All teammate pages (Citizen, Farmer, Buyer, Logistics, Authority) must use this structure:

```html
<div class="app-container">
  <!-- 1. Left Sidebar -->
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="sidebar-brand">🌾 ANNAM</div>
    </div>
    <nav class="sidebar-nav">
      <a class="nav-item active">
        <span class="nav-icon">🏠</span>
        <span>Dashboard</span>
      </a>
      <a class="nav-item">
        <span class="nav-icon">🛒</span>
        <span>Marketplace</span>
      </a>
    </nav>
  </aside>

  <!-- 2. Main Content Wrapper -->
  <div class="main-wrapper">
    <!-- Top Navigation Bar -->
    <header class="top-nav">
      <div class="search-bar">
        <input type="text" class="search-input" placeholder="Search..." />
      </div>
      <div class="user-profile-menu">
        <div class="user-avatar">A</div>
        <div class="user-info">
          <span class="user-name">Aishwarya</span>
          <span class="user-role">Role: Administrator</span>
        </div>
      </div>
    </header>

    <!-- Content Area -->
    <main class="content-area">
      <!-- Page Header -->
      <div class="page-header">
        <div class="page-title-group">
          <h1 class="page-title">Page Title</h1>
          <p class="page-subtitle">Short description</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary">+ Primary Action</button>
        </div>
      </div>

      <!-- Page Content / Cards -->
    </main>
  </div>
</div>
```

---

## 3. Card Templates

### Standard Rounded Card
```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Card Heading</h3>
  </div>
  <div class="card-body">
    Card content goes here...
  </div>
</div>
```

### KPI Metric Card
```html
<div class="kpi-card">
  <div class="kpi-top">
    <span class="kpi-label">Total Produce</span>
    <div class="kpi-icon-wrap">🌾</div>
  </div>
  <div class="kpi-value">124</div>
  <div class="kpi-footer">
    <span class="trend-badge trend-up">↑ 12% this month</span>
  </div>
</div>
```

---

## 4. Button System

```html
<!-- Primary Action (Save, Add, Confirm) -->
<button class="btn btn-primary">+ Add Product</button>

<!-- Secondary Action (Cancel, Filter) -->
<button class="btn btn-secondary">Cancel</button>

<!-- Destructive Action (Delete) -->
<button class="btn btn-danger">Delete</button>

<!-- Harvest Gold Accent -->
<button class="btn btn-gold">Smart Pooling</button>
```

---

## 5. Status Badge System

```html
<span class="badge badge-available"><span class="badge-dot"></span> Available</span>
<span class="badge badge-pending"><span class="badge-dot"></span> Pending</span>
<span class="badge badge-delivered"><span class="badge-dot"></span> Delivered</span>
<span class="badge badge-cancelled"><span class="badge-dot"></span> Cancelled</span>
```

---

## 6. Product Card Template

```html
<div class="product-card">
  <div class="product-img-box">
    🍅
    <span class="badge badge-available product-status-tag">● Available</span>
  </div>
  <div class="product-content">
    <h3 class="product-name">Farm Fresh Tomatoes</h3>
    <div class="product-pricing">
      <span class="product-price">₹40 <span class="product-unit">/ kg</span></span>
      <span>Available: 100 kg</span>
    </div>
    <div class="product-meta-row">
      <span class="farmer-tag">👨‍🌾 Farmer Ravi</span>
      <span>★ 4.8</span>
    </div>
    <button class="btn btn-primary btn-sm" style="width: 100%;">View Product</button>
  </div>
</div>
```

---

## 7. Connecting to the AI Microservice (Member 4)

FastAPI runs on `http://127.0.0.1:8001`:

| Feature | Method | Endpoint | Payload |
|---|---|---|---|
| Demand Forecast | `POST` | `/forecast` | `{"product": "Tomato", "location": "Chennai", "horizon_days": 7}` |
| Top Trending Crops | `GET` | `/forecast/top/{location}` | None |
| Smart Supply Pooling | `POST` | `/match` | `{"product": "Tomato", "location": "Chennai", "required_qty_kg": 1000}` |
| Crop Recommendations | `POST` | `/recommend/farmer` | `{"location": "Coimbatore", "current_product": "Tomato"}` |
| Unified Summary | `POST` | `/summary` | `{"product": "Tomato", "location": "Chennai"}` |
