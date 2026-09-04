import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../../services/orderService";
import API_BASE_URL from "../../services/api";
import "../../styles/orders.css";
import "../../styles/trackDelivery.css";

const getTracking = (order, delivery) => {
  const deliveryStatus = delivery?.delivery_status?.toLowerCase();
  if (order.status === "Delivered" || deliveryStatus === "delivered") return { current: "Delivered to your address", progress: 100 };
  if (["out_for_delivery", "out for delivery", "in_transit", "in transit"].includes(deliveryStatus) || order.status === "Processing") return { current: delivery?.current_location || "At the collection hub", progress: 72 };
  if (deliveryStatus === "picked_up" || deliveryStatus === "picked up") return { current: delivery?.current_location || "Picked up from the farmer", progress: 45 };
  return { current: delivery?.current_location || "Waiting for farmer confirmation", progress: 24 };
};

const routeCheckpoints = (order, delivery) => {
  const fallback = [order.farmer, "Collection hub", delivery?.delivery_address || "Your address"];
  const stops = delivery?.route
    ? delivery.route.split(/\s*(?:→|â†’|->)\s*/).map((stop) => stop.trim()).filter(Boolean)
    : fallback;
  const status = delivery?.delivery_status?.toLowerCase();
  const currentLocation = delivery?.current_location?.toLowerCase() || "";
  const progress = getTracking(order, delivery).progress;
  const currentIndex = Math.max(
    stops.findIndex((stop) => currentLocation.includes(stop.toLowerCase()) || stop.toLowerCase().includes(currentLocation)),
    progress >= 100 ? stops.length - 1 : progress >= 70 ? Math.max(stops.length - 2, 0) : progress >= 45 ? 0 : -1,
  );

  return stops.map((label, index) => ({
    label,
    state: status === "delivered" || order.status === "Delivered" || index < currentIndex
      ? "completed"
      : index === currentIndex ? "current" : "upcoming",
  }));
};

function TrackDelivery() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    let active = true;
    const loadTracking = async () => {
      try {
        const [orderData, deliveryResponse] = await Promise.all([
          getOrders(JSON.parse(localStorage.getItem("annam-buyer") || "null")?.id),
          fetch(`${API_BASE_URL}/logistics/?buyer_id=${JSON.parse(localStorage.getItem("annam-buyer") || "null")?.id || ""}`),
        ]);
        if (!deliveryResponse.ok) throw new Error("Delivery tracking unavailable");
        const deliveryData = await deliveryResponse.json();
        if (active) {
          setOrders(orderData);
          setDeliveries(deliveryData);
          setError("");
        }
      } catch {
        if (active) setError("Live tracking is unavailable. Showing order status instead.");
        try {
          const orderData = await getOrders();
          if (active) setOrders(orderData);
        } catch {
          if (active) setError("We could not load delivery tracking.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    loadTracking();
    const refreshTimer = window.setInterval(loadTracking, 15000);
    return () => { active = false; window.clearInterval(refreshTimer); };
  }, []);

  return (
    <main className="page-shell">
      <Link to="/orders" className="back-link">← Back to orders</Link>
      <header className="page-header">
        <div><p className="eyebrow">ANNAM delivery</p><h1>Track delivery</h1><p>See the route your delivery person is taking and their current location.</p></div>
        <div className="header-mark" aria-hidden="true">07</div>
      </header>
      {error && <div className="notice error-notice" role="alert">{error}</div>}
      {loading && <div className="card empty-state">Loading delivery routes...</div>}
      {!loading && !orders.length && <div className="card empty-state">No deliveries to track yet.</div>}
      <section className="tracking-grid" aria-label="Delivery routes">
        {orders.filter((order) => order.status !== "Cancelled").map((order) => {
          const delivery = deliveries.find((item) => String(item.order_id) === String(order.id));
          const tracking = getTracking(order, delivery);
          const checkpoints = routeCheckpoints(order, delivery);
          const route = delivery?.route || `${order.farmer} → Collection hub → Your address`;
          return <article className="tracking-card" key={order.id}>
            <div className="tracking-card-header"><div><span className="order-label">Order ID</span><h2>{order.id}</h2></div><span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></div>
            <div className="tracking-product"><div className="product-icon" aria-hidden="true">{order.product.charAt(0)}</div><div><strong>{order.product}</strong><span>{order.quantity} kg from {order.farmer}</span></div></div>
            <div className="tracking-current"><span>Current location</span><strong>{tracking.current}</strong></div>
            {delivery?.assigned_driver && <p className="tracking-driver">Driver: <strong>{delivery.assigned_driver}</strong>{delivery.tracking_number ? ` · ${delivery.tracking_number}` : ""}</p>}
            <div className="tracking-route"><span>{order.farmer}</span><i /><span>Collection hub</span><i /><span>Your address</span></div>
            <div className="tracking-progress" aria-label={`${tracking.progress}% delivered`}><span style={{ width: `${tracking.progress}%` }} /></div>
            <details className="route-checkpoints">
              <summary>
                <span>View route checkpoints</span>
                <span className="route-summary-text">{route}</span>
              </summary>
              <ol aria-label={`Route checkpoints for order ${order.id}`}>
                {checkpoints.map((checkpoint, index) => (
                  <li className={`checkpoint ${checkpoint.state}`} key={`${checkpoint.label}-${index}`}>
                    <span className="checkpoint-marker" aria-hidden="true">{checkpoint.state === "completed" ? "✓" : index + 1}</span>
                    <div>
                      <strong>{checkpoint.label}</strong>
                      <span>{checkpoint.state === "completed" ? "Reached" : checkpoint.state === "current" ? "Current location" : "Upcoming checkpoint"}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </details>
            <Link to={`/orders/${order.id}`} className="secondary-btn">View order details</Link>
          </article>;
        })}
      </section>
    </main>
  );
}

export default TrackDelivery;
