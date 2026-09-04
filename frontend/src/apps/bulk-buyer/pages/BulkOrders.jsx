import BulkBuyerRecordsPage from "./BulkBuyerRecordsPage.jsx";
import { useNavigate } from "react-router-dom";

export default function BulkOrders({ bulkBuyer }) {
  const navigate = useNavigate();
  return <>
    <BulkBuyerRecordsPage bulkBuyer={bulkBuyer} mode="orders" />
    <button type="button" className="bulk-payment-button" style={{ position: "fixed", right: 28, bottom: 28, zIndex: 5 }} onClick={() => navigate("/bulk-payment")}>Pay pending bulk orders</button>
  </>;
}
