import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext.jsx";
import { getBuyerPayments, getBulkOrders } from "../../../services/annamService";
import "../bulkBuyer.css";

function BulkPaymentHistory({ bulkBuyer }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const displayName =
    bulkBuyer?.full_name ||
    bulkBuyer?.business_name ||
    t("bulkBuyer");

  const getInitial = () => {
    return displayName.charAt(0).toUpperCase();
  };

  const [payments, setPayments] = useState([]);
  const [loadError, setLoadError] = useState("");
  useEffect(() => {
    if (!bulkBuyer?.id) return;
    Promise.all([getBuyerPayments(bulkBuyer.id), getBulkOrders(bulkBuyer.id)])
      .then(([paymentRows, orderResult]) => {
        const orderById = new Map((orderResult.orders || []).map((order) => [order.id, order]));
        setPayments(paymentRows.map((payment) => {
          const order = orderById.get(payment.order_id) || {};
          const timestamp = new Date(payment.created_at || order.created_at || Date.now());
          return { id: `PAY-${payment.id}`, product: order.product || `Order #${payment.order_id}`, farmer: order.farmer || "Farmer", quantity: `${order.quantity || ""} ${order.unit || "kg"}`, amount: Number(payment.amount || order.total_amount || 0), method: payment.payment_method || "UPI", date: timestamp.toLocaleDateString("en-IN"), time: timestamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }), transactionId: `ANNAM-${payment.id}`, status: payment.payment_status || "Pending" };
        }));
      }).catch((error) => setLoadError(error.message || "Could not load payment history."));
  }, [bulkBuyer?.id]);

  return (
    <div className="bulk-app">

      {/* ================= SIDEBAR ================= */}

      <aside className="bulk-sidebar">

        <div className="bulk-logo-section">

          <div className="bulk-logo-icon">
            A
          </div>

          <div>
            <h1>ANNAM</h1>

            <p>
              Farm to Market
            </p>
          </div>

        </div>


        <div className="bulk-sidebar-menu">

          <p className="bulk-sidebar-heading">
            {t("bulkProcurement")}
          </p>


          <button
            type="button"
            className="bulk-sidebar-link"
            onClick={() =>
              navigate("/bulk-marketplace")
            }
          >
            <span className="bulk-nav-icon">
              ▦
            </span>

            <span>
              {t("marketplace")}
            </span>
          </button>


          <button
            type="button"
            className="bulk-sidebar-link"
            onClick={() =>
              navigate("/bulk-orders")
            }
          >
            <span className="bulk-nav-icon">
              ▤
            </span>

            <span>
              {t("bulkOrders")}
            </span>
          </button>


          <button
            type="button"
            className="bulk-sidebar-link"
            onClick={() =>
              navigate("/bulk-orders")
            }
          >
            <span className="bulk-nav-icon">
              □
            </span>

            <span>
              {t("bulkOrders")}
            </span>
          </button>


          <button
            type="button"
            className="bulk-sidebar-link"
            onClick={() =>
              navigate("/bulk-track-delivery")
            }
          >
            <span className="bulk-nav-icon">
              ↝
            </span>

            <span>
              {t("trackDelivery")}
            </span>
          </button>


          {/* PAYMENT HISTORY */}

          <button
            type="button"
            className="bulk-sidebar-link active"
            onClick={() =>
              navigate("/bulk-payment-history")
            }
          >
            <span className="bulk-nav-icon">
              ₹
            </span>

            <span>
              Payment History
            </span>
          </button>

        </div>


        <div className="bulk-sidebar-bottom">

          <p>
            {t("directProcurement")}
          </p>

        </div>

      </aside>


      {/* ================= MAIN ================= */}

      <main className="bulk-main">

        {/* ================= TOP BAR ================= */}

        <header className="bulk-topbar">

          <div className="bulk-search-container">

            <span className="bulk-search-icon">
              ⌕
            </span>

            <input
              type="text"
              placeholder={t("searchPlaceholder")}
            />

            <button
              type="button"
              className="bulk-search-button"
            >
              {t("search")}
            </button>

          </div>


          <div className="bulk-top-actions">

            <button
              type="button"
              className="bulk-notification-button"
              onClick={() =>
                navigate("/bulk-notifications")
              }
              aria-label={t("notifications")}
            >
              🔔
            </button>


            <button
              type="button"
              className="bulk-profile-button"
              onClick={() =>
                navigate("/bulk-profile")
              }
            >

              <div className="bulk-profile-avatar">
                {getInitial()}
              </div>

              <div className="bulk-profile-info">
                <strong>
                  {displayName}
                </strong>
              </div>

            </button>

          </div>

        </header>


        {/* ================= CONTENT ================= */}

        <div className="bulk-content">

          {loadError && <p className="bulk-api-error" role="alert">{loadError}</p>}

          <section className="bulk-page-header">

            <p className="bulk-section-kicker">
              PAYMENTS
            </p>

            <h2>
              Payment History
            </h2>

            <p>
              View your previous bulk purchases,
              payment details and transaction records.
            </p>

          </section>


          {/* ================= PAYMENT LIST ================= */}

          <section className="bulk-payment-history-section">

            {payments.map((payment) => (

              <div
                className="bulk-payment-history-card"
                key={payment.id}
              >

                {/* PAYMENT HEADER */}

                <div className="bulk-payment-history-header">

                  <div>

                    <p className="bulk-payment-id">
                      {payment.id}
                    </p>

                    <h3>
                      {payment.product}
                    </h3>

                    <p>
                      Farmer: {payment.farmer}
                    </p>

                  </div>


                  <div className="bulk-payment-amount">

                    ₹
                    {payment.amount.toLocaleString(
                      "en-IN"
                    )}

                    <span className="bulk-payment-success">
                      ✓ Paid
                    </span>

                  </div>

                </div>


                <div className="bulk-card-line"></div>


                {/* PAYMENT DETAILS */}

                <div className="bulk-payment-details">

                  <div>
                    <span>
                      QUANTITY
                    </span>

                    <strong>
                      {payment.quantity}
                    </strong>
                  </div>


                  <div>
                    <span>
                      PAYMENT METHOD
                    </span>

                    <strong>
                      {payment.method}
                    </strong>
                  </div>


                  <div>
                    <span>
                      DATE
                    </span>

                    <strong>
                      {payment.date}
                    </strong>
                  </div>


                  <div>
                    <span>
                      TIME
                    </span>

                    <strong>
                      {payment.time}
                    </strong>
                  </div>


                  <div>
                    <span>
                      TRANSACTION ID
                    </span>

                    <strong>
                      {payment.transactionId}
                    </strong>
                  </div>


                  <div>
                    <span>
                      STATUS
                    </span>

                    <strong className="bulk-status-success">
                      ✓ {payment.status}
                    </strong>
                  </div>

                </div>

              </div>

            ))}

          </section>

        </div>

      </main>

    </div>
  );
}

export default BulkPaymentHistory;
