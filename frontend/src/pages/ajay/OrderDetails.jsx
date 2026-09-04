import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { getOrderById } from "../../services/orderService";
import "../../styles/orders.css";

function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState();

  useEffect(() => { getOrderById(orderId).then(setOrder); }, [orderId]);

  if (order === undefined) return <main className="page-shell"><div className="card empty-state">Loading order...</div></main>;
  if (!order) return <main className="page-shell"><div className="card empty-state"><h1>Order not found</h1><Link to="/orders" className="primary-btn">Back to orders</Link></div></main>;

  return (
    <main className="page-shell narrow-shell">
      <Link to="/orders" className="back-link">← Back to orders</Link>
      <header className="page-header compact-header"><div><p className="eyebrow">Order overview</p><h1>{order.id}</h1><p>Placed on {order.date}</p></div><span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></header>
      <section className="card detail-card">
        <div className="detail-heading"><div className="product-icon large-icon">{order.product.charAt(0)}</div><div><h2>{order.product}</h2><p>Supplied by {order.farmer}</p></div></div>
        <dl className="detail-list">
          <div><dt>Quantity</dt><dd>{order.quantity} kg</dd></div><div><dt>Unit price</dt><dd>₹{order.price} / kg</dd></div><div><dt>Payment status</dt><dd>{order.paymentStatus}</dd></div><div className="total-row"><dt>Total amount</dt><dd>₹{order.total}</dd></div>
        </dl>
        <div className="detail-actions">
          {order.status !== "Delivered" && order.status !== "Cancelled" && <Link to="/track-delivery" className="secondary-btn">Track delivery</Link>}
          {order.paymentStatus === "Pending" && order.status !== "Cancelled" && <Link to={`/payment/${order.id}`} className="primary-btn">Make payment</Link>}
        </div>
      </section>
    </main>
  );
}

export default OrderDetails;