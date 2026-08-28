import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getOrderById, makePayment } from "../../services/orderService";
import "../../styles/payments.css";

function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState();
  const [method, setMethod] = useState("UPI");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { getOrderById(orderId).then(setOrder).catch(() => setError("We could not load this order.")); }, [orderId]);

  if (order === undefined) return <main className="page-shell"><div className="card empty-state">Loading order...</div></main>;
  if (!order) return <main className="page-shell"><div className="card empty-state"><h1>Order not found</h1><Link to="/orders" className="primary-btn">Back to orders</Link></div></main>;

  const handlePayment = async (event) => {
    event.preventDefault();
    setProcessing(true); setError("");
    try { await makePayment({ orderId, paymentMethod: method }); navigate("/payment/success"); }
    catch { setError("Payment could not be completed. Please try again."); setProcessing(false); }
  };

  return (
    <main className="page-shell">
      <Link to={`/orders/${order.id}`} className="back-link">← Review order</Link>
      <header className="page-header compact-header"><div><p className="eyebrow">Secure checkout</p><h1>Complete payment</h1><p>Your produce is nearly on its way.</p></div></header>
      <div className="payment-layout">
        <section className="card summary-card"><p className="section-kicker">Order summary</p><h2>{order.product}</h2><p className="muted">{order.quantity} kg from {order.farmer}</p><div className="summary-total"><span>Total due</span><strong>₹{order.total}</strong></div></section>
        <section className="card payment-card"><p className="section-kicker">Payment method</p><h2>How would you like to pay?</h2><form onSubmit={handlePayment}><label htmlFor="method">Select a method</label><select id="method" value={method} onChange={(event) => setMethod(event.target.value)}><option>UPI</option><option>Card</option><option>Net Banking</option></select>{error && <p className="form-error" role="alert">{error}</p>}<button type="submit" className="primary-btn payment-btn" disabled={processing}>{processing ? "Processing..." : `Pay ₹${order.total}`}</button></form><p className="secure-note">Your payment details are handled securely.</p></section>
      </div>
    </main>
  );
}

export default Payment;