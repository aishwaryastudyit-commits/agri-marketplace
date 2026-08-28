import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Marketplace from "./apps/consumer/pages/Marketplace";

import Orders from "./pages/ajay/Orders";
import OrderDetails from "./pages/ajay/OrderDetails";
import Payment from "./pages/ajay/Payment";
import PaymentFailed from "./pages/ajay/PaymentFailed";
import PaymentSuccess from "./pages/ajay/PaymentSuccess";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/* Default page */}
				<Route path="/" element={<Navigate to="/marketplace" replace />} />

				{/* Consumer Marketplace */}
				<Route path="/marketplace" element={<Marketplace />} />

				{/* Orders */}
				<Route path="/orders" element={<Orders />} />
				<Route path="/orders/:orderId" element={<OrderDetails />} />

				{/* Payments */}
				<Route path="/payment/success" element={<PaymentSuccess />} />
				<Route path="/payment/failed" element={<PaymentFailed />} />
				<Route path="/payment/:orderId" element={<Payment />} />

				{/* Unknown routes */}
				<Route path="*" element={<Navigate to="/marketplace" replace />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;