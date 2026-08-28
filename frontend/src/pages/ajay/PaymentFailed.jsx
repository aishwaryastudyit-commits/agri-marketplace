import { Link } from "react-router-dom";
import "../../styles/payments.css";

function PaymentFailed() { return <main className="page-shell"><section className="card payment-result"><div className="result-icon failed-icon">!</div><p className="eyebrow">Payment issue</p><h1>Payment failed</h1><p>We could not complete this payment. Please return to your orders and try again.</p><Link to="/orders" className="secondary-btn">Back to orders</Link></section></main>; }
export default PaymentFailed;