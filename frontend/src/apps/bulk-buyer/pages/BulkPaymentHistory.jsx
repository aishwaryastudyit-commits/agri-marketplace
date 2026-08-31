import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext.jsx";
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

  /* =========================
     TEMPORARY PAYMENT DATA
     ========================= */

  const payments = [
    {
      id: "PAY-001",
      product: "Premium Onions",
      farmer: "Murugan",
      quantity: "100 kg",
      amount: 3000,
      method: "UPI",
      date: "31 Aug 2026",
      time: "09:48 AM",
      transactionId: "TXN123456789",
      status: "Successful",
    },
    {
      id: "PAY-002",
      product: "Farm Potatoes",
      farmer: "Selvam",
      quantity: "200 kg",
      amount: 4400,
      method: "Credit Card",
      date: "30 Aug 2026",
      time: "04:22 PM",
      transactionId: "TXN987654321",
      status: "Successful",
    },
  ];

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
              navigate("/bulk-requirements")
            }
          >
            <span className="bulk-nav-icon">
              ▤
            </span>

            <span>
              {t("myRequirements")}
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