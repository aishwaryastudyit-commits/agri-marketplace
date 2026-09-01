import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Marketplace from "./apps/consumer/pages/Marketplace";
import Cart from "./apps/consumer/pages/Cart";
import ConsumerProfile from "./apps/consumer/pages/ConsumerProfile";
import Orders from "./pages/ajay/Orders";

// Bulk Buyer
import BulkBuyerLogin from "./apps/bulk-buyer/pages/BulkBuyerLogin";
import BulkBuyerMarketplace from "./apps/bulk-buyer/pages/BulkBuyerMarketplace";

// Logistics
import LogisticsApp from "./apps/logistics/App";

// Language
import { LanguageProvider } from "./context/LanguageContext.jsx";


function App() {

  /*
   * -----------------------------------------
   * CONSUMER LOGIN / USER DATA
   * -----------------------------------------
   */

  const savedBuyer = localStorage.getItem("annam-buyer");

  const buyer = savedBuyer
    ? JSON.parse(savedBuyer)
    : null;


  /*
   * -----------------------------------------
   * CONSUMER LOGIN
   * -----------------------------------------
   */

  const handleConsumerLogin = (buyerData) => {

    localStorage.setItem(
      "annam-buyer",
      JSON.stringify(buyerData)
    );

    window.location.href = "/marketplace";
  };


  /*
   * -----------------------------------------
   * BULK BUYER LOGIN
   * -----------------------------------------
   */

  const handleBulkBuyerLogin = (bulkBuyerData) => {

    localStorage.setItem(
      "annam-bulk-buyer",
      JSON.stringify(bulkBuyerData)
    );

    window.location.href = "/bulk-marketplace";
  };


  /*
   * -----------------------------------------
   * UPDATE CONSUMER PROFILE
   * -----------------------------------------
   */

  const handleUpdateBuyer = (updatedBuyer) => {

    localStorage.setItem(
      "annam-buyer",
      JSON.stringify(updatedBuyer)
    );
  };


  return (
    <LanguageProvider>

      <BrowserRouter>

        <Routes>

          {/* =================================
              HOME
          ================================= */}

          <Route
            path="/"
            element={
              <Navigate
                to="/marketplace"
                replace
              />
            }
          />


          {/* =================================
              CONSUMER
          ================================= */}

          <Route
            path="/marketplace"
            element={
              <Marketplace
                buyer={buyer}
              />
            }
          />


          <Route
            path="/cart"
            element={
              <Cart />
            }
          />


          <Route
            path="/orders"
            element={
              <Orders />
            }
          />


          <Route
            path="/profile"
            element={
              <ConsumerProfile
                buyer={buyer}
                onUpdateBuyer={handleUpdateBuyer}
              />
            }
          />


          {/* =================================
              CONSUMER PLACEHOLDERS
          ================================= */}

          <Route
            path="/notifications"
            element={
              <PagePlaceholder
                title="Notifications"
                description="Your ANNAM notifications will appear here."
              />
            }
          />


          <Route
            path="/track-delivery"
            element={
              <PagePlaceholder
                title="Track Delivery"
                description="Track your farm-fresh order delivery here."
              />
            }
          />


          {/* =================================
              BULK BUYER
          ================================= */}

          <Route
            path="/bulk-login"
            element={
              <BulkBuyerLogin
                onLogin={handleBulkBuyerLogin}
              />
            }
          />


          <Route
            path="/bulk-marketplace"
            element={
              <BulkBuyerMarketplace
                bulkBuyer={
                  JSON.parse(
                    localStorage.getItem(
                      "annam-bulk-buyer"
                    )
                  ) || null
                }
              />
            }
          />


          {/* =================================
              BULK BUYER PLACEHOLDERS
          ================================= */}

          <Route
            path="/bulk-requirements"
            element={
              <PagePlaceholder
                title="My Requirements"
                description="Bulk procurement requirements will appear here."
              />
            }
          />


          <Route
            path="/bulk-orders"
            element={
              <PagePlaceholder
                title="Bulk Orders"
                description="Your bulk procurement orders will appear here."
              />
            }
          />


          <Route
            path="/bulk-track-delivery"
            element={
              <PagePlaceholder
                title="Bulk Delivery"
                description="Track your bulk delivery here."
              />
            }
          />


          <Route
            path="/bulk-profile"
            element={
              <PagePlaceholder
                title="Bulk Buyer Profile"
                description="Manage your business profile here."
              />
            }
          />


          <Route
            path="/bulk-notifications"
            element={
              <PagePlaceholder
                title="Bulk Notifications"
                description="Your procurement notifications will appear here."
              />
            }
          />


          {/* =================================
              LOGISTICS
          ================================= */}

          <Route
            path="/logistics/*"
            element={
              <LogisticsApp />
            }
          />


          {/* =================================
              FALLBACK
          ================================= */}

          <Route
            path="*"
            element={
              <Navigate
                to="/marketplace"
                replace
              />
            }
          />

        </Routes>

      </BrowserRouter>

    </LanguageProvider>
  );
}


/*
 * =========================================
 * TEMPORARY PAGE PLACEHOLDER
 * =========================================
 *
 * We will replace these with the actual
 * teammate pages once we connect them.
 */

function PagePlaceholder({
  title,
  description,
}) {

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "60px",
        background: "#f7f8f3",
      }}
    >

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "white",
          padding: "50px",
          borderRadius: "20px",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.06)",
        }}
      >

        <p
          style={{
            color: "#4f7d45",
            fontWeight: "700",
            letterSpacing: "1px",
          }}
        >
          ANNAM
        </p>

        <h1>{title}</h1>

        <p
          style={{
            color: "#666",
            fontSize: "17px",
          }}
        >
          {description}
        </p>

      </div>

    </main>
  );
}


export default App;