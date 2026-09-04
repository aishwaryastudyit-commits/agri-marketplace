import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import "../bulkBuyer.css";
import { upsertBuyer } from "../../../services/annamService";

function BulkBuyerLogin({ onLogin }) {
  const navigate = useNavigate();

  // Language selector
  const { language, changeLanguage } = useLanguage();

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
     LANGUAGE TEXT
  ========================= */

  const text = {
    english: {
      bulkBuyerPortal: "BULK BUYER PORTAL",
      joinAnnam: "Join ANNAM",
      businessDescription:
        "Enter your business details to start sourcing directly from farmers.",

      bulkBuyerTagline: "Bulk Buyer Portal",
      heroTitle: "Buy directly from farmers,",
      heroTitle2: "in the quantity you need.",
      heroDescription:
        "Connect directly with farmers and source fresh agricultural products for your business.",

      directAccess: "Direct access to farmers",
      largeQuantity: "Large quantity procurement",
      logistics: "Logistics and delivery support",

      businessShopName: "Business / Shop Name",
      enterBusinessName: "Enter your business name",

      yourName: "Your Name",
      enterFullName: "Enter your full name",

      businessType: "Business Type",
      selectBusinessType: "Select business type",
      wholesaleMarket: "Wholesale Market",
      retailShop: "Retail Shop",
      supermarket: "Supermarket",

      mobileNumber: "Mobile Number",
      enterMobileNumber: "Enter mobile number",
      sendVerificationCode: "Send Verification Code",

      verificationCode: "Verification Code",
      enterVerificationCode:
        "Enter 6-digit verification code",
      confirmVerification:
        "Confirm Verification Code",

      businessLocation: "Business Location",
      enterCityArea: "Enter city or area",

      continue: "Continue to Bulk Marketplace →",

      footer:
        "Source directly. Buy smarter. Support farmers.",

      enterBusinessAlert:
        "Please enter your business name.",
      enterNameAlert: "Please enter your name.",
      enterMobileAlert:
        "Please enter your mobile number.",
      verifyMobileAlert:
        "Please verify your mobile number before continuing.",
      selectBusinessAlert:
        "Please select your business type.",
      enterLocationAlert:
        "Please enter your location.",

      validIndianMobile:
        "Please enter a valid Indian mobile number.",
      validMobile:
        "Please enter a valid mobile number.",
      mobileFirst:
        "Please enter your mobile number first.",
      verificationSent:
        "Verification code sent! Demo OTP: 123456",
      enterVerification:
        "Please enter the verification code.",
      mobileVerified:
        "Mobile number verified successfully!",
      invalidVerification:
        "Invalid verification code. Please try again.",
    },

    tamil: {
      bulkBuyerPortal: "மொத்த வாங்குபவர் போர்டல்",
      joinAnnam: "ANNAM-க்கு வரவேற்கிறோம்",
      businessDescription:
        "விவசாயிகளிடமிருந்து நேரடியாக வாங்க உங்கள் வணிக விவரங்களை உள்ளிடவும்.",

      bulkBuyerTagline: "மொத்த வாங்குபவர் போர்டல்",
      heroTitle: "விவசாயிகளிடமிருந்து நேரடியாக வாங்குங்கள்,",
      heroTitle2: "உங்களுக்கு தேவையான அளவில்.",
      heroDescription:
        "விவசாயிகளுடன் நேரடியாக இணைந்து உங்கள் வணிகத்திற்குத் தேவையான புதிய விவசாயப் பொருட்களைப் பெறுங்கள்.",

      directAccess: "விவசாயிகளுக்கு நேரடி அணுகல்",
      largeQuantity: "பெரிய அளவிலான கொள்முதல்",
      logistics: "போக்குவரத்து மற்றும் விநியோக ஆதரவு",

      businessShopName: "வணிகம் / கடை பெயர்",
      enterBusinessName: "உங்கள் வணிகப் பெயரை உள்ளிடவும்",

      yourName: "உங்கள் பெயர்",
      enterFullName: "உங்கள் முழுப் பெயரை உள்ளிடவும்",

      businessType: "வணிக வகை",
      selectBusinessType: "வணிக வகையைத் தேர்ந்தெடுக்கவும்",
      wholesaleMarket: "மொத்த சந்தை",
      retailShop: "சில்லறை கடை",
      supermarket: "சூப்பர் மார்க்கெட்",

      mobileNumber: "மொபைல் எண்",
      enterMobileNumber: "மொபைல் எண்ணை உள்ளிடவும்",
      sendVerificationCode: "சரிபார்ப்பு குறியீட்டை அனுப்பவும்",

      verificationCode: "சரிபார்ப்பு குறியீடு",
      enterVerificationCode:
        "6 இலக்க சரிபார்ப்பு குறியீட்டை உள்ளிடவும்",
      confirmVerification:
        "சரிபார்ப்பு குறியீட்டை உறுதிப்படுத்தவும்",

      businessLocation: "வணிக இருப்பிடம்",
      enterCityArea: "நகரம் அல்லது பகுதியை உள்ளிடவும்",

      continue: "மொத்த சந்தைக்கு தொடரவும் →",

      footer:
        "நேரடியாக வாங்குங்கள். புத்திசாலித்தனமாக வாங்குங்கள். விவசாயிகளை ஆதரிக்கவும்.",

      enterBusinessAlert:
        "உங்கள் வணிகப் பெயரை உள்ளிடவும்.",
      enterNameAlert: "உங்கள் பெயரை உள்ளிடவும்.",
      enterMobileAlert:
        "உங்கள் மொபைல் எண்ணை உள்ளிடவும்.",
      verifyMobileAlert:
        "தொடர்வதற்கு முன் உங்கள் மொபைல் எண்ணைச் சரிபார்க்கவும்.",
      selectBusinessAlert:
        "உங்கள் வணிக வகையைத் தேர்ந்தெடுக்கவும்.",
      enterLocationAlert:
        "உங்கள் இருப்பிடத்தை உள்ளிடவும்.",

      validIndianMobile:
        "சரியான இந்திய மொபைல் எண்ணை உள்ளிடவும்.",
      validMobile:
        "சரியான மொபைல் எண்ணை உள்ளிடவும்.",
      mobileFirst:
        "முதலில் உங்கள் மொபைல் எண்ணை உள்ளிடவும்.",
      verificationSent:
        "சரிபார்ப்பு குறியீடு அனுப்பப்பட்டது! டெமோ OTP: 123456",
      enterVerification:
        "சரிபார்ப்பு குறியீட்டை உள்ளிடவும்.",
      mobileVerified:
        "மொபைல் எண் வெற்றிகரமாக சரிபார்க்கப்பட்டது!",
      invalidVerification:
        "தவறான சரிபார்ப்பு குறியீடு. மீண்டும் முயற்சிக்கவும்.",
    },

    hindi: {
      bulkBuyerPortal: "थोक खरीदार पोर्टल",
      joinAnnam: "ANNAM में शामिल हों",
      businessDescription:
        "किसानों से सीधे खरीदारी शुरू करने के लिए अपने व्यवसाय का विवरण दर्ज करें।",

      bulkBuyerTagline: "थोक खरीदार पोर्टल",
      heroTitle: "किसानों से सीधे खरीदें,",
      heroTitle2: "अपनी आवश्यकता के अनुसार मात्रा में।",
      heroDescription:
        "किसानों से सीधे जुड़ें और अपने व्यवसाय के लिए ताज़ा कृषि उत्पाद प्राप्त करें।",

      directAccess: "किसानों तक सीधी पहुंच",
      largeQuantity: "बड़ी मात्रा में खरीदारी",
      logistics: "लॉजिस्टिक्स और डिलीवरी सहायता",

      businessShopName: "व्यवसाय / दुकान का नाम",
      enterBusinessName:
        "अपने व्यवसाय का नाम दर्ज करें",

      yourName: "आपका नाम",
      enterFullName: "अपना पूरा नाम दर्ज करें",

      businessType: "व्यवसाय का प्रकार",
      selectBusinessType:
        "व्यवसाय का प्रकार चुनें",
      wholesaleMarket: "थोक बाजार",
      retailShop: "रिटेल दुकान",
      supermarket: "सुपरमार्केट",

      mobileNumber: "मोबाइल नंबर",
      enterMobileNumber:
        "मोबाइल नंबर दर्ज करें",
      sendVerificationCode:
        "सत्यापन कोड भेजें",

      verificationCode: "सत्यापन कोड",
      enterVerificationCode:
        "6 अंकों का सत्यापन कोड दर्ज करें",
      confirmVerification:
        "सत्यापन कोड की पुष्टि करें",

      businessLocation: "व्यवसाय का स्थान",
      enterCityArea:
        "शहर या क्षेत्र दर्ज करें",

      continue: "थोक मार्केटप्लेस पर जारी रखें →",

      footer:
        "सीधे खरीदें। समझदारी से खरीदें। किसानों का समर्थन करें।",

      enterBusinessAlert:
        "कृपया अपने व्यवसाय का नाम दर्ज करें।",
      enterNameAlert:
        "कृपया अपना नाम दर्ज करें।",
      enterMobileAlert:
        "कृपया अपना मोबाइल नंबर दर्ज करें।",
      verifyMobileAlert:
        "जारी रखने से पहले अपना मोबाइल नंबर सत्यापित करें।",
      selectBusinessAlert:
        "कृपया अपने व्यवसाय का प्रकार चुनें।",
      enterLocationAlert:
        "कृपया अपना स्थान दर्ज करें।",

      validIndianMobile:
        "कृपया एक मान्य भारतीय मोबाइल नंबर दर्ज करें।",
      validMobile:
        "कृपया एक मान्य मोबाइल नंबर दर्ज करें।",
      mobileFirst:
        "कृपया पहले अपना मोबाइल नंबर दर्ज करें।",
      verificationSent:
        "सत्यापन कोड भेजा गया! डेमो OTP: 123456",
      enterVerification:
        "कृपया सत्यापन कोड दर्ज करें।",
      mobileVerified:
        "मोबाइल नंबर सफलतापूर्वक सत्यापित हो गया!",
      invalidVerification:
        "अमान्य सत्यापन कोड। कृपया पुनः प्रयास करें।",
    },
  };

  const currentText =
    text[language] || text.english;

  /* =========================
     PHONE NUMBER VALIDATION
  ========================= */

  const validatePhone = () => {
    // India validation
    if (countryCode === "+91") {
      const indianMobileRegex = /^[6-9]\d{9}$/;

      if (!indianMobileRegex.test(phone)) {
        alert(currentText.validIndianMobile);
        return false;
      }
    }

    // Basic validation for other countries
    if (countryCode !== "+91" && phone.length < 6) {
      alert(currentText.validMobile);
      return false;
    }

    return true;
  };

  /* =========================
     SEND OTP
  ========================= */

  const handleSendOtp = () => {
    if (!phone.trim()) {
      alert(currentText.mobileFirst);
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

    alert(currentText.verificationSent);
  };

  /* =========================
     VERIFY OTP
  ========================= */

  const handleVerifyOtp = () => {
    if (!otp.trim()) {
      alert(currentText.enterVerification);
      return;
    }

    if (otp === "123456") {
      setIsPhoneVerified(true);

      alert(currentText.mobileVerified);
    } else {
      alert(currentText.invalidVerification);
    }
  };

  /* =========================
     FORM SUBMIT
  ========================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!businessName.trim()) {
      alert(currentText.enterBusinessAlert);
      return;
    }

    if (!buyerName.trim()) {
      alert(currentText.enterNameAlert);
      return;
    }

    if (!phone.trim()) {
      alert(currentText.enterMobileAlert);
      return;
    }

    if (!isPhoneVerified) {
      alert(currentText.verifyMobileAlert);
      return;
    }

    if (!businessType) {
      alert(currentText.selectBusinessAlert);
      return;
    }

    if (!location.trim()) {
      alert(currentText.enterLocationAlert);
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

    try {
      const savedBuyer = await upsertBuyer(bulkBuyerData);
      onLogin({ ...bulkBuyerData, ...savedBuyer });
      navigate("/bulk-marketplace");
    } catch (error) {
      alert(error.message || "Could not connect to ANNAM. Please try again.");
    }
  };

  return (
    <div className="login-page">

      {/* =========================
          LANGUAGE SELECTOR
      ========================= */}

      <div
        style={{
          position: "absolute",
          top: "18px",
          right: "24px",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: "4px",
          background: "#e9eceb",
          borderRadius: "18px",
          padding: "3px 6px",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            padding: "4px 5px",
          }}
        >
          🌐
        </span>

        <button
          type="button"
          onClick={() =>
            changeLanguage("english")
          }
          style={{
            border: "none",
            borderRadius: "12px",
            padding: "5px 10px",
            cursor: "pointer",
            fontSize: "12px",
            background:
              language === "english"
                ? "#0d6248"
                : "transparent",
            color:
              language === "english"
                ? "white"
                : "#174936",
          }}
        >
          English
        </button>

        <button
          type="button"
          onClick={() =>
            changeLanguage("tamil")
          }
          style={{
            border: "none",
            borderRadius: "12px",
            padding: "5px 10px",
            cursor: "pointer",
            fontSize: "12px",
            background:
              language === "tamil"
                ? "#0d6248"
                : "transparent",
            color:
              language === "tamil"
                ? "white"
                : "#174936",
          }}
        >
          தமிழ்
        </button>

        <button
          type="button"
          onClick={() =>
            changeLanguage("hindi")
          }
          style={{
            border: "none",
            borderRadius: "12px",
            padding: "5px 10px",
            cursor: "pointer",
            fontSize: "12px",
            background:
              language === "hindi"
                ? "#0d6248"
                : "transparent",
            color:
              language === "hindi"
                ? "white"
                : "#174936",
          }}
        >
          हिन्दी
        </button>
      </div>


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
              {currentText.bulkBuyerTagline}
            </p>

            <h1>
              {currentText.heroTitle}
              <br />
              {currentText.heroTitle2}
            </h1>

            <p className="login-brand-description">
              {currentText.heroDescription}
            </p>

            <div className="login-features">

              <div className="login-feature">
                <span>🌾</span>

                <p>
                  {currentText.directAccess}
                </p>
              </div>

              <div className="login-feature">
                <span>📦</span>

                <p>
                  {currentText.largeQuantity}
                </p>
              </div>

              <div className="login-feature">
                <span>🚚</span>

                <p>
                  {currentText.logistics}
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
                {currentText.bulkBuyerPortal}
              </p>

              <h2>
                {currentText.joinAnnam}
              </h2>

              <p>
                {currentText.businessDescription}
              </p>

            </div>


            <form onSubmit={handleSubmit}>

              {/* =====================
                  BUSINESS NAME
              ===================== */}

              <div className="login-field">

                <label>
                  {currentText.businessShopName}
                </label>

                <input
                  type="text"
                  placeholder={
                    currentText.enterBusinessName
                  }
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
                  {currentText.yourName}
                </label>

                <input
                  type="text"
                  placeholder={
                    currentText.enterFullName
                  }
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
                  {currentText.businessType}
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
                    {currentText.selectBusinessType}
                  </option>

                  <option value="wholesale_market">
                    {currentText.wholesaleMarket}
                  </option>

                  <option value="retail_shop">
                    {currentText.retailShop}
                  </option>

                  <option value="supermarket">
                    {currentText.supermarket}
                  </option>

                </select>

              </div>


              {/* =====================
                  MOBILE NUMBER
              ===================== */}

              <div className="login-field">

                <label>
                  {currentText.mobileNumber}
                </label>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    width: "100%",
                  }}
                >

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
                    }}
                  >
                    <option value="+91">
                      +91 IN
                    </option>

                    <option value="+1">
                      +1 US
                    </option>

                    <option value="+44">
                      +44 UK
                    </option>

                    <option value="+61">
                      +61 AU
                    </option>

                    <option value="+971">
                      +971 UAE
                    </option>
                  </select>

                  <input
                    type="tel"
                    placeholder={
                      currentText.enterMobileNumber
                    }
                    value={phone}
                    disabled={isPhoneVerified}
                    onChange={(event) => {
                      const value =
                        event.target.value.replace(
                          /\D/g,
                          ""
                        );

                      setPhone(value);

                      setOtpSent(false);
                      setOtp("");
                      setIsPhoneVerified(false);
                    }}
                  />

                </div>


                {!isPhoneVerified && (
                  <button
                    type="button"
                    className="login-button"
                    onClick={handleSendOtp}
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    {currentText.sendVerificationCode}
                  </button>
                )}


                {isPhoneVerified && (
                  <p
                    style={{
                      marginTop: "8px",
                      color: "#0d6248",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    ✓ {currentText.mobileVerified}
                  </p>
                )}

              </div>


              {/* =====================
                  OTP VERIFICATION
              ===================== */}

              {otpSent && !isPhoneVerified && (

                <div className="login-field">

                  <label>
                    {currentText.verificationCode}
                  </label>

                  <input
                    type="text"
                    placeholder={
                      currentText.enterVerificationCode
                    }
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
                    {currentText.confirmVerification}
                  </button>

                </div>

              )}


              {/* =====================
                  BUSINESS LOCATION
              ===================== */}

              <div className="login-field">

                <label>
                  {currentText.businessLocation}
                </label>

                <input
                  type="text"
                  placeholder={
                    currentText.enterCityArea
                  }
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
                {currentText.continue}
              </button>

            </form>


            <p className="login-footer-text">
              {currentText.footer}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default BulkBuyerLogin;
