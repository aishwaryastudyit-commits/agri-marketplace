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

    /* BULK BUYER */

    bulkBuyer: "Bulk Buyer",
    bulkProcurement: "BULK PROCUREMENT",
    directProcurement: "Direct procurement from farmers",
    search: "Search",
    notifications: "Notifications",

    "Market place": "Market place",
    "My Requirements": "My Requirements",
    "Bulk Orders": "Bulk Orders",

    "BUY YOUR REQUIREMENTS IN ONE PLACE":
      "BUY YOUR REQUIREMENTS IN ONE PLACE",

    "Source Fresh Produce Directly from Farmers":
      "Source Fresh Produce Directly from Farmers",

    "Connect with farmers and source fresh agricultural produce in the quantities your business needs.":
      "Connect with farmers and source fresh agricultural produce in the quantities your business needs.",

    "Search Your Product":
      "Search Your Product",

    "Tell Us What You Need":
      "Tell Us What You Need",

    Product: "Product",
    "Product Example": "Example: Tomatoes",
    "Required Quantity": "Required Quantity",
    "Quantity Example": "Example: 500",
    Unit: "Unit",
    Kilograms: "Kilograms",
    tons: "Tons",
    bags: "Bags",
    units: "Units",

    "Delivery Location": "Delivery Location",
    "City Or Area": "City / Area",
    "Find Suppliers": "Find Suppliers",

    "SUPPLIER FOUND": "SUPPLIER FOUND",
    "Available Product": "Available Product",
    FARMER: "FARMER",
    "FARM LOCATION": "FARM LOCATION",
    AVAILABLE: "AVAILABLE",
    "YOUR REQUIREMENT": "YOUR REQUIREMENT",
    "Estimated Total": "Estimated Total",
    "Confirm Requirement": "Confirm Requirement",

    "REQUIREMENT CONFIRMED": "REQUIREMENT CONFIRMED",
    "Review Your Order": "Review Your Order",
    Farmer: "Farmer",
    Quantity: "Quantity",
    Price: "Price",
    "Total Amount": "Total Amount",
    "Change Requirement": "Change Requirement",
    "Make Payment": "Make Payment",

    bulkProduce: "BULK PRODUCE",
    "Explore Available Produce": "Explore Available Produce",

    "Available From Farmers": "Available From Farmers",
    "Fresh Produce Available Now":
      "Fresh Produce Available Now",

    product: "product",
    products: "products",
    found: "found",

    farmer: "Farmer",
    location: "Location",
    availableQuantity: "Available Quantity",
    requestQuantity: "Request Quantity",

    "noProductsFound": "No products found",
    "tryAnotherSearch": "Try another search",

    paymentHistory: "Payment History",

    enterProduct: "Please enter a product name.",
    enterQuantity: "Please enter the required quantity.",
    enterDeliveryLocation:
      "Please enter the delivery location.",

    noProductAvailable:
      "No",
    temporaryFarmerListings:
      "is currently available from our temporary farmer listings.",

    only: "Only",
    currentlyAvailable:
      "is currently available.",

    farmToMarket: "Farm to Market",

    /* EXTRA BULK LANGUAGE KEYS */

    "buyYourRequirements":
      "BUY YOUR REQUIREMENTS IN ONE PLACE",

    sourceDirectly:
      "Source Fresh Produce Directly from Farmers",

    bulkMarketplaceDescription:
      "Connect with farmers and source fresh agricultural produce in the quantities your business needs.",

    searchYourProduct:
      "Search Your Product",

    whatBusinessNeed:
      "Tell Us What You Need",

    productExample:
      "Example: Tomatoes",

    requiredQuantity:
      "Required Quantity",

    quantityExample:
      "Example: 500",

    unit:
      "Unit",

    kilograms:
      "Kilograms",

    deliveryLocation:
      "Delivery Location",

    cityOrArea:
      "City / Area",

    findSuppliers:
      "Find Suppliers",

    supplierFound:
      "SUPPLIER FOUND",

    availableProduct:
      "Available Product",

    farmer:
      "Farmer",

    farmLocation:
      "Farm Location",

    available:
      "Available",

    yourRequirement:
      "Your Requirement",

    estimatedTotal:
      "Estimated Total",

    confirmRequirement:
      "Confirm Requirement",

    requirementConfirmed:
      "REQUIREMENT CONFIRMED",

    reviewYourOrder:
      "Review Your Order",

    requirementConfirmedMessage:
      "Your requirement has been confirmed.",

    price:
      "Price",

    totalAmount:
      "Total Amount",

    changeRequirement:
      "Change Requirement",

    makePayment:
      "Make Payment",

    exploreAvailableProduce:
      "Explore Available Produce",

    availableFromFarmers:
      "Available From Farmers",

    freshProduceAvailable:
      "Fresh Produce Available Now",

    paymentGatewayMessage:
      "Payment gateway will open here.",
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
    searchPlaceholder:
      "பயிர்கள், விவசாயிகள், இடங்களை தேடுங்கள்...",
    profile: "சுயவிவரம்",
    preferredLanguage: "விருப்ப மொழி",
    saveProfile: "சுயவிவரத்தை சேமிக்கவும்",

    bulkBuyer: "மொத்த வாங்குபவர்",
    bulkProcurement: "மொத்த கொள்முதல்",
    directProcurement:
      "விவசாயிகளிடமிருந்து நேரடி கொள்முதல்",
    search: "தேடுக",
    notifications: "அறிவிப்புகள்",

    "Market place": "சந்தை",
    "My Requirements": "எனது தேவைகள்",
    "Bulk Orders": "மொத்த ஆர்டர்கள்",

    "BUY YOUR REQUIREMENTS IN ONE PLACE":
      "உங்கள் தேவைகளை ஒரே இடத்தில் வாங்குங்கள்",

    "Source Fresh Produce Directly from Farmers":
      "விவசாயிகளிடமிருந்து நேரடியாக புதிய விளைபொருட்களைப் பெறுங்கள்",

    "Connect with farmers and source fresh agricultural produce in the quantities your business needs.":
      "விவசாயிகளுடன் இணைந்து உங்கள் வணிகத்திற்குத் தேவையான அளவில் புதிய விவசாய விளைபொருட்களைப் பெறுங்கள்.",

    "Search Your Product":
      "உங்கள் பொருளைத் தேடுங்கள்",

    "Tell Us What You Need":
      "உங்களுக்கு என்ன தேவை என்று சொல்லுங்கள்",

    Product: "பொருள்",
    "Product Example": "உதாரணம்: தக்காளி",
    "Required Quantity": "தேவையான அளவு",
    "Quantity Example": "உதாரணம்: 500",
    Unit: "அலகு",
    Kilograms: "கிலோகிராம்",
    tons: "டன்",
    bags: "பைகள்",
    units: "அலகுகள்",

    "Delivery Location": "டெலிவரி இடம்",
    "City Or Area": "நகரம் / பகுதி",
    "Find Suppliers": "விற்பனையாளர்களைக் கண்டறியவும்",

    "SUPPLIER FOUND": "விற்பனையாளர் கிடைத்தார்",
    "Available Product": "கிடைக்கும் பொருள்",
    FARMER: "விவசாயி",
    "FARM LOCATION": "விவசாயி இருப்பிடம்",
    AVAILABLE: "கிடைக்கும் அளவு",
    "YOUR REQUIREMENT": "உங்கள் தேவை",
    "Estimated Total": "மதிப்பிடப்பட்ட மொத்தம்",
    "Confirm Requirement": "தேவையை உறுதிப்படுத்தவும்",

    "REQUIREMENT CONFIRMED": "தேவை உறுதிசெய்யப்பட்டது",
    "Review Your Order": "உங்கள் ஆர்டரை சரிபார்க்கவும்",
    Farmer: "விவசாயி",
    Quantity: "அளவு",
    Price: "விலை",
    "Total Amount": "மொத்த தொகை",
    "Change Requirement": "தேவையை மாற்றவும்",
    "Make Payment": "பணம் செலுத்தவும்",

    bulkProduce: "மொத்த விளைபொருட்கள்",
    "Explore Available Produce":
      "கிடைக்கும் விளைபொருட்களைப் பாருங்கள்",

    "Available From Farmers":
      "விவசாயிகளிடமிருந்து கிடைக்கும்",

    "Fresh Produce Available Now":
      "தற்போது கிடைக்கும் புதிய விளைபொருட்கள்",

    product: "பொருள்",
    products: "பொருட்கள்",
    found: "கிடைத்தது",

    farmer: "விவசாயி",
    location: "இடம்",
    availableQuantity: "கிடைக்கும் அளவு",
    requestQuantity: "அளவைக் கோருங்கள்",

    noProductsFound:
      "பொருட்கள் எதுவும் கிடைக்கவில்லை",
    tryAnotherSearch:
      "வேறு தேடலை முயற்சிக்கவும்",

    paymentHistory: "பணம் செலுத்திய வரலாறு",

    enterProduct:
      "பொருளின் பெயரை உள்ளிடவும்.",
    enterQuantity:
      "தேவையான அளவை உள்ளிடவும்.",
    enterDeliveryLocation:
      "டெலிவரி இடத்தை உள்ளிடவும்.",

    noProductAvailable:
      "தற்போது",
    temporaryFarmerListings:
      "எங்கள் தற்காலிக விவசாயி பட்டியலில் கிடைக்கவில்லை.",

    only: "மட்டுமே",
    currentlyAvailable:
      "தற்போது கிடைக்கிறது.",

    farmToMarket:
      "விவசாயத்திலிருந்து சந்தைக்கு",

    paymentGatewayMessage:
      "பணம் செலுத்தும் பக்கம் இங்கே திறக்கப்படும்.",
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
    searchPlaceholder:
      "फसलें, किसान, स्थान खोजें...",
    profile: "प्रोफ़ाइल",
    preferredLanguage: "पसंदीदा भाषा",
    saveProfile: "प्रोफ़ाइल सहेजें",

    bulkBuyer: "थोक खरीदार",
    bulkProcurement: "थोक खरीद",
    directProcurement:
      "किसानों से सीधी खरीद",
    search: "खोजें",
    notifications: "सूचनाएं",

    "Market place": "मार्केटप्लेस",
    "My Requirements": "मेरी आवश्यकताएं",
    "Bulk Orders": "थोक ऑर्डर",

    "BUY YOUR REQUIREMENTS IN ONE PLACE":
      "अपनी आवश्यकताएं एक ही जगह खरीदें",

    "Source Fresh Produce Directly from Farmers":
      "किसानों से सीधे ताजा कृषि उत्पाद प्राप्त करें",

    "Connect with farmers and source fresh agricultural produce in the quantities your business needs.":
      "किसानों से जुड़ें और अपने व्यवसाय के लिए आवश्यक मात्रा में ताजा कृषि उत्पाद प्राप्त करें।",

    "Search Your Product":
      "अपना उत्पाद खोजें",

    "Tell Us What You Need":
      "हमें बताएं आपको क्या चाहिए",

    Product: "उत्पाद",
    "Product Example": "उदाहरण: टमाटर",
    "Required Quantity": "आवश्यक मात्रा",
    "Quantity Example": "उदाहरण: 500",
    Unit: "इकाई",
    Kilograms: "किलोग्राम",
    tons: "टन",
    bags: "बैग",
    units: "इकाइयां",

    "Delivery Location": "डिलीवरी स्थान",
    "City Or Area": "शहर / क्षेत्र",
    "Find Suppliers": "आपूर्तिकर्ता खोजें",

    "SUPPLIER FOUND": "आपूर्तिकर्ता मिला",
    "Available Product": "उपलब्ध उत्पाद",
    FARMER: "किसान",
    "FARM LOCATION": "किसान का स्थान",
    AVAILABLE: "उपलब्ध",
    "YOUR REQUIREMENT": "आपकी आवश्यकता",
    "Estimated Total": "अनुमानित कुल",
    "Confirm Requirement": "आवश्यकता की पुष्टि करें",

    "REQUIREMENT CONFIRMED":
      "आवश्यकता की पुष्टि हो गई",
    "Review Your Order": "अपने ऑर्डर की समीक्षा करें",
    Farmer: "किसान",
    Quantity: "मात्रा",
    Price: "कीमत",
    "Total Amount": "कुल राशि",
    "Change Requirement": "आवश्यकता बदलें",
    "Make Payment": "भुगतान करें",

    bulkProduce: "थोक उत्पाद",
    "Explore Available Produce":
      "उपलब्ध उत्पाद देखें",

    "Available From Farmers":
      "किसानों से उपलब्ध",

    "Fresh Produce Available Now":
      "अभी उपलब्ध ताजा उत्पाद",

    product: "उत्पाद",
    products: "उत्पाद",
    found: "मिले",

    farmer: "किसान",
    location: "स्थान",
    availableQuantity: "उपलब्ध मात्रा",
    requestQuantity: "मात्रा का अनुरोध करें",

    noProductsFound:
      "कोई उत्पाद नहीं मिला",
    tryAnotherSearch:
      "कोई और खोज आज़माएं",

    paymentHistory: "भुगतान इतिहास",

    enterProduct:
      "कृपया उत्पाद का नाम दर्ज करें।",
    enterQuantity:
      "कृपया आवश्यक मात्रा दर्ज करें।",
    enterDeliveryLocation:
      "कृपया डिलीवरी स्थान दर्ज करें।",

    noProductAvailable:
      "कोई",
    temporaryFarmerListings:
      "हमारी अस्थायी किसान सूची में वर्तमान में उपलब्ध नहीं है।",

    only: "केवल",
    currentlyAvailable:
      "वर्तमान में उपलब्ध है।",

    farmToMarket:
      "खेत से बाजार तक",

    paymentGatewayMessage:
      "भुगतान पृष्ठ यहां खुलेगा।",
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
    searchPlaceholder:
      "పంటలు, రైతులు, ప్రదేశాలను వెతకండి...",
    profile: "ప్రొఫైల్",
    preferredLanguage: "ఇష్టమైన భాష",
    saveProfile: "ప్రొఫైల్ సేవ్ చేయండి",

    bulkBuyer: "బల్క్ కొనుగోలుదారు",
    bulkProcurement: "బల్క్ కొనుగోలు",
    directProcurement:
      "రైతుల నుండి నేరుగా కొనుగోలు",
    search: "వెతకండి",
    notifications: "నోటిఫికేషన్లు",

    "Market place": "మార్కెట్",
    "My Requirements": "నా అవసరాలు",
    "Bulk Orders": "బల్క్ ఆర్డర్లు",

    "BUY YOUR REQUIREMENTS IN ONE PLACE":
      "మీ అవసరాలను ఒకే చోట కొనండి",

    "Source Fresh Produce Directly from Farmers":
      "రైతుల నుండి నేరుగా తాజా వ్యవసాయ ఉత్పత్తులను పొందండి",

    "Connect with farmers and source fresh agricultural produce in the quantities your business needs.":
      "రైతులతో అనుసంధానమై మీ వ్యాపారానికి అవసరమైన పరిమాణంలో తాజా వ్యవసాయ ఉత్పత్తులను పొందండి.",

    "Search Your Product":
      "మీ ఉత్పత్తిని వెతకండి",

    "Tell Us What You Need":
      "మీకు ఏమి కావాలో చెప్పండి",

    Product: "ఉత్పత్తి",
    "Product Example": "ఉదాహరణ: టమాటాలు",
    "Required Quantity": "అవసరమైన పరిమాణం",
    "Quantity Example": "ఉదాహరణ: 500",
    Unit: "యూనిట్",
    Kilograms: "కిలోగ్రాములు",
    tons: "టన్నులు",
    bags: "సంచులు",
    units: "యూనిట్లు",

    "Delivery Location": "డెలివరీ స్థలం",
    "City Or Area": "నగరం / ప్రాంతం",
    "Find Suppliers": "సరఫరాదారులను కనుగొనండి",

    "SUPPLIER FOUND": "సరఫరాదారు కనుగొనబడింది",
    "Available Product": "అందుబాటులో ఉన్న ఉత్పత్తి",
    FARMER: "రైతు",
    "FARM LOCATION": "వ్యవసాయ స్థలం",
    AVAILABLE: "అందుబాటులో ఉంది",
    "YOUR REQUIREMENT": "మీ అవసరం",
    "Estimated Total": "అంచనా మొత్తం",
    "Confirm Requirement": "అవసరాన్ని నిర్ధారించండి",

    "REQUIREMENT CONFIRMED":
      "అవసరం నిర్ధారించబడింది",
    "Review Your Order": "మీ ఆర్డర్‌ను సమీక్షించండి",
    Farmer: "రైతు",
    Quantity: "పరిమాణం",
    Price: "ధర",
    "Total Amount": "మొత్తం మొత్తం",
    "Change Requirement": "అవసరాన్ని మార్చండి",
    "Make Payment": "చెల్లింపు చేయండి",

    bulkProduce: "బల్క్ ఉత్పత్తులు",
    "Explore Available Produce":
      "అందుబాటులో ఉన్న ఉత్పత్తులను చూడండి",

    "Available From Farmers":
      "రైతుల నుండి అందుబాటులో ఉన్నాయి",

    "Fresh Produce Available Now":
      "ఇప్పుడు అందుబాటులో ఉన్న తాజా ఉత్పత్తులు",

    product: "ఉత్పత్తి",
    products: "ఉత్పత్తులు",
    found: "కనుగొనబడ్డాయి",

    farmer: "రైతు",
    location: "స్థలం",
    availableQuantity: "అందుబాటులో ఉన్న పరిమాణం",
    requestQuantity: "పరిమాణాన్ని అభ్యర్థించండి",

    noProductsFound:
      "ఉత్పత్తులు ఏవీ కనుగొనబడలేదు",
    tryAnotherSearch:
      "మరొక శోధనను ప్రయత్నించండి",

    paymentHistory: "చెల్లింపు చరిత్ర",

    enterProduct:
      "దయచేసి ఉత్పత్తి పేరును నమోదు చేయండి.",
    enterQuantity:
      "దయచేసి అవసరమైన పరిమాణాన్ని నమోదు చేయండి.",
    enterDeliveryLocation:
      "దయచేసి డెలివరీ స్థలాన్ని నమోదు చేయండి.",

    noProductAvailable:
      "ఏ",
    temporaryFarmerListings:
      "మా తాత్కాలిక రైతు జాబితాలో ప్రస్తుతం అందుబాటులో లేదు.",

    only: "కేవలం",
    currentlyAvailable:
      "ప్రస్తుతం అందుబాటులో ఉంది.",

    farmToMarket:
      "వ్యవసాయం నుండి మార్కెట్ వరకు",

    paymentGatewayMessage:
      "చెల్లింపు పేజీ ఇక్కడ తెరవబడుతుంది.",
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
    searchPlaceholder:
      "വിളകൾ, കർഷകർ, സ്ഥലങ്ങൾ തിരയുക...",
    profile: "പ്രൊഫൈൽ",
    preferredLanguage: "ഇഷ്ട ഭാഷ",
    saveProfile: "പ്രൊഫൈൽ സേവ് ചെയ്യുക",

    bulkBuyer: "ബൾക്ക് വാങ്ങുന്നയാൾ",
    bulkProcurement: "ബൾക്ക് സംഭരണം",
    directProcurement:
      "കർഷകരിൽ നിന്ന് നേരിട്ടുള്ള സംഭരണം",
    search: "തിരയുക",
    notifications: "അറിയിപ്പുകൾ",

    "Market place": "മാർക്കറ്റ്",
    "My Requirements": "എന്റെ ആവശ്യങ്ങൾ",
    "Bulk Orders": "ബൾക്ക് ഓർഡറുകൾ",

    "BUY YOUR REQUIREMENTS IN ONE PLACE":
      "നിങ്ങളുടെ ആവശ്യങ്ങൾ ഒരിടത്ത് വാങ്ങുക",

    "Source Fresh Produce Directly from Farmers":
      "കർഷകരിൽ നിന്ന് നേരിട്ട് പുതിയ കാർഷിക ഉൽപ്പന്നങ്ങൾ നേടുക",

    "Connect with farmers and source fresh agricultural produce in the quantities your business needs.":
      "കർഷകരുമായി ബന്ധപ്പെട്ടു നിങ്ങളുടെ ബിസിനസിന് ആവശ്യമായ അളവിൽ പുതിയ കാർഷിക ഉൽപ്പന്നങ്ങൾ നേടുക.",

    "Search Your Product":
      "നിങ്ങളുടെ ഉൽപ്പന്നം തിരയുക",

    "Tell Us What You Need":
      "നിങ്ങൾക്ക് എന്താണ് വേണ്ടതെന്ന് പറയുക",

    Product: "ഉൽപ്പന്നം",
    "Product Example": "ഉദാഹരണം: തക്കാളി",
    "Required Quantity": "ആവശ്യമായ അളവ്",
    "Quantity Example": "ഉദാഹരണം: 500",
    Unit: "യൂണിറ്റ്",
    Kilograms: "കിലോഗ്രാം",
    tons: "ടൺ",
    bags: "ബാഗുകൾ",
    units: "യൂണിറ്റുകൾ",

    "Delivery Location": "ഡെലിവറി സ്ഥലം",
    "City Or Area": "നഗരം / പ്രദേശം",
    "Find Suppliers": "വിതരണക്കാരെ കണ്ടെത്തുക",

    "SUPPLIER FOUND": "വിതരണക്കാരനെ കണ്ടെത്തി",
    "Available Product": "ലഭ്യമായ ഉൽപ്പന്നം",
    FARMER: "കർഷകൻ",
    "FARM LOCATION": "ഫാം സ്ഥലം",
    AVAILABLE: "ലഭ്യമാണ്",
    "YOUR REQUIREMENT": "നിങ്ങളുടെ ആവശ്യം",
    "Estimated Total": "കണക്കാക്കിയ ആകെ തുക",
    "Confirm Requirement": "ആവശ്യം സ്ഥിരീകരിക്കുക",

    "REQUIREMENT CONFIRMED": "ആവശ്യം സ്ഥിരീകരിച്ചു",
    "Review Your Order": "നിങ്ങളുടെ ഓർഡർ പരിശോധിക്കുക",
    Farmer: "കർഷകൻ",
    Quantity: "അളവ്",
    Price: "വില",
    "Total Amount": "ആകെ തുക",
    "Change Requirement": "ആവശ്യം മാറ്റുക",
    "Make Payment": "പണമടയ്ക്കുക",

    bulkProduce: "ബൾക്ക് ഉൽപ്പന്നങ്ങൾ",
    "Explore Available Produce":
      "ലഭ്യമായ ഉൽപ്പന്നങ്ങൾ പരിശോധിക്കുക",

    "Available From Farmers":
      "കർഷകരിൽ നിന്ന് ലഭ്യമാണ്",

    "Fresh Produce Available Now":
      "ഇപ്പോൾ ലഭ്യമായ പുതിയ ഉൽപ്പന്നങ്ങൾ",

    product: "ഉൽപ്പന്നം",
    products: "ഉൽപ്പന്നങ്ങൾ",
    found: "ലഭിച്ചു",

    farmer: "കർഷകൻ",
    location: "സ്ഥലം",
    availableQuantity: "ലഭ്യമായ അളവ്",
    requestQuantity: "അളവ് അഭ്യർത്ഥിക്കുക",

    noProductsFound:
      "ഉൽപ്പന്നങ്ങളൊന്നും കണ്ടെത്തിയില്ല",
    tryAnotherSearch:
      "മറ്റൊരു തിരച്ചിൽ ശ്രമിക്കുക",

    paymentHistory: "പണമടച്ച ചരിത്രം",

    enterProduct:
      "ദയവായി ഉൽപ്പന്നത്തിന്റെ പേര് നൽകുക.",
    enterQuantity:
      "ദയവായി ആവശ്യമായ അളവ് നൽകുക.",
    enterDeliveryLocation:
      "ദയവായി ഡെലിവറി സ്ഥലം നൽകുക.",

    noProductAvailable:
      "ഒരു",
    temporaryFarmerListings:
      "ഞങ്ങളുടെ താൽക്കാലിക കർഷക പട്ടികയിൽ നിലവിൽ ലഭ്യമല്ല.",

    only: "മാത്രം",
    currentlyAvailable:
      "നിലവിൽ ലഭ്യമാണ്.",

    farmToMarket:
      "കൃഷിയിടത്തിൽ നിന്ന് വിപണിയിലേക്ക്",

    paymentGatewayMessage:
      "പണമടയ്ക്കൽ പേജ് ഇവിടെ തുറക്കും.",
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
    searchPlaceholder:
      "ಬೆಳೆಗಳು, ರೈತರು, ಸ್ಥಳಗಳನ್ನು ಹುಡುಕಿ...",
    profile: "ಪ್ರೊಫೈಲ್",
    preferredLanguage: "ಆದ್ಯತೆಯ ಭಾಷೆ",
    saveProfile: "ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ",

    bulkBuyer: "ಬಲ್ಕ್ ಖರೀದಿದಾರ",
    bulkProcurement: "ಬಲ್ಕ್ ಖರೀದಿ",
    directProcurement:
      "ರೈತರಿಂದ ನೇರ ಖರೀದಿ",
    search: "ಹುಡುಕಿ",
    notifications: "ಅಧಿಸೂಚನೆಗಳು",

    "Market place": "ಮಾರುಕಟ್ಟೆ",
    "My Requirements": "ನನ್ನ ಅಗತ್ಯಗಳು",
    "Bulk Orders": "ಬಲ್ಕ್ ಆರ್ಡರ್‌ಗಳು",

    "BUY YOUR REQUIREMENTS IN ONE PLACE":
      "ನಿಮ್ಮ ಅಗತ್ಯಗಳನ್ನು ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ ಖರೀದಿಸಿ",

    "Source Fresh Produce Directly from Farmers":
      "ರೈತರಿಂದ ನೇರವಾಗಿ ತಾಜಾ ಕೃಷಿ ಉತ್ಪನ್ನಗಳನ್ನು ಪಡೆಯಿರಿ",

    "Connect with farmers and source fresh agricultural produce in the quantities your business needs.":
      "ರೈತರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಿ ನಿಮ್ಮ ವ್ಯವಹಾರಕ್ಕೆ ಅಗತ್ಯವಿರುವ ಪ್ರಮಾಣದಲ್ಲಿ ತಾಜಾ ಕೃಷಿ ಉತ್ಪನ್ನಗಳನ್ನು ಪಡೆಯಿರಿ.",

    "Search Your Product":
      "ನಿಮ್ಮ ಉತ್ಪನ್ನವನ್ನು ಹುಡುಕಿ",

    "Tell Us What You Need":
      "ನಿಮಗೆ ಏನು ಬೇಕು ಎಂದು ನಮಗೆ ತಿಳಿಸಿ",

    Product: "ಉತ್ಪನ್ನ",
    "Product Example": "ಉದಾಹರಣೆ: ಟೊಮ್ಯಾಟೊ",
    "Required Quantity": "ಅಗತ್ಯವಿರುವ ಪ್ರಮಾಣ",
    "Quantity Example": "ಉದಾಹರಣೆ: 500",
    Unit: "ಘಟಕ",
    Kilograms: "ಕಿಲೋಗ್ರಾಂ",
    tons: "ಟನ್",
    bags: "ಚೀಲಗಳು",
    units: "ಘಟಕಗಳು",

    "Delivery Location": "ವಿತರಣಾ ಸ್ಥಳ",
    "City Or Area": "ನಗರ / ಪ್ರದೇಶ",
    "Find Suppliers": "ಪೂರೈಕೆದಾರರನ್ನು ಹುಡುಕಿ",

    "SUPPLIER FOUND": "ಪೂರೈಕೆದಾರರು ಕಂಡುಬಂದಿದ್ದಾರೆ",
    "Available Product": "ಲಭ್ಯವಿರುವ ಉತ್ಪನ್ನ",
    FARMER: "ರೈತ",
    "FARM LOCATION": "ಫಾರ್ಮ್ ಸ್ಥಳ",
    AVAILABLE: "ಲಭ್ಯವಿದೆ",
    "YOUR REQUIREMENT": "ನಿಮ್ಮ ಅಗತ್ಯ",
    "Estimated Total": "ಅಂದಾಜು ಒಟ್ಟು",
    "Confirm Requirement": "ಅಗತ್ಯವನ್ನು ದೃಢೀಕರಿಸಿ",

    "REQUIREMENT CONFIRMED":
      "ಅಗತ್ಯವನ್ನು ದೃಢೀಕರಿಸಲಾಗಿದೆ",
    "Review Your Order": "ನಿಮ್ಮ ಆರ್ಡರ್ ಪರಿಶೀಲಿಸಿ",
    Farmer: "ರೈತ",
    Quantity: "ಪ್ರಮಾಣ",
    Price: "ಬೆಲೆ",
    "Total Amount": "ಒಟ್ಟು ಮೊತ್ತ",
    "Change Requirement": "ಅಗತ್ಯವನ್ನು ಬದಲಾಯಿಸಿ",
    "Make Payment": "ಪಾವತಿ ಮಾಡಿ",

    bulkProduce: "ಬಲ್ಕ್ ಉತ್ಪನ್ನಗಳು",
    "Explore Available Produce":
      "ಲಭ್ಯವಿರುವ ಉತ್ಪನ್ನಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",

    "Available From Farmers":
      "ರೈತರಿಂದ ಲಭ್ಯವಿದೆ",

    "Fresh Produce Available Now":
      "ಈಗ ಲಭ್ಯವಿರುವ ತಾಜಾ ಉತ್ಪನ್ನಗಳು",

    product: "ಉತ್ಪನ್ನ",
    products: "ಉತ್ಪನ್ನಗಳು",
    found: "ಕಂಡುಬಂದಿವೆ",

    farmer: "ರೈತ",
    location: "ಸ್ಥಳ",
    availableQuantity: "ಲಭ್ಯವಿರುವ ಪ್ರಮಾಣ",
    requestQuantity: "ಪ್ರಮಾಣವನ್ನು ವಿನಂತಿಸಿ",

    noProductsFound:
      "ಯಾವುದೇ ಉತ್ಪನ್ನಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
    tryAnotherSearch:
      "ಮತ್ತೊಂದು ಹುಡುಕಾಟ ಪ್ರಯತ್ನಿಸಿ",

    paymentHistory: "ಪಾವತಿ ಇತಿಹಾಸ",

    enterProduct:
      "ದಯವಿಟ್ಟು ಉತ್ಪನ್ನದ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.",
    enterQuantity:
      "ದಯವಿಟ್ಟು ಅಗತ್ಯವಿರುವ ಪ್ರಮಾಣವನ್ನು ನಮೂದಿಸಿ.",
    enterDeliveryLocation:
      "ದಯವಿಟ್ಟು ವಿತರಣಾ ಸ್ಥಳವನ್ನು ನಮೂದಿಸಿ.",

    noProductAvailable:
      "ಯಾವುದೇ",
    temporaryFarmerListings:
      "ನಮ್ಮ ತಾತ್ಕಾಲಿಕ ರೈತ ಪಟ್ಟಿಯಲ್ಲಿ ಪ್ರಸ್ತುತ ಲಭ್ಯವಿಲ್ಲ.",

    only: "ಮಾತ್ರ",
    currentlyAvailable:
      "ಪ್ರಸ್ತುತ ಲಭ್ಯವಿದೆ.",

    farmToMarket:
      "ಕೃಷಿಯಿಂದ ಮಾರುಕಟ್ಟೆಗೆ",

    paymentGatewayMessage:
      "ಪಾವತಿ ಪುಟ ಇಲ್ಲಿ ತೆರೆಯುತ್ತದೆ.",
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
    return (
      translations[language]?.[key] ||
      translations.english[key] ||
      key
    );
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