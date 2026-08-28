import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Orders from "./pages/ajay/Orders";
import OrderDetails from "./pages/ajay/OrderDetails";
import Payment from "./pages/ajay/Payment";
import PaymentFailed from "./pages/ajay/PaymentFailed";
import PaymentSuccess from "./pages/ajay/PaymentSuccess";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Navigate to="/orders" replace />} />
				<Route path="/orders" element={<Orders />} />
				<Route path="/orders/:orderId" element={<OrderDetails />} />
				<Route path="/payment/success" element={<PaymentSuccess />} />
				<Route path="/payment/failed" element={<PaymentFailed />} />
				<Route path="/payment/:orderId" element={<Payment />} />
				<Route path="*" element={<Navigate to="/orders" replace />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
