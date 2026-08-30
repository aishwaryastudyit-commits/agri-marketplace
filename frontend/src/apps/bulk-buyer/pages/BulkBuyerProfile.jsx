import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext.jsx";
import "../bulkBuyer.css";

const languageOptions = [
  { value: "english", label: "English" },
  { value: "tamil", label: "தமிழ்" },
  { value: "hindi", label: "हिन्दी" },
  { value: "telugu", label: "తెలుగు" },
  { value: "malayalam", label: "മലയാളം" },
  { value: "kannada", label: "ಕನ್ನಡ" },
];

function BulkBuyerProfile({
  bulkBuyer,
  onUpdateBulkBuyer,
}) {
  const navigate = useNavigate();

  const {
    language,
    changeLanguage,
    t,
  } = useLanguage();

  const [fullName, setFullName] = useState(
    bulkBuyer?.full_name || ""
  );

  const [phone, setPhone] = useState(
    bulkBuyer?.phone || ""
  );

  const [email, setEmail] = useState(
    bulkBuyer?.email || ""
  );

  const [businessName, setBusinessName] = useState(
    bulkBuyer?.business_name || ""
  );

  const [location, setLocation] = useState(
    bulkBuyer?.location || ""
  );

  const [address, setAddress] = useState(
    bulkBuyer?.address || ""
  );

  const handleSave = (event) => {
    event.preventDefault();

    if (!fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    const updatedBulkBuyer = {
      ...bulkBuyer,

      full_name: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      business_name: businessName.trim(),
      location: location.trim(),
      address: address.trim(),

      preferred_language: language,

      buyer_type: "bulk_buyer",
    };

    onUpdateBulkBuyer(updatedBulkBuyer);

    alert("Profile updated successfully!");
  };

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;

    // Changes the language immediately throughout
    // all components using useLanguage()
    changeLanguage(selectedLanguage);
  };

  const handleLogout = () => {
    localStorage.removeItem("annam-bulk-buyer");

    navigate("/bulk-login", {
      replace: true,
    });

    window.location.reload();
  };

  return (
    <div
      className="bulk-app"
      style={{
        width: "100%",
        minWidth: "100%",
      }}
    >
      <main
        className="bulk-main"
        style={{
          width: "100%",
          maxWidth: "none",
          minWidth: "100%",
          padding: "40px",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        {/* TOP BUTTONS */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "30px",
          }}
        >
          <button
            type="button"
            className="view-all-button"
            onClick={() =>
              navigate("/bulk-marketplace")
            }
          >
            ← Back to Marketplace
          </button>

          <button
            type="button"
            className="view-all-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* PROFILE CONTENT */}

        <section
          className="bulk-marketplace-content"
          style={{
            width: "100%",
            maxWidth: "none",
            minWidth: "100%",
            margin: "0",
            boxSizing: "border-box",
          }}
        >
          {/* PROFILE HEADER */}

          <div
            className="bulk-product-card"
            style={{
              padding: "12px 28px",
              marginBottom: "24px",
              minHeight: "160px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {/* AVATAR */}

            <div
              className="bulk-profile-avatar"
              style={{
                width: "70px",
                height: "70px",
                fontSize: "28px",
                margin: "0 auto 8px auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {fullName?.charAt(0)?.toUpperCase() || "B"}
            </div>

            {/* PROFILE TEXT */}

            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <p
                className="section-kicker"
                style={{
                  margin: "0 0 6px 0",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                ANNAM BUSINESS ACCOUNT
              </p>

              <h2
                style={{
                  margin: "0 0 5px 0",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                {businessName || fullName || "Bulk Buyer"}
              </h2>

              <p
                style={{
                  margin: "0",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                Bulk Buyer
              </p>
            </div>
          </div>

          {/* PAGE HEADER */}

          <div className="section-header">
            <div>
              <p className="section-kicker">
                {t("profile")}
              </p>

              <h2>Business Profile</h2>

              <p>
                Manage your business information,
                procurement details and preferences.
              </p>
            </div>
          </div>

          {/* PROFILE FORM */}

          <form
            className="bulk-product-card"
            onSubmit={handleSave}
            style={{
              padding: "30px",
            }}
          >
            {/* CONTACT INFORMATION */}

            <h3
              style={{
                marginBottom: "20px",
              }}
            >
              Contact Information
            </h3>

            <div className="login-field">
              <label>Full Name</label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(event) =>
                  setFullName(event.target.value)
                }
              />
            </div>

            <br />

            <div className="login-field">
              <label>Phone Number</label>

              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
              />
            </div>

            <br />

            <div className="login-field">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
              />
            </div>

            <br />

            {/* BUSINESS INFORMATION */}

            <h3
              style={{
                marginTop: "25px",
                marginBottom: "20px",
              }}
            >
              Business Information
            </h3>

            <div className="login-field">
              <label>
                Business / Company Name
              </label>

              <input
                type="text"
                placeholder="Enter your business name"
                value={businessName}
                onChange={(event) =>
                  setBusinessName(event.target.value)
                }
              />
            </div>

            <br />

            {/* DELIVERY DETAILS */}

            <h3
              style={{
                marginTop: "25px",
                marginBottom: "20px",
              }}
            >
              Delivery Details
            </h3>

            <div className="login-field">
              <label>Location</label>

              <input
                type="text"
                placeholder="City / Area"
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
              />
            </div>

            <br />

            <div className="login-field">
              <label>Delivery Address</label>

              <textarea
                placeholder="Enter your complete business delivery address"
                value={address}
                onChange={(event) =>
                  setAddress(event.target.value)
                }
                style={{
                  width: "100%",
                  minHeight: "110px",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                  fontFamily: "inherit",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <br />

            {/* LANGUAGE */}

            <h3
              style={{
                marginTop: "25px",
                marginBottom: "20px",
              }}
            >
              Preferences
            </h3>

            <div className="login-field">
              <label>
                🌐 {t("preferredLanguage")}
              </label>

              <select
                className="sort-select"
                style={{
                  width: "100%",
                }}
                value={language}
                onChange={handleLanguageChange}
              >
                {languageOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>

              <p
                style={{
                  fontSize: "13px",
                  marginTop: "8px",
                  opacity: "0.7",
                }}
              >
                Choose the language you prefer
                to use in ANNAM.
              </p>
            </div>

            <br />

            {/* SAVE */}

            <button
              type="submit"
              className="login-button"
              style={{
                width: "100%",
              }}
            >
              {t("saveProfile")} Changes
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default BulkBuyerProfile;