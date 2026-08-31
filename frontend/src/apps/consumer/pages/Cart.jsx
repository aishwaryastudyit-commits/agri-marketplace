import { useEffect, useState } from "react";
import { createOrder } from "../../../services/orderService";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedCart =
      JSON.parse(localStorage.getItem("annam.cart")) || [];

    setCartItems(savedCart);
  }, []);

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(
      (item) => item.id !== productId
    );

    setCartItems(updatedCart);

    localStorage.setItem(
      "annam.cart",
      JSON.stringify(updatedCart)
    );
  };

  const totalAmount = cartItems.reduce(
    (total, item) =>
      total + item.price * item.cartQuantity,
    0
  );

  const handleCheckout = async () => {
    if (!cartItems.length) {
      setMessage("Your cart is empty.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      for (const item of cartItems) {
        await createOrder({
          buyerId: 1,
          productId: item.id,
          quantity: item.cartQuantity
        });
      }

      localStorage.removeItem("annam.cart");
      setCartItems([]);

      setMessage("Order placed successfully!");
    } catch (error) {
      console.error(error);
      setMessage(
        "Could not place your order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">ANNAM marketplace</p>
          <h1>My Cart</h1>
          <p>Review your fresh products before checkout.</p>
        </div>
      </header>

      {message && (
        <div className="notice">
          {message}
        </div>
      )}

      {!cartItems.length ? (
        <div className="card empty-state">
          Your cart is empty.
        </div>
      ) : (
        <>
          <section className="orders-grid">
            {cartItems.map((item) => (
              <article
                className="order-card"
                key={item.id}
              >
                <h2>{item.name}</h2>

                <p>
                  ₹{item.price} / {item.unit}
                </p>

                <p>
                  Quantity: {item.cartQuantity} {item.unit}
                </p>

                <p>
                  Total: ₹
                  {item.price * item.cartQuantity}
                </p>

                <button
                  className="danger-btn"
                  onClick={() =>
                    removeFromCart(item.id)
                  }
                >
                  Remove
                </button>
              </article>
            ))}
          </section>

          <section
            className="card"
            style={{ marginTop: "30px" }}
          >
            <h2>
              Total: ₹{totalAmount}
            </h2>

            <button
              className="primary-btn"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading
                ? "Placing Order..."
                : "Place Order"}
            </button>
          </section>
        </>
      )}
    </main>
  );
}

export default Cart;