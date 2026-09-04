import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import "../consumer.css";
import { upsertBuyer } from "../../../services/annamService";

function ConsumerLogin({ onLogin }) {
  const navigate = useNavigate();

  const { language, changeLanguage } = useLanguage();

  const [fullName, setFullName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  // Mobile verification states
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // Language change
  const handleLanguageChange = (newLanguage) => {
    changeLanguage(newLanguage);
  };

  // Language text for this login page
  const loginText = {
    english: {
      consumerPortal: "CONSUMER PORTAL",
      welcome: "Welcome to ANNAM",
      description:
        "Enter your details to start exploring fresh products from local farmers.",
      fullName: "Full Name",
      fullNamePlaceholder: "Enter your full name",
      mobileNumber: "Mobile Number",
      mobilePlaceholder: "10-digit mobile number",
      mobilePlaceholderOther: "Mobile number",
      verifyMobile: "Verify Mobile Number",
      verified: "✓ Mobile number verified",
      verificationCode: "Verification Code",
      verificationPlaceholder: "Enter 6-digit verification code",
      confirmVerification: "Confirm Verification Code",
      location: "Location",
      locationPlaceholder: "Enter your city or area",
      continue: "Continue to Marketplace →",
      footer:
        "By continuing, you agree to use ANNAM responsibly.",
      freshProducts: "Fresh farm products",
      directlyFarmers: "Directly from farmers",
      easyOrdering: "Easy ordering and delivery",
      brandTagline: "Farm to Market",
      brandHeading: "Fresh from the farm,",
      brandHeading2: "directly to you.",
      brandDescription:
        "Discover fresh agricultural products directly from farmers and support a better food ecosystem.",
      invalidIndian:
        "Invalid mobile number. Please enter a valid 10-digit Indian mobile number.",
      invalidMobile: "Please enter a valid mobile number.",
      enterMobile: "Please enter your mobile number first.",
      otpSent: "Verification code sent! Demo OTP: 123456",
      enterCode: "Please enter the verification code.",
      verifiedSuccess: "Mobile number verified successfully!",
      invalidCode: "Invalid verification code. Please try again.",
      enterName: "Please enter your name.",
      enterPhone: "Please enter your phone number.",
      verifyBeforeContinue:
        "Please verify your mobile number before continuing.",
    },

    tamil: {
      consumerPortal: "நுகர்வோர் போர்டல்",
      welcome: "ANNAM-க்கு வரவேற்கிறோம்",
      description:
        "உள்ளூர் விவசாயிகளிடமிருந்து புதிய பொருட்களைப் பெற உங்கள் விவரங்களை உள்ளிடுங்கள்.",
      fullName: "முழு பெயர்",
      fullNamePlaceholder: "உங்கள் முழு பெயரை உள்ளிடுங்கள்",
      mobileNumber: "மொபைல் எண்",
      mobilePlaceholder: "10 இலக்க மொபைல் எண்",
      mobilePlaceholderOther: "மொபைல் எண்",
      verifyMobile: "மொபைல் எண்ணை சரிபார்க்கவும்",
      verified: "✓ மொபைல் எண் சரிபார்க்கப்பட்டது",
      verificationCode: "சரிபார்ப்பு குறியீடு",
      verificationPlaceholder: "6 இலக்க சரிபார்ப்பு குறியீட்டை உள்ளிடுங்கள்",
      confirmVerification: "சரிபார்ப்பை உறுதிப்படுத்தவும்",
      location: "இருப்பிடம்",
      locationPlaceholder: "உங்கள் நகரம் அல்லது பகுதியை உள்ளிடுங்கள்",
      continue: "சந்தைக்குச் செல்லவும் →",
      footer:
        "தொடர்வதன் மூலம், ANNAM-ஐ பொறுப்புடன் பயன்படுத்த ஒப்புக்கொள்கிறீர்கள்.",
      freshProducts: "புதிய பண்ணை பொருட்கள்",
      directlyFarmers: "விவசாயிகளிடமிருந்து நேரடியாக",
      easyOrdering: "எளிய ஆர்டர் மற்றும் டெலிவரி",
      brandTagline: "பண்ணையிலிருந்து சந்தைக்கு",
      brandHeading: "பண்ணையிலிருந்து புதியது,",
      brandHeading2: "நேரடியாக உங்களிடம்.",
      brandDescription:
        "விவசாயிகளிடமிருந்து நேரடியாக புதிய விவசாயப் பொருட்களைப் பெற்று சிறந்த உணவு சூழலை ஆதரிக்கவும்.",
      invalidIndian:
        "தவறான மொபைல் எண். சரியான 10 இலக்க இந்திய மொபைல் எண்ணை உள்ளிடுங்கள்.",
      invalidMobile: "சரியான மொபைல் எண்ணை உள்ளிடுங்கள்.",
      enterMobile: "முதலில் உங்கள் மொபைல் எண்ணை உள்ளிடுங்கள்.",
      otpSent:
        "சரிபார்ப்பு குறியீடு அனுப்பப்பட்டது! Demo OTP: 123456",
      enterCode: "சரிபார்ப்பு குறியீட்டை உள்ளிடுங்கள்.",
      verifiedSuccess: "மொபைல் எண் வெற்றிகரமாக சரிபார்க்கப்பட்டது!",
      invalidCode:
        "தவறான சரிபார்ப்பு குறியீடு. மீண்டும் முயற்சிக்கவும்.",
      enterName: "உங்கள் பெயரை உள்ளிடுங்கள்.",
      enterPhone: "உங்கள் தொலைபேசி எண்ணை உள்ளிடுங்கள்.",
      verifyBeforeContinue:
        "தொடர்வதற்கு முன் உங்கள் மொபைல் எண்ணை சரிபார்க்கவும்.",
    },

    hindi: {
      consumerPortal: "उपभोक्ता पोर्टल",
      welcome: "ANNAM में आपका स्वागत है",
      description:
        "स्थानीय किसानों से ताज़ा उत्पाद प्राप्त करने के लिए अपना विवरण दर्ज करें।",
      fullName: "पूरा नाम",
      fullNamePlaceholder: "अपना पूरा नाम दर्ज करें",
      mobileNumber: "मोबाइल नंबर",
      mobilePlaceholder: "10 अंकों का मोबाइल नंबर",
      mobilePlaceholderOther: "मोबाइल नंबर",
      verifyMobile: "मोबाइल नंबर सत्यापित करें",
      verified: "✓ मोबाइल नंबर सत्यापित है",
      verificationCode: "सत्यापन कोड",
      verificationPlaceholder: "6 अंकों का सत्यापन कोड दर्ज करें",
      confirmVerification: "सत्यापन की पुष्टि करें",
      location: "स्थान",
      locationPlaceholder: "अपना शहर या क्षेत्र दर्ज करें",
      continue: "मार्केटप्लेस पर जाएं →",
      footer:
        "जारी रखकर, आप ANNAM का जिम्मेदारी से उपयोग करने के लिए सहमत हैं।",
      freshProducts: "ताज़ा खेत के उत्पाद",
      directlyFarmers: "किसानों से सीधे",
      easyOrdering: "आसान ऑर्डर और डिलीवरी",
      brandTagline: "खेत से बाज़ार तक",
      brandHeading: "खेत से ताज़ा,",
      brandHeading2: "सीधे आपके पास।",
      brandDescription:
        "किसानों से सीधे ताज़ा कृषि उत्पाद प्राप्त करें और बेहतर खाद्य व्यवस्था का समर्थन करें।",
      invalidIndian:
        "अमान्य मोबाइल नंबर। कृपया मान्य 10 अंकों का भारतीय मोबाइल नंबर दर्ज करें।",
      invalidMobile: "कृपया मान्य मोबाइल नंबर दर्ज करें।",
      enterMobile: "कृपया पहले अपना मोबाइल नंबर दर्ज करें।",
      otpSent:
        "सत्यापन कोड भेजा गया! Demo OTP: 123456",
      enterCode: "कृपया सत्यापन कोड दर्ज करें।",
      verifiedSuccess:
        "मोबाइल नंबर सफलतापूर्वक सत्यापित हो गया!",
      invalidCode:
        "अमान्य सत्यापन कोड। कृपया फिर से प्रयास करें।",
      enterName: "कृपया अपना नाम दर्ज करें।",
      enterPhone: "कृपया अपना फोन नंबर दर्ज करें।",
      verifyBeforeContinue:
        "जारी रखने से पहले कृपया अपना मोबाइल नंबर सत्यापित करें।",
    },
  };

  const text = loginText[language] || loginText.english;

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
      alert(text.enterMobile);
      return;
    }

    if (!validateIndianPhone()) {
      if (countryCode === "+91") {
        alert(text.invalidIndian);
      } else {
        alert(text.invalidMobile);
      }

      return;
    }

    setPhone(cleanedPhone);
    setOtpSent(true);
    setIsPhoneVerified(false);

    // DEMO OTP
    alert(text.otpSent);
  };

  // Verify OTP
  const handleVerifyOtp = () => {
    if (!otp.trim()) {
      alert(text.enterCode);
      return;
    }

    if (otp === "123456") {
      setIsPhoneVerified(true);
      alert(text.verifiedSuccess);
    } else {
      alert(text.invalidCode);
    }
  };

  // Submit form
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!fullName.trim()) {
      alert(text.enterName);
      return;
    }

    if (!phone.trim()) {
      alert(text.enterPhone);
      return;
    }

    if (!validateIndianPhone()) {
      alert(text.invalidMobile);
      return;
    }

    if (!isPhoneVerified) {
      alert(text.verifyBeforeContinue);
      return;
    }

    const buyer = {
      full_name: fullName.trim(),
      country_code: countryCode,
      phone: `${countryCode}${phone}`,
      mobile_number: phone,
      location: location.trim(),
      phone_verified: true,
      buyer_type: "consumer",
    };
    try {
      const savedBuyer = await upsertBuyer(buyer);
      onLogin({ ...buyer, ...savedBuyer });
      navigate("/marketplace");
    } catch (error) {
      alert(error.message || "Could not connect to ANNAM. Please try again.");
    }
  };

  return (
    <div className="login-page">

      {/* LANGUAGE SELECTOR */}
      <div
        style={{
          position: "absolute",
          top: "18px",
          right: "32px",
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: "4px 8px",
          borderRadius: "20px",
          background: "#e9eceb",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            marginRight: "3px",
          }}
        >
          🌐
        </span>

        <button
          type="button"
          onClick={() => handleLanguageChange("english")}
          style={{
            border: "none",
            background:
              language === "english" ? "#17634b" : "transparent",
            color:
              language === "english" ? "#ffffff" : "#064c3a",
            borderRadius: "14px",
            padding: "4px 9px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "12px",
          }}
        >
          English
        </button>

        <button
          type="button"
          onClick={() => handleLanguageChange("tamil")}
          style={{
            border: "none",
            background:
              language === "tamil" ? "#17634b" : "transparent",
            color:
              language === "tamil" ? "#ffffff" : "#064c3a",
            borderRadius: "14px",
            padding: "4px 9px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "12px",
          }}
        >
          தமிழ்
        </button>

        <button
          type="button"
          onClick={() => handleLanguageChange("hindi")}
          style={{
            border: "none",
            background:
              language === "hindi" ? "#17634b" : "transparent",
            color:
              language === "hindi" ? "#ffffff" : "#064c3a",
            borderRadius: "14px",
            padding: "4px 9px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "12px",
          }}
        >
          हिन्दी
        </button>
      </div>

      <div className="login-wrapper">

        {/* LEFT SIDE */}
        <div className="login-brand-section">
          <div className="login-brand-content">

            <div className="login-brand-logo">
              ANNAM
            </div>

            <p className="login-brand-tagline">
              {text.brandTagline}
            </p>

            <h1>
              {text.brandHeading}
              <br />
              {text.brandHeading2}
            </h1>

            <p className="login-brand-description">
              {text.brandDescription}
            </p>

            <div className="login-features">

              <div className="login-feature">
                <span>🌱</span>
                <p>{text.freshProducts}</p>
              </div>

              <div className="login-feature">
                <span>🚜</span>
                <p>{text.directlyFarmers}</p>
              </div>

              <div className="login-feature">
                <span>📦</span>
                <p>{text.easyOrdering}</p>
              </div>

            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="login-form-section">
          <div className="login-card">

            <div className="login-heading">

              <p className="login-kicker">
                {text.consumerPortal}
              </p>

              <h2>
                {text.welcome}
              </h2>

              <p>
                {text.description}
              </p>

            </div>

            <form onSubmit={handleSubmit}>

              {/* FULL NAME */}
              <div className="login-field">

                <label>
                  {text.fullName}
                </label>

                <input
                  type="text"
                  placeholder={text.fullNamePlaceholder}
                  value={fullName}
                  onChange={(event) =>
                    setFullName(event.target.value)
                  }
                />

              </div>

              {/* MOBILE NUMBER */}
              <div className="login-field">

                <label>
                  {text.mobileNumber}
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
                        ? text.mobilePlaceholder
                        : text.mobilePlaceholderOther
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
                    {text.verifyMobile}
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
                    {text.verified}
                  </div>
                )}

              </div>

              {/* OTP VERIFICATION */}
              {otpSent && !isPhoneVerified && (

                <div className="login-field">

                  <label>
                    {text.verificationCode}
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder={text.verificationPlaceholder}
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
                    {text.confirmVerification}
                  </button>

                </div>
              )}

              {/* LOCATION */}
              <div className="login-field">

                <label>
                  {text.location}
                </label>

                <input
                  type="text"
                  placeholder={text.locationPlaceholder}
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
                {text.continue}
              </button>

            </form>

            <p className="login-footer-text">
              {text.footer}
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default ConsumerLogin;
