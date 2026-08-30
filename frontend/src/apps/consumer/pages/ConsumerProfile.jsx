import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext.jsx";
import "../consumer.css";

const languageOptions = [
  { value: "english", label: "English" },
  { value: "tamil", label: "தமிழ்" },
  { value: "hindi", label: "हिन्दी" },
  { value: "telugu", label: "తెలుగు" },
  { value: "malayalam", label: "മലയാളം" },
  { value: "kannada", label: "ಕನ್ನಡ" },
];

function ConsumerProfile({ buyer, onUpdateBuyer }) {
  const navigate = useNavigate();

  const { language, changeLanguage, t } = useLanguage();

  const [fullName, setFullName] = useState(
    buyer?.full_name || ""
  );

  const [phone, setPhone] = useState(
    buyer?.phone || ""
  );

  const [location, setLocation] = useState(
    buyer?.location || ""
  );

  const [email, setEmail] = useState(
    buyer?.email || ""
  );

  const [address, setAddress] = useState(
    buyer?.address || ""
  );

  const handleSave = (event) => {
    event.preventDefault();

    if (!fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    const updatedBuyer = {
      ...buyer,
      full_name: fullName.trim(),
      phone: phone.trim(),
      location: location.trim(),
      email: email.trim(),
      address: address.trim(),
      preferred_language: language,
      buyer_type: buyer?.buyer_type || "consumer",
    };

    onUpdateBuyer(updatedBuyer);

    alert("Profile updated successfully!");
  };

  const handleLanguageChange = (event) => {
    changeLanguage(event.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem("annam-buyer");

    navigate("/login", {
      replace: true,
    });

    window.location.reload();
  };

  return (
    <div className="consumer-app">
      <main
        className="consumer-main"
        style={{
          padding: "40px",
          minHeight: "100vh",
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
              navigate("/marketplace")
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

        <section
          className="marketplace-content"
          style={{
            width: "100%",
            maxWidth: "none",
            margin: "0",
          }}
        >
          {/* PROFILE HEADER */}

          <div
            className="product-card"
            style={{
              padding: "28px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div
              className="profile-avatar"
              style={{
                width: "70px",
                height: "70px",
                fontSize: "28px",
                flexShrink: 0,
              }}
            >
              {fullName?.charAt(0)?.toUpperCase() || "C"}
            </div>

            <div>
              <p className="section-kicker">
                ANNAM ACCOUNT
              </p>

              <h2
                style={{
                  marginBottom: "5px",
                }}
              >
                {fullName || t("consumer")}
              </h2>

              <p>
                {t("consumer")} {t("buyer")}
              </p>
            </div>
          </div>

          {/* PAGE TITLE */}

          <div className="section-header">
            <div>
              <p className="section-kicker">
                {t("profile")}
              </p>

              <h2>
                Complete Your Account
              </h2>

              <p>
                Manage your personal information,
                delivery details and preferences.
              </p>
            </div>
          </div>

          {/* PROFILE FORM */}

          <form
            className="product-card"
            onSubmit={handleSave}
            style={{
              padding: "30px",
            }}
          >
            <h3
              style={{
                marginBottom: "20px",
              }}
            >
              Personal Information
            </h3>

            <div className="login-field">
              <label>
                Full Name
              </label>

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
              <label>
                Phone Number
              </label>

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
              <label>
                Email Address
              </label>

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

            <h3
              style={{
                marginTop: "25px",
                marginBottom: "20px",
              }}
            >
              Delivery Details
            </h3>

            <div className="login-field">
              <label>
                Location
              </label>

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
              <label>
                Delivery Address
              </label>

              <textarea
                placeholder="Enter your complete delivery address"
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
                }}
              />
            </div>

            <br />

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

export default ConsumerProfile;