import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../bulkBuyer.css";

function BulkBuyerLogin({ onLogin }) {
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState("");
  const [buyerName, setBuyerName] = useState("");

  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");

  const [location, setLocation] = useState("");
  const [businessType, setBusinessType] = useState("");

  // Mobile verification states
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  /* =========================
     PHONE NUMBER VALIDATION
  ========================= */

  const validatePhone = () => {
    // India validation
    if (countryCode === "+91") {
      const indianMobileRegex = /^[6-9]\d{9}$/;

      if (!indianMobileRegex.test(phone)) {
        alert(
          "Please enter a valid Indian mobile number."
        );

        return false;
      }
    }

    // Basic validation for other countries
    if (countryCode !== "+91" && phone.length < 6) {
      alert(
        "Please enter a valid mobile number."
      );

      return false;
    }

    return true;
  };

  /* =========================
     SEND OTP
  ========================= */

  const handleSendOtp = () => {
    if (!phone.trim()) {
      alert(
        "Please enter your mobile number first."
      );

      return;
    }

    if (!validatePhone()) {
      return;
    }

    // Demo OTP for now
    // Later connect this to SMS API

    setOtpSent(true);
    setOtp("");
    setIsPhoneVerified(false);

    alert(
      "Verification code sent! Demo OTP: 123456"
    );
  };

  /* =========================
     VERIFY OTP
  ========================= */

  const handleVerifyOtp = () => {
    if (!otp.trim()) {
      alert(
        "Please enter the verification code."
      );

      return;
    }

    if (otp === "123456") {
      setIsPhoneVerified(true);

      alert(
        "Mobile number verified successfully!"
      );
    } else {
      alert(
        "Invalid verification code. Please try again."
      );
    }
  };

  /* =========================
     FORM SUBMIT
  ========================= */

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!businessName.trim()) {
      alert(
        "Please enter your business name."
      );

      return;
    }

    if (!buyerName.trim()) {
      alert(
        "Please enter your name."
      );

      return;
    }

    if (!phone.trim()) {
      alert(
        "Please enter your mobile number."
      );

      return;
    }

    if (!isPhoneVerified) {
      alert(
        "Please verify your mobile number before continuing."
      );

      return;
    }

    if (!businessType) {
      alert(
        "Please select your business type."
      );

      return;
    }

    if (!location.trim()) {
      alert(
        "Please enter your location."
      );

      return;
    }

    const bulkBuyerData = {
      business_name: businessName.trim(),

      full_name: buyerName.trim(),

      country_code: countryCode,

      phone: phone.trim(),

      full_phone_number:
        `${countryCode}${phone.trim()}`,

      phone_verified: true,

      location: location.trim(),

      business_type: businessType,

      buyer_type: "bulk_buyer",
    };

    onLogin(bulkBuyerData);

    navigate("/bulk-marketplace");
  };

  return (
    <div className="login-page">

      <div className="login-wrapper">

        {/* =========================
            LEFT SIDE
        ========================= */}

        <div className="login-brand-section">

          <div className="login-brand-content">

            <div className="login-brand-logo">
              ANNAM
            </div>

            <p className="login-brand-tagline">
              Bulk Buyer Portal
            </p>

            <h1>
              Buy directly from farmers,
              <br />
              in the quantity you need.
            </h1>

            <p className="login-brand-description">
              Connect directly with farmers and source
              fresh agricultural products for your business.
            </p>

            <div className="login-features">

              <div className="login-feature">
                <span>🌾</span>

                <p>
                  Direct access to farmers
                </p>
              </div>

              <div className="login-feature">
                <span>📦</span>

                <p>
                  Large quantity procurement
                </p>
              </div>

              <div className="login-feature">
                <span>🚚</span>

                <p>
                  Logistics and delivery support
                </p>
              </div>

            </div>

          </div>

        </div>


        {/* =========================
            RIGHT SIDE
        ========================= */}

        <div className="login-form-section">

          <div className="login-card">

            <div className="login-heading">

              <p className="login-kicker">
                BULK BUYER PORTAL
              </p>

              <h2>
                Join ANNAM
              </h2>

              <p>
                Enter your business details to start
                sourcing directly from farmers.
              </p>

            </div>


            <form onSubmit={handleSubmit}>

              {/* =====================
                  BUSINESS NAME
              ===================== */}

              <div className="login-field">

                <label>
                  Business / Shop Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your business name"
                  value={businessName}
                  onChange={(event) =>
                    setBusinessName(
                      event.target.value
                    )
                  }
                />

              </div>


              {/* =====================
                  BUYER NAME
              ===================== */}

              <div className="login-field">

                <label>
                  Your Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={buyerName}
                  onChange={(event) =>
                    setBuyerName(
                      event.target.value
                    )
                  }
                />

              </div>


              {/* =====================
                  BUSINESS TYPE
              ===================== */}

              <div className="login-field">

                <label>
                  Business Type
                </label>

                <select
                  value={businessType}
                  onChange={(event) =>
                    setBusinessType(
                      event.target.value
                    )
                  }
                >

                  <option value="">
                    Select business type
                  </option>

                  <option value="wholesale_market">
                    Wholesale Market
                  </option>

                  <option value="retail_shop">
                    Retail Shop
                  </option>

                  <option value="supermarket">
                    Supermarket
                  </option>

                  <option value="restaurant_hotel">
                    Restaurant / Hotel
                  </option>

                  <option value="food_processing">
                    Food Processing Business
                  </option>

                  <option value="other">
                    Other
                  </option>

                </select>

              </div>


              {/* =====================
                  MOBILE NUMBER
              ===================== */}

              <div className="login-field">

                <label>
                  Mobile Number
                </label>


                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >

                  {/* COUNTRY CODE */}

                  <select
                    value={countryCode}
                    disabled={isPhoneVerified}
                    onChange={(event) => {
                      setCountryCode(
                        event.target.value
                      );

                      setOtpSent(false);
                      setOtp("");
                      setIsPhoneVerified(false);
                    }}
                    style={{
                      width: "120px",
                      flexShrink: 0,
                    }}
                  >

                    <option value="+91">
                      +91 🇮🇳
                    </option>

                    <option value="+1">
                      +1 🇺🇸
                    </option>

                    <option value="+44">
                      +44 🇬🇧
                    </option>

                    <option value="+971">
                      +971 🇦🇪
                    </option>

                  </select>


                  {/* MOBILE NUMBER */}

                  <input
                    type="tel"
                    placeholder="Enter mobile number"
                    value={phone}
                    disabled={isPhoneVerified}
                    inputMode="numeric"
                    onChange={(event) => {
                      const value =
                        event.target.value.replace(
                          /\D/g,
                          ""
                        );

                      // India maximum 10 digits
                      if (
                        countryCode === "+91" &&
                        value.length > 10
                      ) {
                        return;
                      }

                      setPhone(value);

                      // Reset verification
                      setOtpSent(false);
                      setOtp("");
                      setIsPhoneVerified(false);
                    }}
                  />

                </div>


                {/* VERIFY BUTTON */}

                {!isPhoneVerified && (
                  <button
                    type="button"
                    className="login-button"
                    onClick={handleSendOtp}
                    style={{
                      marginTop: "12px",
                    }}
                  >
                    Verify Mobile Number
                  </button>
                )}


                {/* VERIFIED MESSAGE */}

                {isPhoneVerified && (
                  <p
                    style={{
                      marginTop: "10px",
                      color: "#2f7d32",
                      fontWeight: "600",
                    }}
                  >
                    ✓ Mobile number verified
                  </p>
                )}

              </div>


              {/* =====================
                  OTP VERIFICATION
              ===================== */}

              {otpSent && !isPhoneVerified && (

                <div className="login-field">

                  <label>
                    Verification Code
                  </label>

                  <input
                    type="text"
                    placeholder="Enter 6-digit verification code"
                    value={otp}
                    maxLength="6"
                    inputMode="numeric"
                    onChange={(event) => {
                      const value =
                        event.target.value.replace(
                          /\D/g,
                          ""
                        );

                      setOtp(value);
                    }}
                  />

                  <button
                    type="button"
                    className="login-button"
                    onClick={handleVerifyOtp}
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    Confirm Verification Code
                  </button>

                </div>

              )}


              {/* =====================
                  BUSINESS LOCATION
              ===================== */}

              <div className="login-field">

                <label>
                  Business Location
                </label>

                <input
                  type="text"
                  placeholder="Enter city or area"
                  value={location}
                  onChange={(event) =>
                    setLocation(
                      event.target.value
                    )
                  }
                />

              </div>


              {/* =====================
                  CONTINUE BUTTON
              ===================== */}

              <button
                type="submit"
                className="login-button"
              >
                Continue to Bulk Marketplace →
              </button>

            </form>


            <p className="login-footer-text">
              Source directly. Buy smarter. Support farmers.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default BulkBuyerLogin;