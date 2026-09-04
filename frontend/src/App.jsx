import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Marketplace from "./apps/consumer/pages/Marketplace";
import Cart from "./apps/consumer/pages/Cart";
import ConsumerLogin from "./apps/consumer/pages/ConsumerLogin";
import ConsumerProfile from "./apps/consumer/pages/ConsumerProfile";
import Notifications from "./apps/consumer/pages/Notifications";
import BulkBuyerLogin from "./apps/bulk-buyer/pages/BulkBuyerLogin";
import BulkBuyerMarketplace from "./apps/bulk-buyer/pages/BulkBuyerMarketplace";
import BulkBuyerProfile from "./apps/bulk-buyer/pages/BulkBuyerProfile";
import BulkPaymentHistory from "./apps/bulk-buyer/pages/BulkPaymentHistory";
import BulkOrders from "./apps/bulk-buyer/pages/BulkOrders";
import BulkTrackDelivery from "./apps/bulk-buyer/pages/BulkTrackDelivery";
import BulkCart from "./apps/bulk-buyer/pages/BulkCart";
import BulkPayment from "./apps/bulk-buyer/pages/BulkPayment";
import LogisticsApp from "./apps/logistics/App";
import FarmerModule from "./apps/farmer/src/FarmerModule";
import Orders from "./pages/ajay/Orders";
import OrderDetails from "./pages/ajay/OrderDetails";
import TrackDelivery from "./pages/ajay/TrackDelivery";
import Payment from "./pages/ajay/Payment";
import PaymentFailed from "./pages/ajay/PaymentFailed";
import PaymentSuccess from "./pages/ajay/PaymentSuccess";
import RoleLogin from "./pages/RoleLogin";
import RoleSelection from "./pages/RoleSelection";
import AIInsights from "./pages/AIInsights";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import { upsertBuyer } from "./services/annamService";

export default function App() {
  const [buyer, setBuyer] = useState(() => JSON.parse(localStorage.getItem("annam-buyer") || "null"));
  const [bulkBuyer, setBulkBuyer] = useState(() => JSON.parse(localStorage.getItem("annam-bulk-buyer") || "null"));
  const [farmer, setFarmer] = useState(() => JSON.parse(localStorage.getItem("annam-farmer") || "null"));
  const [worker, setWorker] = useState(() => JSON.parse(localStorage.getItem("annam-worker") || "null"));

  const saveRole = (role, data) => {
    localStorage.setItem(`annam-${role}`, JSON.stringify(data));
    if (role === "farmer") setFarmer(data);
    if (role === "worker") setWorker(data);
  };

  const saveBuyer = (data) => {
    localStorage.setItem("annam-buyer", JSON.stringify(data));
    setBuyer(data);
  };

  const saveBulkBuyer = (data) => {
    localStorage.setItem("annam-bulk-buyer", JSON.stringify(data));
    setBulkBuyer(data);
  };

  // Older builds stored buyer details before the backend assigned an ID.  A
  // cart and notifications are keyed by that ID, so repair such sessions once
  // rather than silently ignoring cart actions.
  useEffect(() => {
    if (!buyer || buyer.id) return;
    const phone = buyer.phone || buyer.mobile || buyer.mobileNumber;
    const fullName = buyer.full_name || buyer.fullName || buyer.name;
    if (!phone || !fullName) return;

    upsertBuyer({
      full_name: fullName,
      phone,
      location: buyer.location || "",
      buyer_type: buyer.buyer_type || "consumer",
    }).then(saveBuyer).catch(() => {
      // The page-level request will show a useful error if the API is down.
    });
  }, [buyer]);

  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/login" element={buyer ? <Navigate to="/marketplace" replace /> : <ConsumerLogin onLogin={saveBuyer} />} />
          <Route path="/marketplace" element={buyer ? <Marketplace buyer={buyer} /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={buyer ? <ConsumerProfile buyer={buyer} onUpdateBuyer={saveBuyer} /> : <Navigate to="/login" replace />} />
          <Route path="/notifications" element={buyer ? <Notifications buyer={buyer} /> : <Navigate to="/login" replace />} />
          <Route path="/cart" element={buyer ? <Cart buyer={buyer} /> : <Navigate to="/login" replace />} />
          <Route path="/orders" element={buyer ? <Orders /> : <Navigate to="/login" replace />} />
          <Route path="/orders/:orderId" element={buyer ? <OrderDetails /> : <Navigate to="/login" replace />} />
          <Route path="/track-delivery" element={buyer ? <TrackDelivery /> : <Navigate to="/login" replace />} />
          <Route path="/payment/success" element={buyer ? <PaymentSuccess /> : <Navigate to="/login" replace />} />
          <Route path="/payment/failed" element={buyer ? <PaymentFailed /> : <Navigate to="/login" replace />} />
          <Route path="/payment/:orderId" element={buyer ? <Payment /> : <Navigate to="/login" replace />} />
          <Route path="/ai-insights" element={buyer ? <AIInsights role="consumer" profile={buyer} /> : <Navigate to="/login" replace />} />

          <Route path="/bulk-login" element={bulkBuyer ? <Navigate to="/bulk-marketplace" replace /> : <BulkBuyerLogin onLogin={saveBulkBuyer} />} />
          <Route path="/bulk-marketplace" element={bulkBuyer ? <BulkBuyerMarketplace bulkBuyer={bulkBuyer} /> : <Navigate to="/bulk-login" replace />} />
          <Route path="/bulk-profile" element={bulkBuyer ? <BulkBuyerProfile bulkBuyer={bulkBuyer} onUpdateBulkBuyer={saveBulkBuyer} /> : <Navigate to="/bulk-login" replace />} />
          <Route path="/bulk-payment-history" element={bulkBuyer ? <BulkPaymentHistory bulkBuyer={bulkBuyer} /> : <Navigate to="/bulk-login" replace />} />
          <Route path="/bulk-orders" element={bulkBuyer ? <BulkOrders bulkBuyer={bulkBuyer} /> : <Navigate to="/bulk-login" replace />} />
          <Route path="/bulk-cart" element={bulkBuyer ? <BulkCart bulkBuyer={bulkBuyer} /> : <Navigate to="/bulk-login" replace />} />
          <Route path="/bulk-payment" element={bulkBuyer ? <BulkPayment bulkBuyer={bulkBuyer} /> : <Navigate to="/bulk-login" replace />} />
          <Route path="/bulk-track-delivery" element={bulkBuyer ? <BulkTrackDelivery bulkBuyer={bulkBuyer} /> : <Navigate to="/bulk-login" replace />} />
          <Route path="/bulk-ai-insights" element={bulkBuyer ? <AIInsights role="bulk" profile={bulkBuyer} /> : <Navigate to="/bulk-login" replace />} />

          <Route path="/farmer-login" element={farmer ? <Navigate to="/farmer" replace /> : <RoleLogin role="farmer" onLogin={(data) => saveRole("farmer", data)} />} />
          <Route path="/worker-login" element={worker ? <Navigate to="/worker" replace /> : <RoleLogin role="worker" onLogin={(data) => saveRole("worker", data)} />} />
          <Route path="/farmer" element={farmer ? <FarmerModule farmer={farmer} /> : <Navigate to="/farmer-login" replace />} />
          <Route path="/worker" element={worker ? <LogisticsApp /> : <Navigate to="/worker-login" replace />} />
          <Route path="/logistics/*" element={worker ? <LogisticsApp /> : <Navigate to="/worker-login" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
