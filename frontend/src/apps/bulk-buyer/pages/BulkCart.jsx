import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBulkOrder } from "../../../services/annamService";
import { getCart, saveCart } from "../bulkBuyerData.js";
import "../bulkBuyer.css";

export default function BulkCart({ bulkBuyer }) {
  const navigate = useNavigate();
  const [items, setItems] = useState(() => getCart(bulkBuyer?.id));
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);
  const total = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  const updateQuantity = (productId, value) => {
    const quantity = Number(value);
    setItems((current) => {
      const next = current.map((item) => item.product_id === productId ? { ...item, quantity: Math.max(1, Math.min(quantity || 1, item.availableQuantity)) } : item);
      saveCart(bulkBuyer.id, next);
      return next;
    });
  };
  const remove = (productId) => setItems((current) => {
    const next = current.filter((item) => item.product_id !== productId);
    saveCart(bulkBuyer.id, next);
    return next;
  });
  const placeOrder = async () => {
    if (!items.length) return;
    setPlacing(true); setError("");
    try {
      const result = await createBulkOrder(bulkBuyer.id, items.map((item) => ({ product_id: item.product_id, quantity: item.quantity })));
      saveCart(bulkBuyer.id, []);
      navigate("/bulk-orders");
    } catch (requestError) {
      setError(requestError.message || "We could not place your bulk order.");
    } finally { setPlacing(false); }
  };
  return <main className="bulk-content" style={{ maxWidth: 1050, margin: "0 auto" }}>
    <button type="button" className="bulk-secondary-button" onClick={() => navigate("/bulk-marketplace")}>← Continue sourcing</button>
    <section className="bulk-page-header"><p className="bulk-section-kicker">BULK CART</p><h2>Review your bulk order</h2><p>Set quantities in kilograms, then place one consolidated order request.</p></section>
    {error && <p className="bulk-api-error" role="alert">{error}</p>}
    {!items.length ? <section className="bulk-result-card"><h3>Your bulk cart is empty</h3><p>Add produce from the marketplace to create an order request.</p></section> : <>
      <section className="bulk-record-list">{items.map((item) => <article className="bulk-record-card" key={item.product_id}>
        <h3>{item.name}</h3><p>Farmer: {item.farmer} · ₹{item.price}/{item.unit}</p><p>Calculation: {item.quantity} {item.unit} × ₹{item.price} = ₹{(item.price * item.quantity).toLocaleString("en-IN")}</p><p>Delivery: {item.deliveryLocation || bulkBuyer?.location || "Address to be confirmed"}</p>
        <label>Quantity <input type="number" min="1" max={item.availableQuantity} value={item.quantity} onChange={(event) => updateQuantity(item.product_id, event.target.value)} /></label>
        <strong>₹{(item.price * item.quantity).toLocaleString("en-IN")}</strong><button type="button" className="bulk-secondary-button" onClick={() => remove(item.product_id)}>Remove</button>
      </article>)}</section>
      <section className="bulk-result-card"><h3>Order total: ₹{total.toLocaleString("en-IN")}</h3><p>{items.length} supplier line{items.length === 1 ? "" : "s"} will be sent as one bulk order request. You can review and pay from Bulk Orders.</p><button type="button" className="bulk-payment-button" disabled={placing} onClick={placeOrder}>{placing ? "Placing order…" : "Place bulk order"}</button></section>
    </>}
  </main>;
}
