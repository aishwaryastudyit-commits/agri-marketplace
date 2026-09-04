import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext.jsx";
import { formatCurrency } from "../bulkBuyerData.js";
import { getBulkOrders, getBuyerDeliveries } from "../../../services/annamService";
import "../bulkBuyer.css";
import "../records.css";

const navigation = [
  ["marketplace", "Market place", "/bulk-marketplace"],
  ["orders", "Bulk Orders", "/bulk-orders"],
  ["delivery", "Track Delivery", "/bulk-track-delivery"],
  ["payments", "Payment History", "/bulk-payment-history"],
];

function BulkBuyerRecordsPage({ bulkBuyer, mode }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const displayName = bulkBuyer?.full_name || bulkBuyer?.business_name || t("bulkBuyer");
  const [orders, setOrders] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loadError, setLoadError] = useState("");
  useEffect(() => {
    if (!bulkBuyer?.id) return;
    let active = true;
    const refresh = () => Promise.all([getBulkOrders(bulkBuyer.id), getBuyerDeliveries(bulkBuyer.id)])
      .then(([orderResult, deliveryResult]) => {
        if (!active) return;
        setOrders(orderResult.orders || []);
        setDeliveries(deliveryResult || []);
      })
      .catch((error) => setLoadError(error.message || "Could not load your live records."));
    refresh();
    const interval = setInterval(refresh, 15000);
    return () => { active = false; clearInterval(interval); };
  }, [bulkBuyer?.id]);
  const titles = {
    orders: ["ORDERS", "Bulk Orders", "Confirmed bulk orders placed with farmers."],
    delivery: ["DELIVERY", "Track Delivery", "Follow the route for each product you have ordered."],
  };
  const [kicker, title, description] = titles[mode];

  return (
    <div className="bulk-app">
      <aside className="bulk-sidebar">
        <div className="bulk-logo-section"><div className="bulk-logo-icon">A</div><div><h1>ANNAM</h1><p>Farm to Market</p></div></div>
        <div className="bulk-sidebar-menu">
          <p className="bulk-sidebar-heading">{t("bulkProcurement")}</p>
          {navigation.map(([key, label, path]) => (
            <button key={key} type="button" className={`bulk-sidebar-link ${mode === key ? "active" : ""}`} onClick={() => navigate(path)}>
              <span className="bulk-nav-icon">{key === "payments" ? "₹" : key === "delivery" ? "↝" : key === "orders" ? "□" : key === "requirements" ? "▤" : "▦"}</span>
              <span>{t(label) || label}</span>
            </button>
          ))}
        </div>
        <div className="bulk-sidebar-bottom"><p>{displayName}</p></div>
      </aside>

      <main className="bulk-main">
        <header className="bulk-topbar">
          <div className="bulk-search-container"><span className="bulk-search-icon">⌕</span><input type="text" placeholder={t("searchPlaceholder")} /><button type="button" className="bulk-search-button">{t("search")}</button></div>
          <div className="bulk-top-actions"><button type="button" className="bulk-profile-button" onClick={() => navigate("/bulk-profile")}><div className="bulk-profile-avatar">{displayName.charAt(0).toUpperCase()}</div><div className="bulk-profile-info"><strong>{displayName}</strong></div></button></div>
        </header>

        <div className="bulk-content">
          {loadError && <p className="bulk-api-error" role="alert">{loadError}</p>}
          <section className="bulk-page-header"><p className="bulk-section-kicker">{kicker}</p><h2>{title}</h2><p>{description}</p></section>
          {mode === "orders" && <RecordList items={orders} empty="No bulk orders yet. Add products to your cart, place the request, then pay." renderItem={(item) => <><p className="bulk-payment-id">Order #{item.id}</p><h3>{item.product}</h3><p>{item.quantity} {item.unit} from {item.farmer}</p><strong>{formatCurrency(item.total_amount)}</strong><span className="bulk-payment-success">{item.status} · {item.payment_status}</span></>} />}
          {mode === "delivery" && <RecordList items={deliveries} empty="Your delivery route will appear after payment." renderItem={(item) => <><p className="bulk-payment-id">{item.tracking_number || `Delivery #${item.id}`}</p><h3>Order #{item.order_id} delivery</h3><p className="bulk-route-line">{item.route || "Route is being assigned"}</p><p>{item.current_location || "Awaiting driver assignment"} · {item.delivery_status}</p><div className="bulk-route-progress"><span /></div><strong>{item.assigned_driver || "Driver to be assigned"}</strong></>} />}
        </div>
      </main>
    </div>
  );
}

function RecordList({ items, empty, renderItem }) {
  return items.length ? <section className="bulk-record-list">{items.map((item) => <article className="bulk-record-card" key={item.id}>{renderItem(item)}</article>)}</section> : <section className="bulk-record-empty">{empty}</section>;
}

export default BulkBuyerRecordsPage;
