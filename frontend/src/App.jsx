import { useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import Marketplace from "./apps/consumer/pages/Marketplace";
import ConsumerLogin from "./apps/consumer/pages/ConsumerLogin";
import ConsumerProfile from "./apps/consumer/pages/ConsumerProfile";

import Orders from "./pages/ajay/Orders";
import OrderDetails from "./pages/ajay/OrderDetails";
import Payment from "./pages/ajay/Payment";
import PaymentFailed from "./pages/ajay/PaymentFailed";
import PaymentSuccess from "./pages/ajay/PaymentSuccess";


/* TEMPORARY PAGES
   Your teammates' code can replace these later.
*/

function TemporaryPage({ title, message }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <button
        type="button"
        onClick={() => navigate("/marketplace")}
        style={{
          marginBottom: "30px",
          padding: "10px 18px",
          cursor: "pointer",
        }}
      >
        ← Back to Marketplace
      </button>

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "40px",
          borderRadius: "15px",
          border: "1px solid #ddd",
        }}
      >
        <h1>{title}</h1>

        <p
          style={{
            marginTop: "15px",
            fontSize: "16px",
          }}
        >
          {message}
        </p>
      </div>
    </div>
  );
}


function App() {
  const [buyer, setBuyer] = useState(() => {
    const savedBuyer = localStorage.getItem("annam-buyer");

    return savedBuyer
      ? JSON.parse(savedBuyer)
      : null;
  });


  const handleLogin = (buyerData) => {
    localStorage.setItem(
      "annam-buyer",
      JSON.stringify(buyerData)
    );

    setBuyer(buyerData);
  };


  const handleUpdateBuyer = (updatedBuyer) => {
    localStorage.setItem(
      "annam-buyer",
      JSON.stringify(updatedBuyer)
    );

    setBuyer(updatedBuyer);
  };


  return (
    <BrowserRouter>
      <Routes>

        {/* DEFAULT PAGE */}
        <Route
          path="/"
          element={
            buyer ? (
              <Navigate
                to="/marketplace"
                replace
              />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />


        {/* LOGIN */}
        <Route
          path="/login"
          element={
            buyer ? (
              <Navigate
                to="/marketplace"
                replace
              />
            ) : (
              <ConsumerLogin
                onLogin={handleLogin}
              />
            )
          }
        />


        {/* MARKETPLACE */}
        <Route
          path="/marketplace"
          element={
            buyer ? (
              <Marketplace
                buyer={buyer}
              />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />


        {/* PROFILE */}
        <Route
          path="/profile"
          element={
            buyer ? (
              <ConsumerProfile
                buyer={buyer}
                onUpdateBuyer={handleUpdateBuyer}
              />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />


        {/* ORDERS */}
        <Route
          path="/orders"
          element={
            buyer ? (
              <Orders />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        <Route
          path="/orders/:orderId"
          element={
            buyer ? (
              <OrderDetails />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />


        {/* TEMPORARY TRACK DELIVERY PAGE */}
        <Route
          path="/track-delivery"
          element={
            buyer ? (
              <TemporaryPage
                title="Track Delivery"
                message="Your order tracking information will appear here once the delivery tracking system is connected."
              />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />


        {/* TEMPORARY CART PAGE */}
        <Route
          path="/cart"
          element={
            buyer ? (
              <TemporaryPage
                title="My Cart"
                message="Your selected products will appear here. Cart functionality can be connected later."
              />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />


        {/* TEMPORARY NOTIFICATIONS PAGE */}
        <Route
          path="/notifications"
          element={
            buyer ? (
              <TemporaryPage
                title="Notifications"
                message="Notifications from farmers, order confirmations and delivery updates will appear here."
              />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />


        {/* PAYMENTS */}
        <Route
          path="/payment/success"
          element={
            buyer ? (
              <PaymentSuccess />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        <Route
          path="/payment/failed"
          element={
            buyer ? (
              <PaymentFailed />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        <Route
          path="/payment/:orderId"
          element={
            buyer ? (
              <Payment />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />


        {/* UNKNOWN ROUTES */}
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;