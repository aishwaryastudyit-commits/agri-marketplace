import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";

import Marketplace from "./apps/consumer/pages/Marketplace";
import Cart from "./apps/consumer/pages/Cart";
import ConsumerLogin from "./apps/consumer/pages/ConsumerLogin";
import ConsumerProfile from "./apps/consumer/pages/ConsumerProfile";
import BulkBuyerLogin from "./apps/bulk-buyer/pages/BulkBuyerLogin";
import BulkBuyerMarketplace from "./apps/bulk-buyer/pages/BulkBuyerMarketplace";
import BulkBuyerProfile from "./apps/bulk-buyer/pages/BulkBuyerProfile";
import BulkPaymentHistory from "./apps/bulk-buyer/pages/BulkPaymentHistory";
import LogisticsApp from "./apps/logistics/App";
import Orders from "./pages/ajay/Orders";
import OrderDetails from "./pages/ajay/OrderDetails";
import Payment from "./pages/ajay/Payment";
import PaymentFailed from "./pages/ajay/PaymentFailed";
import PaymentSuccess from "./pages/ajay/PaymentSuccess";
import RoleLogin from "./pages/RoleLogin";
import RoleSelection from "./pages/RoleSelection";
import { LanguageProvider } from "./context/LanguageContext.jsx";

function TemporaryPage({ title, message, backPath = "/" }) {
  const navigate = useNavigate();
  return (
    <main className="page-shell">
      <button type="button" className="secondary-btn" onClick={() => navigate(backPath)}>Back</button>
      <section className="card" style={{ marginTop: 24 }}>
        <h1>{title}</h1>
        <p>{message}</p>
      </section>
    </main>
  );
}

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

  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/login" element={buyer ? <Navigate to="/marketplace" replace /> : <ConsumerLogin onLogin={saveBuyer} />} />
          <Route path="/marketplace" element={buyer ? <Marketplace buyer={buyer} /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={buyer ? <ConsumerProfile buyer={buyer} onUpdateBuyer={saveBuyer} /> : <Navigate to="/login" replace />} />
          <Route path="/cart" element={buyer ? <Cart /> : <Navigate to="/login" replace />} />
          <Route path="/orders" element={buyer ? <Orders /> : <Navigate to="/login" replace />} />
          <Route path="/orders/:orderId" element={buyer ? <OrderDetails /> : <Navigate to="/login" replace />} />
          <Route path="/payment/success" element={buyer ? <PaymentSuccess /> : <Navigate to="/login" replace />} />
          <Route path="/payment/failed" element={buyer ? <PaymentFailed /> : <Navigate to="/login" replace />} />
          <Route path="/payment/:orderId" element={buyer ? <Payment /> : <Navigate to="/login" replace />} />

          <Route path="/bulk-login" element={bulkBuyer ? <Navigate to="/bulk-marketplace" replace /> : <BulkBuyerLogin onLogin={saveBulkBuyer} />} />
          <Route path="/bulk-marketplace" element={bulkBuyer ? <BulkBuyerMarketplace bulkBuyer={bulkBuyer} /> : <Navigate to="/bulk-login" replace />} />
          <Route path="/bulk-profile" element={bulkBuyer ? <BulkBuyerProfile bulkBuyer={bulkBuyer} onUpdateBulkBuyer={saveBulkBuyer} /> : <Navigate to="/bulk-login" replace />} />
          <Route path="/bulk-payment-history" element={bulkBuyer ? <BulkPaymentHistory bulkBuyer={bulkBuyer} /> : <Navigate to="/bulk-login" replace />} />
          <Route path="/bulk-orders" element={bulkBuyer ? <TemporaryPage title="Bulk Orders" message="Your confirmed bulk orders will appear here." backPath="/bulk-marketplace" /> : <Navigate to="/bulk-login" replace />} />
          <Route path="/bulk-requirements" element={bulkBuyer ? <TemporaryPage title="My Requirements" message="Your procurement requirements will appear here." backPath="/bulk-marketplace" /> : <Navigate to="/bulk-login" replace />} />
          <Route path="/bulk-track-delivery" element={bulkBuyer ? <TemporaryPage title="Bulk Delivery" message="Track your bulk delivery here." backPath="/bulk-marketplace" /> : <Navigate to="/bulk-login" replace />} />

          <Route path="/farmer-login" element={farmer ? <Navigate to="/farmer" replace /> : <RoleLogin role="farmer" onLogin={(data) => saveRole("farmer", data)} />} />
          <Route path="/worker-login" element={worker ? <Navigate to="/worker" replace /> : <RoleLogin role="worker" onLogin={(data) => saveRole("worker", data)} />} />
          <Route path="/farmer" element={farmer ? <TemporaryPage title="Farmer workspace" message="Your farmer module is ready." /> : <Navigate to="/farmer-login" replace />} />
          <Route path="/worker" element={worker ? <LogisticsApp /> : <Navigate to="/worker-login" replace />} />
          <Route path="/logistics/*" element={worker ? <LogisticsApp /> : <Navigate to="/worker-login" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
