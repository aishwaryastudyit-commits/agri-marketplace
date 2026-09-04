import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../../../services/orderService";
import API_BASE_URL from "../../../services/api";
import { productImageFor } from "../../../utils/productImages";
import "../../../styles/orders.css";
import "../../../styles/trackDelivery.css";

const statusClass = (status = "") => status.toLowerCase().replaceAll(" ", "-");

export function ConsumerOrdersPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { getOrders().then(setOrders).catch(() => setError("We could not load your orders.")).finally(() => setLoading(false)); }, []);
  return <section className="marketplace-content account-panel"><div className="section-header"><div><p className="section-kicker">MY ORDERS</p><h2>Order details</h2></div></div>{error && <div className="products-message error-message">{error}</div>}{loading && <div className="products-message">Loading your orders...</div>}{!loading && !orders.length && <div className="products-message">No orders yet.</div>}<div className="orders-grid">{orders.map((order) => <article className="order-card" key={order.id}><div className="order-top"><div><span className="order-label">Order ID</span><h2>#{order.id}</h2></div><span className={`status ${statusClass(order.status)}`}>{order.status}</span></div><div className="order-product"><img className="order-product-image" src={order.image_url || productImageFor(order.product)} alt="" /><div><strong>{order.product}</strong><span>From {order.farmer}</span></div></div><dl className="order-info"><div><dt>Quantity</dt><dd>{order.quantity} {order.unit || "kg"}</dd></div><div><dt>Price</dt><dd>Rs. {order.price} / {order.unit || "kg"}</dd></div><div><dt>Payment</dt><dd>{order.paymentStatus}</dd></div><div><dt>Total</dt><dd>Rs. {order.total}</dd></div></dl><div className="order-bottom"><time>{order.date}</time><div className="order-actions"><Link to={`/orders/${order.id}`} className="secondary-btn">Full details</Link><Link to="/track-delivery" className="primary-btn">Track delivery</Link></div></div></article>)}</div></section>;
}

export function ConsumerTrackingPanel() {
  const [orders, setOrders] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  useEffect(() => {
    let alive = true;
    const refresh = () => Promise.all([getOrders(), fetch(`${API_BASE_URL}/logistics/`).then((r) => r.ok ? r.json() : [])])
      .then(([allOrders, allDeliveries]) => { if (alive) { setOrders(allOrders); setDeliveries(allDeliveries); } });
    refresh();
    const interval = setInterval(refresh, 15000);
    return () => { alive = false; clearInterval(interval); };
  }, []);
  return <section className="marketplace-content account-panel"><div className="section-header"><div><p className="section-kicker">DELIVERY JOURNEY</p><h2>Track delivery</h2><p>Open a route to see every checkpoint from farm to your doorstep.</p></div></div><div className="tracking-grid">{orders.filter((order) => order.status !== "Cancelled").map((order) => { const delivery = deliveries.find((item) => String(item.order_id) === String(order.id)); const expanded = expandedId === order.id; const current = delivery?.current_location || "Waiting for farmer confirmation"; const route = delivery?.route || `${order.farmer} → Collection hub → Your address`; return <article className="tracking-card" key={order.id}><div className="tracking-card-header"><div><span className="order-label">Order ID</span><h2>#{order.id}</h2></div><span className={`status ${statusClass(order.status)}`}>{order.status}</span></div><div className="tracking-product"><img className="order-product-image" src={order.image_url || productImageFor(order.product)} alt="" /><div><strong>{order.product}</strong><span>{order.quantity} {order.unit || "kg"} from {order.farmer}</span></div></div><div className="tracking-current"><span>Current update</span><strong>{current}</strong></div><button type="button" className="route-toggle" onClick={() => setExpandedId(expanded ? null : order.id)}><span>{expanded ? "Hide delivery journey" : "See where my order is"}</span><b>{expanded ? "−" : "+"}</b></button>{expanded && <div className="journey-panel"><div className="journey-progress"><span style={{ height: order.status === "Delivered" ? "100%" : "28%" }} /></div>{["Order placed", "Farmer confirmation", "Collection hub", "Out for delivery", "Delivered"].map((name, index) => <div className={`journey-step ${index === 0 ? "done" : index === 1 ? "active" : ""}`} key={name}><span className="journey-dot">{index === 0 ? "✓" : index + 1}</span><div><strong>{name}</strong><p>{index === 1 ? current : index === 2 ? "Items will be collected from the farm" : index === 3 ? "Delivery partner will be assigned" : index === 4 ? "Expected at your delivery address" : `Order #${order.id} received`}</p></div></div>)}{delivery?.assigned_driver && <p className="tracking-driver">Delivery person: <strong>{delivery.assigned_driver}</strong></p>}</div>}<p className="tracking-caption">Route: {route}</p></article>; })}</div></section>;
}
