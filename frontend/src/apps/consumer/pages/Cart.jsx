import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { checkoutCart, getCart, removeCartItem, updateCartItem } from "../../../services/annamService";
import { productImageFor } from "../../../utils/productImages";
import "../buyerWorkflow.css";

function Cart({ buyer }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!buyer?.id) return;
    getCart(buyer.id).then(setCartItems).catch((error) => setMessage(error.message || "Could not load your cart."));
  }, [buyer?.id]);

  const removeFromCart = async (productId) => {
    try {
      await removeCartItem(buyer.id, productId);
      setCartItems((items) => items.filter((item) => item.product_id !== productId));
    } catch (error) { setMessage(error.message || "Could not remove the item."); }
  };

  const changeQuantity = async (item, quantity) => {
    if (quantity <= 0) return removeFromCart(item.product_id);
    if (quantity > item.available_quantity) {
      setMessage(`Only ${item.available_quantity} ${item.unit} of ${item.name} is available.`);
      return;
    }
    try {
      setMessage("");
      const updated = await updateCartItem(buyer.id, item.product_id, quantity);
      setCartItems((items) => items.map((entry) => entry.product_id === item.product_id ? updated : entry));
    } catch (error) { setMessage(error.message || "Could not update the quantity."); }
  };

  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.cartQuantity, 0);

  const handleCheckout = async () => {
    if (!cartItems.length) return setMessage("Your cart is empty.");
    setLoading(true); setMessage("");
    try {
      if (!buyer?.id) throw new Error("Buyer account is not linked");
      await checkoutCart(buyer.id);
      setCartItems([]);
      setMessage("Order placed successfully. Follow payment and delivery updates in Notifications.");
    } catch (error) { setMessage(error.message || "Could not place your order. Please try again."); }
    finally { setLoading(false); }
  };

  return <main className="page-shell buyer-workflow">
    <header className="page-header">
      <div><p className="eyebrow">ANNAM marketplace</p><h1>My Cart</h1><p>Fresh produce, directly from local farms.</p></div>
      <div className="workflow-header-actions"><Link className="secondary-btn" to="/marketplace">Continue shopping</Link><Link className="secondary-btn" to="/notifications">Updates</Link></div>
    </header>
    {message && <div className="notice cart-notice" role="status">{message}</div>}
    {!cartItems.length ? <div className="card empty-state"><h2>Your basket is ready for fresh picks.</h2><p>Browse local farm products and add what you need.</p><Link className="primary-btn" to="/marketplace">Explore marketplace</Link></div> :
      <section className="cart-layout">
        <div className="cart-list">{cartItems.map((item) => <article className="order-card cart-item" key={item.product_id}>
          <img className="cart-product-image" src={item.image_url || productImageFor(item.name)} alt="" />
          <div><p className="workflow-kicker">From {item.farmer_name || "a local farmer"}</p><h2>{item.name}</h2><p className="cart-item-price">Rs. {item.price} / {item.unit}</p><p>{item.available_quantity} {item.unit} currently available</p></div>
          <div className="cart-item-footer"><div className="quantity-controls" aria-label={`Quantity for ${item.name}`}><button type="button" aria-label={`Remove one ${item.name}`} onClick={() => changeQuantity(item, item.cartQuantity - 1)}>-</button><span>{item.cartQuantity}</span><button type="button" aria-label={`Add one ${item.name}`} onClick={() => changeQuantity(item, item.cartQuantity + 1)}>+</button></div><strong className="cart-item-total">Rs. {(item.price * item.cartQuantity).toFixed(2)}</strong><button className="danger-btn" onClick={() => removeFromCart(item.product_id)}>Remove</button></div>
        </article>)}</div>
        <aside className="card cart-summary"><p className="eyebrow">Order summary</p><h2>{cartItems.length} item{cartItems.length === 1 ? "" : "s"} in your cart</h2><div className="cart-summary-row"><span>Subtotal</span><strong>Rs. {totalAmount.toFixed(2)}</strong></div><div className="cart-summary-row"><span>Delivery</span><span>Calculated after payment</span></div><div className="cart-summary-row cart-summary-total"><span>Total</span><span>Rs. {totalAmount.toFixed(2)}</span></div><button className="primary-btn" onClick={handleCheckout} disabled={loading}>{loading ? "Placing order..." : "Place order"}</button><p className="cart-summary-note">Stock is checked again when your order is placed. We will notify you about payment and delivery.</p></aside>
      </section>}
  </main>;
}

export default Cart;
