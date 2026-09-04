import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { confirmPayment, createPayment, getBulkOrders } from "../../../services/annamService";
import "../bulkBuyer.css";

export default function BulkPayment({ bulkBuyer }) {
  const navigate = useNavigate(); const location = useLocation();
  const [orders, setOrders] = useState([]); const [method, setMethod] = useState("UPI"); const [error, setError] = useState(""); const [paying, setPaying] = useState(false);
  useEffect(() => { getBulkOrders(bulkBuyer.id).then((result) => {
    const ids = location.state?.orderIds || [];
    setOrders(result.orders.filter((order) => ids.length ? ids.includes(order.id) : order.payment_status !== "successful"));
  }).catch((loadError) => setError(loadError.message || "Could not load order payment details.")); }, [bulkBuyer.id, location.state]);
  const total = useMemo(() => orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0), [orders]);
  const pay = async () => { setPaying(true); setError(""); try {
    await Promise.all(orders.map(async (order) => { const payment = await createPayment(order.id, method); await confirmPayment(payment.id); }));
    navigate("/bulk-payment-history", { replace: true });
  } catch (paymentError) { setError(paymentError.message || "Payment could not be completed."); } finally { setPaying(false); } };
  return <main className="bulk-content" style={{ maxWidth: 900, margin: "0 auto" }}><section className="bulk-page-header"><p className="bulk-section-kicker">BULK CHECKOUT</p><h2>Pay for your order</h2><p>Confirm payment for all {orders.length} bulk order lines.</p></section>{error && <p className="bulk-api-error">{error}</p>}<section className="bulk-result-card">{orders.map((order) => <p key={order.id}><strong>{order.product}</strong> · {order.quantity} {order.unit} · ₹{Number(order.total_amount).toLocaleString("en-IN")}</p>)}<h3>Total payable: ₹{total.toLocaleString("en-IN")}</h3><label>Payment method <select value={method} onChange={(event) => setMethod(event.target.value)}><option>UPI</option><option>Credit Card</option><option>Bank Transfer</option></select></label><div className="bulk-payment-actions"><button className="bulk-secondary-button" type="button" onClick={() => navigate("/bulk-cart")}>Back to cart</button><button className="bulk-payment-button" disabled={!orders.length || paying} type="button" onClick={pay}>{paying ? "Processing…" : "Pay & place order"}</button></div></section></main>;
}
