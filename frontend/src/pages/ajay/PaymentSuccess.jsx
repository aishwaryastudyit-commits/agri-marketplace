import { Link } from "react-router-dom";
import "../../styles/payments.css";

function PaymentSuccess() { return <main className="page-shell"><section className="card payment-result"><div className="result-icon success-icon">✓</div><p className="eyebrow">Payment received</p><h1>All set.</h1><p>Your order has been paid successfully and is now being prepared.</p><Link to="/orders" className="primary-btn">View my orders</Link></section></main>; }
export default PaymentSuccess;