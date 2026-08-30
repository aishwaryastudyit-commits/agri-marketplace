import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../consumer.css";

function ConsumerLogin({ onLogin }) {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  // Mobile verification states
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // Allow only numbers and maximum 10 digits
  const handlePhoneChange = (event) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 10);

    setPhone(value);
    setOtpSent(false);
    setOtp("");
    setIsPhoneVerified(false);
  };

  // Validate Indian phone number
  const validateIndianPhone = () => {
    const indianPhonePattern = /^[6-9]\d{9}$/;

    if (countryCode === "+91") {
      return indianPhonePattern.test(phone);
    }

    return phone.length >= 6;
  };

  // Send OTP
  const handleSendOtp = () => {
    const cleanedPhone = phone.replace(/\D/g, "");

    if (!cleanedPhone) {
      alert("Please enter your mobile number first.");
      return;
    }

    if (!validateIndianPhone()) {
      if (countryCode === "+91") {
        alert(
          "Invalid mobile number. Please enter a valid 10-digit Indian mobile number."
        );
      } else {
        alert("Please enter a valid mobile number.");
      }

      return;
    }

    setPhone(cleanedPhone);
    setOtpSent(true);
    setIsPhoneVerified(false);

    // DEMO OTP
    alert("Verification code sent! Demo OTP: 123456");
  };

  // Verify OTP
  const handleVerifyOtp = () => {
    if (!otp.trim()) {
      alert("Please enter the verification code.");
      return;
    }

    if (otp === "123456") {
      setIsPhoneVerified(true);
      alert("Mobile number verified successfully!");
    } else {
      alert("Invalid verification code. Please try again.");
    }
  };

  // Submit form
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!fullName.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!phone.trim()) {
      alert("Please enter your phone number.");
      return;
    }

    if (!validateIndianPhone()) {
      alert("Please enter a valid mobile number.");
      return;
    }

    if (!isPhoneVerified) {
      alert("Please verify your mobile number before continuing.");
      return;
    }

    onLogin({
      full_name: fullName.trim(),
      country_code: countryCode,
      phone: `${countryCode}${phone}`,
      mobile_number: phone,
      location: location.trim(),
      phone_verified: true,
      buyer_type: "consumer",
    });

    navigate("/marketplace");
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">

        {/* LEFT SIDE */}
        <div className="login-brand-section">
          <div className="login-brand-content">

            <div className="login-brand-logo">
              ANNAM
            </div>

            <p className="login-brand-tagline">
              Farm to Market
            </p>

            <h1>
              Fresh from the farm,
              <br />
              directly to you.
            </h1>

            <p className="login-brand-description">
              Discover fresh agricultural products directly
              from farmers and support a better food ecosystem.
            </p>

            <div className="login-features">

              <div className="login-feature">
                <span>🌱</span>
                <p>Fresh farm products</p>
              </div>

              <div className="login-feature">
                <span>🚜</span>
                <p>Directly from farmers</p>
              </div>

              <div className="login-feature">
                <span>📦</span>
                <p>Easy ordering and delivery</p>
              </div>

            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="login-form-section">
          <div className="login-card">

            <div className="login-heading">

              <p className="login-kicker">
                CONSUMER PORTAL
              </p>

              <h2>
                Welcome to ANNAM
              </h2>

              <p>
                Enter your details to start exploring
                fresh products from local farmers.
              </p>

            </div>

            <form onSubmit={handleSubmit}>

              {/* FULL NAME */}
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

              {/* MOBILE NUMBER */}
              <div className="login-field">

                <label>
                  Mobile Number
                </label>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    width: "100%",
                  }}
                >

                  {/* COUNTRY CODE */}
                  <select
                    value={countryCode}
                    disabled={isPhoneVerified}
                    onChange={(event) => {
                      setCountryCode(event.target.value);
                      setOtpSent(false);
                      setOtp("");
                      setIsPhoneVerified(false);
                    }}
                    style={{
                      width: "100px",
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

                  {/* PHONE NUMBER */}
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder={
                      countryCode === "+91"
                        ? "10-digit mobile number"
                        : "Mobile number"
                    }
                    value={phone}
                    disabled={isPhoneVerified}
                    onChange={handlePhoneChange}
                    style={{
                      flex: 1,
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

                {/* VERIFIED */}
                {isPhoneVerified && (
                  <div
                    style={{
                      marginTop: "12px",
                      color: "#2f7d32",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    ✓ Mobile number verified
                  </div>
                )}

              </div>

              {/* OTP VERIFICATION */}
              {otpSent && !isPhoneVerified && (

                <div className="login-field">

                  <label>
                    Verification Code
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter 6-digit verification code"
                    value={otp}
                    maxLength="6"
                    onChange={(event) =>
                      setOtp(
                        event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6)
                      )
                    }
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

              {/* LOCATION */}
              <div className="login-field">

                <label>
                  Location
                </label>

                <input
                  type="text"
                  placeholder="Enter your city or area"
                  value={location}
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                />

              </div>

              {/* CONTINUE */}
              <button
                type="submit"
                className="login-button"
              >
                Continue to Marketplace →
              </button>

            </form>

            <p className="login-footer-text">
              By continuing, you agree to use ANNAM
              responsibly.
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default ConsumerLogin;