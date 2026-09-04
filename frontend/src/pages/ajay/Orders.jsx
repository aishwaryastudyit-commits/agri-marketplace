import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { cancelOrder, getOrders } from "../../services/orderService";
import { productImageFor } from "../../utils/productImages";
import "../../styles/orders.css";

const statusClass = (status) => status.toLowerCase().replaceAll(" ", "-");

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrders(JSON.parse(localStorage.getItem("annam-buyer") || "null")?.id)
      .then(setOrders)
      .catch(() => setError("We could not load your orders."))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const updatedOrder = await cancelOrder(orderId);
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? updatedOrder : order
        )
      );
    } catch {
      setError("We could not cancel that order. Please try again.");
    }
  };

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">ANNAM marketplace</p>
          <h1>My orders</h1>
          <p>Track your farm-fresh purchases from order to doorstep.</p>
        </div>
        <div className="header-mark" aria-hidden="true">06</div>
      </header>

      {error && <div className="notice error-notice" role="alert">{error}</div>}
      {loading && <div className="card empty-state">Loading your orders...</div>}
      {!loading && !orders.length && <div className="card empty-state">No orders yet.</div>}

      <section className="orders-grid" aria-label="Your orders">
        {orders.map((order) => (
          <article className="order-card" key={order.id}>
            <div className="order-top">
              <div>
                <span className="order-label">Order ID</span>
                <h2>{order.id}</h2>
              </div>
              <span className={`status ${statusClass(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div className="order-product">
              <img className="order-product-image" src={order.image_url || productImageFor(order.product)} alt="" />
              <div><strong>{order.product}</strong><span>From {order.farmer}</span></div>
            </div>

            <dl className="order-info">
              <div><dt>Quantity</dt><dd>{order.quantity} kg</dd></div>
              <div><dt>Price</dt><dd>₹{order.price} / kg</dd></div>
              <div><dt>Payment</dt><dd>{order.paymentStatus}</dd></div>
              <div><dt>Total</dt><dd>₹{order.total}</dd></div>
            </dl>

            <div className="order-bottom">
              <time>{order.date}</time>
              <div className="order-actions">
                <Link to={`/orders/${order.id}`} className="secondary-btn">Details</Link>
                {order.status !== "Delivered" && order.status !== "Cancelled" && <Link to="/track-delivery" className="secondary-btn">Track delivery</Link>}
                {order.status === "Pending" && <button className="danger-btn" onClick={() => handleCancel(order.id)}>Cancel</button>}
                {order.paymentStatus === "Pending" && order.status !== "Cancelled" && <Link to={`/payment/${order.id}`} className="primary-btn">Pay now</Link>}
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Orders;
