import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

const translations = {
  english: {
    browseByCategory: "Browse by category",
    featuredProducts: "Featured products",
    allProducts: "All Products",
    vegetables: "Vegetables",
    fruits: "Fruits",
    grains: "Grains",
    leafyGreens: "Leafy Greens",
    viewAll: "View all →",
    marketplace: "Marketplace",
    myOrders: "My Orders",
    trackDelivery: "Track Delivery",
    consumer: "Consumer",
    buyer: "Buyer",
    cart: "Cart",
    searchPlaceholder: "Search crops, farmers, locations...",
    profile: "Profile",
    preferredLanguage: "Preferred Language",
    saveProfile: "Save Profile",
  },

  tamil: {
    browseByCategory: "வகைகளின்படி உலாவுக",
    featuredProducts: "சிறப்பு பொருட்கள்",
    allProducts: "அனைத்து பொருட்கள்",
    vegetables: "காய்கறிகள்",
    fruits: "பழங்கள்",
    grains: "தானியங்கள்",
    leafyGreens: "இலை காய்கறிகள்",
    viewAll: "அனைத்தையும் காண்க →",
    marketplace: "சந்தை",
    myOrders: "எனது ஆர்டர்கள்",
    trackDelivery: "டெலிவரியை கண்காணிக்கவும்",
    consumer: "நுகர்வோர்",
    buyer: "வாங்குபவர்",
    cart: "வண்டி",
    searchPlaceholder: "பயிர்கள், விவசாயிகள், இடங்களை தேடுங்கள்...",
    profile: "சுயவிவரம்",
    preferredLanguage: "விருப்ப மொழி",
    saveProfile: "சுயவிவரத்தை சேமிக்கவும்",
  },

  hindi: {
    browseByCategory: "श्रेणी के अनुसार ब्राउज़ करें",
    featuredProducts: "विशेष उत्पाद",
    allProducts: "सभी उत्पाद",
    vegetables: "सब्जियां",
    fruits: "फल",
    grains: "अनाज",
    leafyGreens: "पत्तेदार सब्जियां",
    viewAll: "सभी देखें →",
    marketplace: "मार्केटप्लेस",
    myOrders: "मेरे ऑर्डर",
    trackDelivery: "डिलीवरी ट्रैक करें",
    consumer: "उपभोक्ता",
    buyer: "खरीदार",
    cart: "कार्ट",
    searchPlaceholder: "फसलें, किसान, स्थान खोजें...",
    profile: "प्रोफ़ाइल",
    preferredLanguage: "पसंदीदा भाषा",
    saveProfile: "प्रोफ़ाइल सहेजें",
  },

  telugu: {
    browseByCategory: "వర్గాల ప్రకారం చూడండి",
    featuredProducts: "ప్రత్యేక ఉత్పత్తులు",
    allProducts: "అన్ని ఉత్పత్తులు",
    vegetables: "కూరగాయలు",
    fruits: "పండ్లు",
    grains: "ధాన్యాలు",
    leafyGreens: "ఆకుకూరలు",
    viewAll: "అన్నీ చూడండి →",
    marketplace: "మార్కెట్",
    myOrders: "నా ఆర్డర్లు",
    trackDelivery: "డెలివరీని ట్రాక్ చేయండి",
    consumer: "వినియోగదారు",
    buyer: "కొనుగోలుదారు",
    cart: "కార్ట్",
    searchPlaceholder: "పంటలు, రైతులు, ప్రదేశాలను వెతకండి...",
    profile: "ప్రొఫైల్",
    preferredLanguage: "ఇష్టమైన భాష",
    saveProfile: "ప్రొఫైల్ సేవ్ చేయండి",
  },

  malayalam: {
    browseByCategory: "വിഭാഗങ്ങൾ പ്രകാരം കാണുക",
    featuredProducts: "തിരഞ്ഞെടുത്ത ഉൽപ്പന്നങ്ങൾ",
    allProducts: "എല്ലാ ഉൽപ്പന്നങ്ങളും",
    vegetables: "പച്ചക്കറികൾ",
    fruits: "പഴങ്ങൾ",
    grains: "ധാന്യങ്ങൾ",
    leafyGreens: "ഇലക്കറികൾ",
    viewAll: "എല്ലാം കാണുക →",
    marketplace: "മാർക്കറ്റ്",
    myOrders: "എന്റെ ഓർഡറുകൾ",
    trackDelivery: "ഡെലിവറി ട്രാക്ക് ചെയ്യുക",
    consumer: "ഉപഭോക്താവ്",
    buyer: "വാങ്ങുന്നയാൾ",
    cart: "കാർട്ട്",
    searchPlaceholder: "വിളകൾ, കർഷകർ, സ്ഥലങ്ങൾ തിരയുക...",
    profile: "പ്രൊഫൈൽ",
    preferredLanguage: "ഇഷ്ട ഭാഷ",
    saveProfile: "പ്രൊഫൈൽ സേവ് ചെയ്യുക",
  },

  kannada: {
    browseByCategory: "ವರ್ಗಗಳ ಮೂಲಕ ವೀಕ್ಷಿಸಿ",
    featuredProducts: "ವೈಶಿಷ್ಟ್ಯಗೊಳಿಸಿದ ಉತ್ಪನ್ನಗಳು",
    allProducts: "ಎಲ್ಲಾ ಉತ್ಪನ್ನಗಳು",
    vegetables: "ತರಕಾರಿಗಳು",
    fruits: "ಹಣ್ಣುಗಳು",
    grains: "ಧಾನ್ಯಗಳು",
    leafyGreens: "ಸೊಪ್ಪುಗಳು",
    viewAll: "ಎಲ್ಲವನ್ನೂ ನೋಡಿ →",
    marketplace: "ಮಾರುಕಟ್ಟೆ",
    myOrders: "ನನ್ನ ಆದೇಶಗಳು",
    trackDelivery: "ವಿತರಣೆಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    consumer: "ಗ್ರಾಹಕ",
    buyer: "ಖರೀದಿದಾರ",
    cart: "ಕಾರ್ಟ್",
    searchPlaceholder: "ಬೆಳೆಗಳು, ರೈತರು, ಸ್ಥಳಗಳನ್ನು ಹುಡುಕಿ...",
    profile: "ಪ್ರೊಫೈಲ್",
    preferredLanguage: "ಆದ್ಯತೆಯ ಭಾಷೆ",
    saveProfile: "ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ",
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    localStorage.getItem("annam-language") || "english"
  );

  const changeLanguage = (newLanguage) => {
    localStorage.setItem("annam-language", newLanguage);
    setLanguage(newLanguage);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations.english[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}