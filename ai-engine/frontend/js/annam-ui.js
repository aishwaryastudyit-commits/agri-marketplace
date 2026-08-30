/**
 * ANNAM Agri-Marketplace — Master UI Controller
 * Manages view switching, interactive simulators, Chart rendering, role switching & toasts.
 */

import * as API from "./api.js";

// State
let currentRole = "Administrator";
let currentUserName = "Aishwarya";
let activeChartInstance = null;
let marketChartInstance = null;
let currentLanguage = "English";

const i18nCatalog = {
  English: {
    navForecast: "Demand Forecast",
    navPooling: "Smart Supply Pooling",
    navCore: "Core",
    navMarket: "Market Insights",
    navRecommendations: "Recommendations",
    systemSection: "System",
    navDocs: "Swagger API Docs",
    searchPlaceholder: "Search crops, farmers, mandis, or orders...",
    statusLive: "AI Engine Live",
    notifications: "Notifications",
    notif1: "Forecast updated for Chennai",
    notif2: "3 farmer matches need review",
    notif3: "Market price alert: Tomato +4.2%",
    messages: "Messages",
    msg1: "Aishwarya: Forecast summary ready",
    msg2: "Karthik: Bulk order confirmation",
    msg3: "Ravi: Crop advisory shared",
    language: "Language",
    pageTitleForecast: "Demand Forecasting & Trends 📈",
    pageSubtitleForecast: "AI predicts expected regional demand (kg) over the next 7–30 days to optimize farmer harvest timing.",
    refreshForecast: "Refresh Forecast",
    produceLabel: "Produce",
    locationLabel: "Location / Mandi",
    horizonLabel: "Horizon",
    horizon7: "Next 7 Days",
    horizon14: "Next 14 Days",
    horizon30: "Next 30 Days",
    searchReady: "Search ready",
    searchFor: "Searching for: {query}",
    languageSet: "Language set to {lang}",
  },
  Hindi: {
    navForecast: "मांग पूर्वानुमान",
    navPooling: "स्मार्ट सप्लाई पूलिंग",
    navCore: "मुख्य",
    navMarket: "मार्केट इनसाइट्स",
    navRecommendations: "सिफारिशें",
    systemSection: "सिस्टम",
    navDocs: "स्वैगर API दस्तावेज़",
    searchPlaceholder: "फसल, किसान, मंडी या ऑर्डर खोजें...",
    statusLive: "एआई इंजन लाइव",
    notifications: "सूचनाएँ",
    notif1: "चेन्नई के लिए फोरकास्ट अपडेट हुआ",
    notif2: "3 किसान मैच की समीक्षा आवश्यक है",
    notif3: "मार्केट प्राइस अलर्ट: टमाटर +4.2%",
    messages: "संदेश",
    msg1: "आश्वय्या: फोरकास्ट सारांश तैयार है",
    msg2: "कार्तिक: बल्क ऑर्डर पुष्टिकरण",
    msg3: "रवि: फसल सलाह साझा की गई",
    language: "भाषा",
    pageTitleForecast: "मांग पूर्वानुमान और रुझान 📈",
    pageSubtitleForecast: "एआई अगले 7–30 दिनों में क्षेत्रीय मांग का अनुमान लगाता है ताकि किसान कटाई का समय बेहतर बना सकें।",
    refreshForecast: "फोरकास्ट रिफ्रेश करें",
    produceLabel: "उत्पाद",
    locationLabel: "स्थान / मंडी",
    horizonLabel: "होराइज़न",
    horizon7: "अगले 7 दिन",
    horizon14: "अगले 14 दिन",
    horizon30: "अगले 30 दिन",
    searchReady: "खोज तैयार है",
    searchFor: "खोजा जा रहा है: {query}",
    languageSet: "भाषा बदलकर {lang} कर दी गई",
  },
  Tamil: {
    navForecast: "தேவை முன்னறிவு",
    navPooling: "ஸ்மார்ட் விநியோகக் குழுமம்",
    navCore: "முக்கியம்",
    navMarket: "மார்க்கெட் நுண்ணறிவுகள்",
    navRecommendations: "பரிந்துரைகள்",
    systemSection: "சிஸ்டம்",
    navDocs: "ஸ்வாகர் API ஆவணங்கள்",
    searchPlaceholder: "பயிர்கள், விவசாயிகள், மண்டிகள் அல்லது ஆர்டர்கள் தேடுங்கள்...",
    statusLive: "AI இயந்திரம் நேரடி",
    notifications: "அறிவிப்புகள்",
    notif1: "சென்னைக்கு முன்னறிவு புதுப்பிக்கப்பட்டது",
    notif2: "3 விவசாயி பொருத்தங்கள் மதிப்பாய்வு செய்யப்பட வேண்டும்",
    notif3: "மார்க்கெட் விலை எச்சரிக்கை: தக்காளி +4.2%",
    messages: "செய்திகள்",
    msg1: "ஆசிரியா: முன்னறிவு சுருக்கம் தயார்",
    msg2: "கார்த்திக்: பெரிய ஆர்டர் உறுதிப்படுத்தல்",
    msg3: "ரவி: பயிர் ஆலோசனைப் பகிரப்பட்டது",
    language: "மொழி",
    pageTitleForecast: "தேவை முன்னறிவு மற்றும் போக்குகள் 📈",
    pageSubtitleForecast: "அடுத்த 7–30 நாட்களில் பிராந்திய தேவை குறித்து AI முன்னறிவு அளிக்கிறது, விவசாயிகள் அறுவடையை சரியாக திட்டமிட உதவுகிறது.",
    refreshForecast: "முன்னறிவை புதுப்பி",
    produceLabel: "பயிர்",
    locationLabel: "இடம் / மண்டி",
    horizonLabel: "காலம்",
    horizon7: "அடுத்த 7 நாட்கள்",
    horizon14: "அடுத்த 14 நாட்கள்",
    horizon30: "அடுத்த 30 நாட்கள்",
    searchReady: "தேடல் தயார்",
    searchFor: "தேடப்படுகிறது: {query}",
    languageSet: "மொழி {lang} ஆக மாற்றப்பட்டது",
  },
  Telugu: {
    navForecast: "డిమాండ్ ఫోర్కాస్ట్",
    navPooling: "స్మార్ట్ సప్లై పూలింగ్",
    navCore: "కార్యం",
    navMarket: "మార్కెట్ ఇన్సైట్ల",
    navRecommendations: "సిఫార్సులు",
    systemSection: "సిస్టం",
    navDocs: "స్వాగర్ API డాక్స్",
    searchPlaceholder: "పంటలు, రైతులు, మండి లేదా ఆర్డర్లను వెతకండి...",
    statusLive: "AI ఇంజన్ लाइव",
    notifications: "నోటిఫికేషన్లు",
    notif1: "చెన్నై జోడించిన ఫోర్కాస్ట్ నవీకరించబడింది",
    notif2: "3 రైతు మ్యాచ్‌లను సమీక్ష చేయాలి",
    notif3: "మార్కెట్ ధర అలర్ట్: టమోట +4.2%",
    messages: "సందేశాలు",
    msg1: "అశ్వర్య: ఫోర్కాస్ట్ సారాంశం సిద్ధంగా ఉంది",
    msg2: "కార్తీక్: భారీ ఆర్డర్ నిర్ధారణ",
    msg3: "రవి: పంట సలహా పంపబడింది",
    language: "భాష",
    pageTitleForecast: "డిమాండ్ ఫోర్కాస్ట్ మరియు ట్రెండ్స్ 📈",
    pageSubtitleForecast: "తరువాత 7–30 రోజులలో ప్రాంతీయ డిమాండ్ గురించి AI అంచనాలు సూచిస్తుంది, రైతుల విరామాన్ని సమర్థవంతంగా నిర్వహించడంలో సహాయపడుతుంది.",
    refreshForecast: "ఫోర్కాస్ట్ రిఫ్రెష్",
    produceLabel: "పంట",
    locationLabel: "స్థానం / మండి",
    horizonLabel: "హోరిజోన్",
    horizon7: "అవ próximas 7 రోజులు",
    horizon14: "అవ próximas 14 రోజులు",
    horizon30: "అవ próximas 30 రోజులు",
    searchReady: "వెతకడం సిద్దంగా ఉంది",
    searchFor: "వెతుకుతున్నాం: {query}",
    languageSet: "భాష {lang} కు మార్చబడింది",
  },
  Bengali: {
    navForecast: "চাহিদা পূর্বাভাস",
    navPooling: "স্মার্ট সাপ্লাই পুলিং",
    navCore: "কোর",
    navMarket: "মার্কেট ইনসাইটস",
    navRecommendations: "প্রস্তাবনা",
    systemSection: "সিস্টেম",
    navDocs: "স্বাগার API ডকুমেন্টেশন",
    searchPlaceholder: "ফসল, কৃষক, মন্ডি বা অর্ডার খুঁজুন...",
    statusLive: "AI ইঞ্জিন লাইভ",
    notifications: "নোটিফিকেশন",
    notif1: "চেন্নাইয়ের জন্য পূর্বাভাস আপডেট হয়েছে",
    notif2: "৩ জন কৃষক ম্যাচ পর্যালোচনা প্রয়োজন",
    notif3: "মার্কেট দাম সতর্কতা: টমেটো +4.2%",
    messages: "বার্তা",
    msg1: "আশ্বয়ারী: পূর্বাভাস সারাংশ প্রস্তুত",
    msg2: "কার্তিক: বাল্ক অর্ডার নিশ্চিতকরণ",
    msg3: "রবি: ফসল উপদেশ শেয়ার হয়েছে",
    language: "ভাষা",
    pageTitleForecast: "চাহিদা পূর্বাভাস ও প্রবণতা 📈",
    pageSubtitleForecast: "AI পরবর্তী 7–30 দিনে এলাকার চাহিদা পূর্বাভাস করে কৃষকদের ফসল কাটার সময় যথাযথভাবে নির্ধারণে সহায়তা করে।",
    refreshForecast: "পূর্বাভাস রিফ্রেশ",
    produceLabel: "ফসল",
    locationLabel: "স্থান / মন্ডি",
    horizonLabel: "হরাইজন",
    horizon7: "পরের 7 দিন",
    horizon14: "পরের 14 দিন",
    horizon30: "পরের 30 দিন",
    searchReady: "খোঁজ প্রস্তুত",
    searchFor: "খোঁজা হচ্ছে: {query}",
    languageSet: "ভাষা {lang} এ সেট করা হয়েছে",
  },
  Kannada: {
    navForecast: "ಬೇಡಿಕೆಯ ಮುನ್ಸೂಚನೆ",
    navPooling: "ಸ್ಮಾರ್ಟ್ ಸಪ್ಲೈ ಪೂಲಿಂಗ್",
    navCore: "ಕೋರ್",
    navMarket: "ಮಾರುಕಟ್ಟೆ ಅನ್ವೇಷಣೆ",
    navRecommendations: "ಶಿಫಾರಸುಗಳು",
    systemSection: "ಸಿಸ್ಟಮ್",
    navDocs: "ಸ್ವಾಗರ್ API ಡಾಕ್ಸ್",
    searchPlaceholder: "ಬೆಳೆ, ರೈತ, ಮಂಡಿ ಅಥವಾ ಆರ್ಡರ್ ಹುಡುಕಿರಿ...",
    statusLive: "AI ಇಂಜಿನ್ ಲೈವ್",
    notifications: "ನೋಟಿಫಿಕೇಶನ್ಗಳು",
    notif1: "ಚೆನ್ನೈಗೆ ಮುನ್ಸೂಚನೆ ನವೀಕರಿಸಲಾಗಿದೆ",
    notif2: "3 ರೈತ ಮ್ಯಾಚ್ಗಳಿಗೆ ಪರಿಶೀಲನೆ ಅಗತ್ಯ",
    notif3: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಎಚ್ಚರಿಕೆ: ಟೊಮ್ಯಾಟೋ +4.2%",
    messages: "ಸಂದೇಶಗಳು",
    msg1: "ಅಶ್ವರಿ: ಮುನ್ಸೂಚನೆ ಸಾರಾಂಶ ಸಿದ್ಧ",
    msg2: "ಕಾರ್ತಿಕ್: ಬಲ್ಕ್ ಆರ್ಡರ್ ದೃಢೀಕರಣ",
    msg3: "ರವಿ: ಬೆಳೆ ಸಲಹೆ ಹಂಚಿಕೊಳ್ಳಲಾಗಿದೆ",
    language: "ಭಾಷೆ",
    pageTitleForecast: "ಬೇಡಿಕೆಯ ಮುನ್ಸೂಚನೆ ಮತ್ತು ಪ್ರವೃತ್ತಿಗಳು 📈",
    pageSubtitleForecast: "ಮುಂದಿನ 7–30 ದಿನಗಳಲ್ಲಿ ಪ್ರದೇಶದ ಬೇಡಿಕೆಯನ್ನು AI ಮುನ್ಸೂಚಿಸುತ್ತದೆ, ರೈತರಿಗೆ ಕಟಾವು ಸಮಯವನ್ನು ಯೋಜಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
    refreshForecast: "ಮುನ್ಸೂಚನೆ ರಿಫ್ರೆಶ್",
    produceLabel: "ಬೆಳೆ",
    locationLabel: "ಸ್ಥಳ / ಮಂಡಿ",
    horizonLabel: "ಹೋರ್‌ಝನ್",
    horizon7: "ಮುಂದಿನ 7 ದಿನಗಳು",
    horizon14: "ಮುಂದಿನ 14 ದಿನಗಳು",
    horizon30: "ಮುಂದಿನ 30 ದಿನಗಳು",
    searchReady: "ಹುಡುಕಾಟ ಸಿದ್ಧವಾಗಿದೆ",
    searchFor: "ಹುಡುಕಲಾಗುತ್ತಿದೆ: {query}",
    languageSet: "ಭಾಷೆ {lang} ಗೆ ಹೊಂದಿಸಲ್ಪಟ್ಟಿದೆ",
  },
  Malayalam: {
    navForecast: "തന്നിരിക്കുന്ന ഡിമാൻഡ്",
    navPooling: "സ്മാർട്ട് സപ്ലൈ പൂൾ ചെയ്യൽ",
    navCore: "കോർ",
    navMarket: "മാർക്കറ്റ് ഇഞ്ചൈറ്റുകൾ",
    navRecommendations: "ശുപാർശകൾ",
    systemSection: "സിസ്റ്റം",
    navDocs: "സ്വാഗർ API ഡോക്യുമെന്റുകൾ",
    searchPlaceholder: "ഫসলുകൾ, farmers, മണ്ടികൾ അല്ലെങ്കിൽ ഓർഡറുകൾ തിരയുക...",
    statusLive: "AI എഞ്ചിൻ ലൈവ്",
    notifications: "അറിയിപ്പുകൾ",
    notif1: "ചെന്നൈ വരെ പ്രവചന അപ്‌ഡേറ്റുചെയ്തു",
    notif2: "3 ഫാമർ മാച്ചുകൾ റിവ്യൂ ചെയ്യണം",
    notif3: "മാർക്കറ്റ് വില അലേർട്ട്: തക്കാളി +4.2%",
    messages: "സന്ദേശങ്ങൾ",
    msg1: "ആശ്വര്യ: പ്രവചന സംഗ്രഹം തയ്യാറാണ്",
    msg2: "കാർത്തിക്: ബൾക്ക് ഓർഡർ സ്ഥിരീകരണം",
    msg3: "രവി: ഫസൽ ഉപദേശം പങ്കുവെച്ചിരിക്കുന്നു",
    language: "ഭാഷ",
    pageTitleForecast: "തോന്നുന്ന ഡിമാൻഡ് & ട്രെൻഡുകൾ 📈",
    pageSubtitleForecast: "അടുത്ത 7–30 ദിവസങ്ങളിലേയ്ക്ക് പ്രദേശീയ ഡിമാൻഡ് AI പ്രവചിക്കുന്നു, കർഷകർ കൊയ്യൽ സമയം പ്ലാൻ ചെയ്യാൻ സഹായിക്കുന്നു.",
    refreshForecast: "പ്രവചനം പുതുക്കുക",
    produceLabel: "പെരുകി",
    locationLabel: "സ്ഥലം / മണ്ടി",
    horizonLabel: "ഹോറൈസൺ",
    horizon7: "അടുത്ത 7 ദിവസം",
    horizon14: "അടുത്ത 14 ദിവസം",
    horizon30: "അടുത്ത 30 ദിവസം",
    searchReady: "തിരയൽ തയ്യാറാണ്",
    searchFor: "തിരയുന്നു: {query}",
    languageSet: "ഭാഷ {lang} ആയി സജ്ജീകരിച്ചു",
  },
  Marathi: {
    navForecast: "मागणी अंदाज",
    navPooling: "स्मार्ट पुरवठा पूलिंग",
    navCore: "मुख्य",
    navMarket: "मार्केट इन्झाइट्स",
    navRecommendations: "शिफारसी",
    systemSection: "सिस्टम",
    navDocs: "स्वागर API दस्तऐवजी",
    searchPlaceholder: "पिके, शेतकरी, मंडी किंवा ऑर्डर शोधा...",
    statusLive: "AI इंजिन लाइव्ह",
    notifications: "सूचना",
    notif1: "चेन्नईसाठी अंदाज अपडेट झाला",
    notif2: "3 शेतकरी जुळणींची तपासणी आवश्यक",
    notif3: "मार्केट किंमत चेतावणी: टोमॅटो +4.2%",
    messages: "मेसेज",
    msg1: "अश्वरी: अंदाज सारांश तयार",
    msg2: "कार्तिक: बफर ऑर्डर पुष्टीकरण",
    msg3: "रवी: फसल सल्लामत शेअर झाला",
    language: "भाषा",
    pageTitleForecast: "मागणी अंदाज आणि ट्रेंड्स 📈",
    pageSubtitleForecast: "AI पुढील 7–30 दिवसांत प्रादेशिक मागणीचा अंदाज लावते, त्यामुळे शेतकऱ्यांना पीक कटाईचे वेळपाळणं सोपे होते.",
    refreshForecast: "अंदाज रिफ्रेश",
    produceLabel: "उत्पादन",
    locationLabel: "स्थान / मंडी",
    horizonLabel: "हॉरिझन",
    horizon7: "पुढील 7 दिवस",
    horizon14: "पुढील 14 दिवस",
    horizon30: "पुढील 30 दिवस",
    searchReady: "शोध तयार आहे",
    searchFor: "शोधत आहे: {query}",
    languageSet: "भाषा {lang} वर सेट झाली",
  },
  Gujarati: {
    navForecast: "મિજત પૂર્વાનુમાન",
    navPooling: "સ્માર્ટ સપ્લાઈ પુલિંગ",
    navCore: "કોર",
    navMarket: "માર્કેટ ઈનસાઈટ્સ",
    navRecommendations: "સిఫારોશો",
    systemSection: "સિસ્ટમ",
    navDocs: "સ્વાગર API દસ્તાવેજો",
    searchPlaceholder: "ફળ, ખેડૂત, મુండి અથવા ઓર્ડર શોધો...",
    statusLive: "AI ઈજિન લાઇવ",
    notifications: "નોિટીफ़િકેશનો",
    notif1: "ચેન્નઈ માટે પૂર્વાનુમાન અપડેટ થયું",
    notif2: "3 ખેડૂત મેળાપોની સમીક્ષા જરૂરી",
    notif3: "માર્કેટ ભાવ ચેતવણી: ટમેટા +4.2%",
    messages: "સંદેશો",
    msg1: "આશ્વરી: પૂર્વાનુમાન સારાંશ તૈયાર છે",
    msg2: "કાર્તિક: બ્લક ઓર્ડર કન્ફર્મેશન",
    msg3: "રவி: પાક સલાહ શેર થઈ",
    language: "ભાષા",
    pageTitleForecast: "માગણી પૂર્વાનુમાન અને રुझાન 📈",
    pageSubtitleForecast: "AI આગામી 7–30 દિવસમાં પ્રદેશી માંગનું પૂર્વાનુમાન આપે છે, જેથી ખેડૂતો ફসল કાપવાનો સમય સારી રીતે ગોઠવી શકે.",
    refreshForecast: "પૂર્વાનુમાન રિફ્રેશ",
    produceLabel: "ઉત્પાદન",
    locationLabel: "સ્થાન / મુండి",
    horizonLabel: "હોરાઇઝન",
    horizon7: "આગામી 7 દિવસ",
    horizon14: "આગામી 14 દિવસ",
    horizon30: "આગામી 30 દિવસ",
    searchReady: "શોધ તૈયાર છે",
    searchFor: "શોધી રહ્યું છે: {query}",
    languageSet: "ભાષા {lang} પર સેટ થઈ",
  },
  Punjabi: {
    navForecast: "ਮੰਗ ਦੀ ਭਵਿੱਖਬਾਣੀ",
    navPooling: "ਸਮਾਰਟ ਸਪਲਾਈ ਪੂਲਿੰਗ",
    navCore: "ਕੋਰ",
    navMarket: "ਮਾਰਕੀਟ ਇੰਸਾਈਟਸ",
    navRecommendations: "ਸਿਫਾਰਸ਼ਾਂ",
    systemSection: "ਸਿਸਟਮ",
    navDocs: "ਸਵੈਗਰ API ਦਸਤਾਵੇਜ਼",
    searchPlaceholder: "ਫਸਲ, ਕਿਸਾਨ, ਮੰਡੀ ਜਾਂ ਆਰਡਰ ਖੋਜੋ...",
    statusLive: "AI ਇੰਜਣ ਲਾਈਵ",
    notifications: "ਨੋਟੀਫਿਕੇਸ਼ਨ",
    notif1: "ਚੇਨਈ ਲਈ ਭਵਿੱਖਬਾਣੀ ਅਪਡੇਟ ਹੋਈ",
    notif2: "3 ਕਿਸਾਨ ਮੇਲ ਦੀ ਸਮੀਖਿਆ ਜਰੂਰੀ",
    notif3: "ਮਾਰਕੀਟ ਕੀਮਤ ਅਲਰਟ: ਟਮਾਟਾ +4.2%",
    messages: "ਸੁਨੇਹੇ",
    msg1: "ਅਸ਼੍ਵਰਿਆ: ਭਵਿੱਖਬਾਣੀ ਸੰਖੇਪ ਤਿਆਰ",
    msg2: "ਕਰਿਤਿਕ: ਬਲਕ ਆਰਡਰ ਪੁਸ਼ਟੀਕਰਣ",
    msg3: "ਰਵੀ: ਫਸਲ ਸਲਾਹ ਸਾਂਝੀ ਕੀਤੀ",
    language: "ਭਾਸ਼ਾ",
    pageTitleForecast: "ਮੰਗ ਭਵਿੱਖਬਾਣੀ ਅਤੇ ਟ੍ਰੇਂਡ 📈",
    pageSubtitleForecast: "AI ਅਗਲੇ 7–30 ਦਿਨਾਂ ਵਿੱਚ ਖੇਤਰੀ ਮੰਗ ਦਾ ਅੰਦਾਜ਼ਾ ਲਗਾਉਂਦਾ ਹੈ ਤਾਂ ਕਿ ਕਿਸਾਨਾਂ ਨੂੰ ਫਸਲ ਦੀ ਕੱਟਾਈ ਦਾ ਸਮਾਂ ਬਿਹਤਰ ਤਰ੍ਹਾਂ ਲਗਾਇਆ ਜਾ ਸਕੇ।",
    refreshForecast: "ਭਵਿੱਖਬਾਣੀ ਰਿਫ੍ਰੈਸ਼",
    produceLabel: "ਫਸਲ",
    locationLabel: "ਥਾਂ / ਮੰਡੀ",
    horizonLabel: "ਹੋਰੀਜ਼ਨ",
    horizon7: "ਅਗਲੇ 7 ਦਿਨ",
    horizon14: "ਅਗਲੇ 14 ਦਿਨ",
    horizon30: "ਅਗਲੇ 30 ਦਿਨ",
    searchReady: "ਖੋਜ ਤਿਆਰ ਹੈ",
    searchFor: "ਖੋਜ ਜਾਰੀ: {query}",
    languageSet: "ਭਾਸ਼ਾ {lang} ਵਿੱਚ ਸੈੱਟ ਕੀਤੀ ਗਈ",
  },
  Odia: {
    navForecast: "ଚাহିଦା ପୂର୍ବାନୁମାନ",
    navPooling: "ସ୍ମାର୍ଟ ସପ୍ଲାଇ ପୁଲିଙ୍ଗ",
    navCore: "କୋର",
    navMarket: "ମାର୍କେଟ ଇନସାଇଟ୍ସ",
    navRecommendations: "ପରାମର୍ଶ",
    systemSection: "ସିଷ୍ଟମ୍",
    navDocs: "ସ୍ୱାଗର API ଡକ୍ୟୁମେଣ୍ଟ",
    searchPlaceholder: "ଫସଲ, କୃଷକ, ମଣ୍ଡି କିମ୍ବା ଆର୍ଡର ଖୋଜନ୍ତୁ...",
    statusLive: "AI ଇଞ୍ଜିନ ଲାଇଭ୍",
    notifications: "ନୋଟିଫିକେସନ୍",
    notif1: "ଚେନ୍ନାଇ ପାଇଁ ପୂର୍ବାନୁମାନ ଅପଡେଟ ହୋଇଛି",
    notif2: "3 କୃଷକ ମେଳ ସମୀକ୍ଷା ଆବଶ୍ୟକ",
    notif3: "ମାର୍କେଟ ମୂଲ୍ୟ ଚେତାବନୀ: ଟମାଟୋ +4.2%",
    messages: "ମେସେଜ୍",
    msg1: "ଆଶ୍ୱରିଆ: ପୂର୍ବାନୁମାନ ସାରାଂଶ ପ୍ରସ୍ତୁତ",
    msg2: "କାର୍ତ୍ତିକ: ବଲ୍କ ଆର୍ଡର ସୁନିଶ୍ଚିତକରଣ",
    msg3: "ରବି: ଫସଲ ପରାମର୍ଶ ଶେୟାର ହୋଇଛି",
    language: "ଭାଷା",
    pageTitleForecast: "ଚାହିଦା ପୂର୍ବାନୁମାନ ଓ ପ୍ରବୃତ୍ତି 📈",
    pageSubtitleForecast: "AI ଆଗାମୀ 7–30 ଦିନରେ ଅଞ୍ଚଳୀୟ ଚାହିଦା ପୂର୍ବାନୁମାନ କରେ, କୃଷକମାନେ କଟାଇ ଅବଧି ଭଲଭାତି ଯୋଜନା କରିପାରନ୍ତି।",
    refreshForecast: "ପୂର୍ବାନୁମାନ ରିଫ୍ରେଶ",
    produceLabel: "ଫସଲ",
    locationLabel: "ସ୍ଥାନ / ମଣ୍ଡି",
    horizonLabel: "ହୋରାଇଜନ",
    horizon7: "ପରବର୍ତ୍ତୀ 7 ଦିନ",
    horizon14: "ପରବର୍ତ୍ତୀ 14 ଦିନ",
    horizon30: "ପରବର୍ତ୍ତୀ 30 ଦିନ",
    searchReady: "ଖୋଜିବା ପ୍ରସ୍ତୁତ",
    searchFor: "ଖୋଜୁଛୁ: {query}",
    languageSet: "ଭାଷା {lang} ରେ ସେଟ ହୋଇଛି",
  },
};

const langShortCodes = {
  English: "EN",
  Hindi: "HI",
  Tamil: "TA",
  Telugu: "TE",
  Bengali: "BN",
  Kannada: "KN",
  Malayalam: "ML",
  Marathi: "MR",
  Gujarati: "GU",
  Punjabi: "PA",
  Odia: "OR",
};

// DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initHeaderActions();
  initRoleSwitcher();
  initDemandForecaster();
  initSupplyPooling();
  initMarketInsights();
  initRecommendations();
  loadInitialOverview();
});

function initHeaderActions() {
  const searchInput = document.getElementById("globalSearchInput");
  const searchTrigger = document.getElementById("searchTrigger");

  if (searchTrigger && searchInput) {
    searchTrigger.addEventListener("click", () => {
      searchInput.focus();
      searchInput.select();
      const key = currentLanguage === "English" ? "searchReady" : "searchReady";
      const text = searchInput.value ? t("searchFor", { query: searchInput.value }) : t("searchReady");
      showToast(text, "info");
    });

    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const query = (searchInput.value || "").trim();
        showToast(query ? t("searchFor", { query }) : t("searchReady"), "info");
      }
    });
  }

  const menuButtons = [
    { buttonId: "notificationBtn", menuId: "notificationMenu" },
    { buttonId: "messageBtn", menuId: "messageMenu" },
    { buttonId: "languageBtn", menuId: "languageMenu" },
  ];

  menuButtons.forEach(({ buttonId, menuId }) => {
    const trigger = document.getElementById(buttonId);
    const menu = document.getElementById(menuId);

    if (!trigger || !menu) return;

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = menu.classList.contains("show");
      closeHeaderMenus();
      if (!isOpen) {
        menu.classList.add("show");
      }
    });

    menu.querySelectorAll(".menu-item").forEach((item) => {
      item.addEventListener("click", () => {
        closeHeaderMenus();
        const text = item.textContent.trim();
        if (text) {
          showToast(text, "info");
        }
      });
    });
  });

  document.addEventListener("click", (event) => {
    const menus = document.querySelectorAll(".top-action-menu");
    menus.forEach((menu) => {
      if (!menu.contains(event.target) && !document.getElementById(menu.id.replace("Menu", "Btn"))?.contains(event.target)) {
        menu.classList.remove("show");
      }
    });
  });

  document.querySelectorAll(".lang-option").forEach((option) => {
    option.addEventListener("click", () => {
      const selectedLang = option.dataset.lang || "English";
      currentLanguage = selectedLang;
      applyLanguage(selectedLang);
      const languageBtn = document.getElementById("languageBtn");
      if (languageBtn) {
        languageBtn.textContent = langShortCodes[selectedLang] || "EN";
        languageBtn.setAttribute("title", `Language: ${selectedLang}`);
      }
      showToast(t("languageSet", { lang: selectedLang }), "info");
    });
  });
}

function t(key, values = {}) {
  const map = i18nCatalog[currentLanguage] || i18nCatalog.English;
  let text = map[key] || i18nCatalog.English[key] || key;
  Object.entries(values).forEach(([token, value]) => {
    text = text.replace(`{${token}}`, value);
  });
  return text;
}

function applyLanguage(lang) {
  const catalog = i18nCatalog[lang] || i18nCatalog.English;
  document.querySelectorAll("[data-i18n-key]").forEach((el) => {
    const key = el.getAttribute("data-i18n-key");
    if (catalog[key]) {
      el.textContent = catalog[key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (catalog[key]) {
      el.setAttribute("placeholder", catalog[key]);
    }
  });

  document.querySelectorAll("[data-i18n-option]").forEach((el) => {
    const key = el.getAttribute("data-i18n-option");
    if (catalog[key]) {
      el.textContent = catalog[key];
    }
  });

  const languageBtn = document.getElementById("languageBtn");
  if (languageBtn) {
    languageBtn.textContent = langShortCodes[lang] || "EN";
  }
}

function closeHeaderMenus() {
  document.querySelectorAll(".top-action-menu").forEach((menu) => menu.classList.remove("show"));
}

/* ==========================================================================
   1. Navigation & View Switching
   ========================================================================== */
function initNavigation() {
  const navItems = document.querySelectorAll(".nav-item[data-view]");
  const views = document.querySelectorAll(".view-section");
  const mobileToggle = document.getElementById("mobileMenuToggle");
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("mobileBackdrop");

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const targetView = item.getAttribute("data-view");

      navItems.forEach((n) => n.classList.remove("active"));
      item.classList.add("active");

      views.forEach((v) => {
        v.style.display = v.id === targetView ? "block" : "none";
      });

      // Close mobile drawer if open
      if (sidebar.classList.contains("open")) {
        sidebar.classList.remove("open");
        backdrop.classList.remove("show");
      }

      // Trigger view-specific loads
      if (targetView === "view-market-insights") {
        updateMarketInsights();
      } else if (targetView === "view-forecast") {
        updateForecastData();
      }
    });
  });

  // Mobile menu toggle
  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      backdrop.classList.toggle("show");
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", () => {
      sidebar.classList.remove("open");
      backdrop.classList.remove("show");
    });
  }

  // Profile dropdown toggle
  const userMenu = document.getElementById("userProfileMenu");
  const profileDropdown = document.getElementById("profileDropdown");
  if (userMenu && profileDropdown) {
    userMenu.addEventListener("click", (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle("show");
    });
    document.addEventListener("click", () => {
      profileDropdown.classList.remove("show");
    });
  }
}

/* ==========================================================================
   2. Role Switcher
   ========================================================================== */
function initRoleSwitcher() {
  const roleItems = document.querySelectorAll(".role-select-item");
  const userNameEl = document.getElementById("currentUserName");
  const userRoleEl = document.getElementById("currentUserRole");
  const welcomeNameEl = document.getElementById("welcomeUserName");

  roleItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const role = item.getAttribute("data-role");
      const name = item.getAttribute("data-name");

      currentRole = role;
      currentUserName = name;

      if (userNameEl) userNameEl.textContent = name;
      if (userRoleEl) userRoleEl.textContent = `Role: ${role}`;
      if (welcomeNameEl) welcomeNameEl.textContent = name;

      showToast(`Switched view to ${role} (${name})`, "info");
    });
  });
}

/* ==========================================================================
   3. Demand Forecasting Simulator & Chart
   ========================================================================== */
function initDemandForecaster() {
  const productSelect = document.getElementById("forecastProductSelect");
  const locationSelect = document.getElementById("forecastLocationSelect");
  const horizonSelect = document.getElementById("forecastHorizonSelect");
  const runBtn = document.getElementById("runForecastBtn");

  if (runBtn) {
    runBtn.addEventListener("click", updateForecastData);
  }
  if (productSelect) productSelect.addEventListener("change", updateForecastData);
  if (locationSelect) locationSelect.addEventListener("change", updateForecastData);
  if (horizonSelect) horizonSelect.addEventListener("change", updateForecastData);

  // Initial run
  updateForecastData();
}

async function updateForecastData() {
  const product = document.getElementById("forecastProductSelect")?.value || "Tomato";
  const location = document.getElementById("forecastLocationSelect")?.value || "Chennai";
  const horizon = parseInt(document.getElementById("forecastHorizonSelect")?.value || "7", 10);

  const predQtyEl = document.getElementById("forecastPredictedQty");
  const confEl = document.getElementById("forecastConfidence");
  const confBar = document.getElementById("forecastConfidenceBar");
  const trendBadge = document.getElementById("forecastTrendBadge");
  const dailyAvgEl = document.getElementById("forecastDailyAvg");

  try {
    const data = await API.getForecast(product, location, horizon);
    const historyData = await API.getDemandHistory(product, location, 20);

    if (predQtyEl) predQtyEl.textContent = `${data.predicted_qty_kg.toLocaleString()} kg`;
    if (confEl) confEl.textContent = `${data.confidence}%`;
    if (confBar) confBar.style.width = `${Math.min(data.confidence, 100)}%`;
    if (dailyAvgEl) dailyAvgEl.textContent = `~${data.daily_avg_kg || Math.round(data.predicted_qty_kg / horizon)} kg/day`;

    if (trendBadge) {
      trendBadge.className = `trend-badge ${data.trend === "rising" ? "trend-up" : data.trend === "falling" ? "trend-down" : "trend-neutral"}`;
      trendBadge.innerHTML = `${data.trend === "rising" ? "↑" : data.trend === "falling" ? "↓" : "→"} ${data.trend.toUpperCase()} TREND`;
    }

    renderForecastChart(historyData, data);
  } catch (err) {
    console.error("Forecast error:", err);
    showToast("Failed to fetch forecast: " + err.message, "danger");
  }
}

function renderForecastChart(history, forecast) {
  const canvas = document.getElementById("demandChartCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (activeChartInstance) {
    activeChartInstance.destroy();
  }

  const labels = [...(history.dates || [])];
  const dataPoints = [...(history.quantities || [])];

  // Add 3 projection days for visual demonstration
  const lastVal = dataPoints[dataPoints.length - 1] || 200;
  labels.push("Tomorrow (Pred)", "+3 Days", "+7 Days");
  const step = (forecast.daily_avg_kg || lastVal) - lastVal;
  dataPoints.push(Math.round(lastVal + step * 0.3));
  dataPoints.push(Math.round(lastVal + step * 0.7));
  dataPoints.push(Math.round(forecast.daily_avg_kg || lastVal));

  if (window.Chart) {
    activeChartInstance = new window.Chart(ctx, {
      type: "line",
      data: {
        labels: labels.map((l) => l.length > 10 ? l.slice(5) : l),
        datasets: [
          {
            label: `${forecast.product} Demand (kg)`,
            data: dataPoints,
            borderColor: "#1F6B45",
            backgroundColor: "rgba(61, 155, 104, 0.12)",
            borderWidth: 2.5,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: "#1F6B45",
            pointRadius: 3,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#102820",
            padding: 10,
            titleFont: { family: "Inter", size: 12 },
            bodyFont: { family: "Inter", size: 13, weight: "bold" },
            displayColors: false,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { family: "Inter", size: 11 }, color: "#6B7280" },
          },
          y: {
            grid: { color: "#E5E7EB", borderDash: [4, 4] },
            ticks: { font: { family: "Inter", size: 11 }, color: "#6B7280" },
          },
        },
      },
    });
  }
}

/* ==========================================================================
   4. Smart Supply Pooling Simulator
   ========================================================================== */
function initSupplyPooling() {
  const matchBtn = document.getElementById("runMatchBtn");
  if (matchBtn) {
    matchBtn.addEventListener("click", updateSupplyMatch);
  }
  updateSupplyMatch();
}

async function updateSupplyMatch() {
  const product = document.getElementById("matchProductSelect")?.value || "Tomato";
  const location = document.getElementById("matchLocationSelect")?.value || "Chennai";
  const qty = parseFloat(document.getElementById("matchQuantityInput")?.value || "1200");

  const summaryEl = document.getElementById("matchingSummaryBanner");
  const progressBar = document.getElementById("matchProgressBar");
  const progressLabel = document.getElementById("matchProgressLabel");
  const farmerListEl = document.getElementById("matchedFarmersList");

  try {
    const res = await API.matchBulkRequest(product, location, qty);

    if (summaryEl) {
      const statusBadge = res.status === "fully_fulfilled" 
        ? '<span class="badge badge-available">● FULLY FULFILLED</span>'
        : '<span class="badge badge-pending">● PARTIALLY FULFILLED</span>';
      summaryEl.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
          <div>
            <strong style="color: var(--dark); font-size: 16px;">AI Pooled ${res.farmers_used} Farmers</strong>
            <p style="color: var(--text-secondary); font-size: 13px; margin-top: 2px;">
              Fulfilled <strong>${res.fulfilled_qty_kg} kg</strong> of requested <strong>${res.required_qty_kg} kg</strong> | Total Est. Cost: <strong>₹${res.total_estimated_cost.toLocaleString()}</strong> (Avg ₹${res.avg_price_per_kg}/kg)
            </p>
          </div>
          ${statusBadge}
        </div>
      `;
    }

    if (progressBar && progressLabel) {
      progressBar.style.width = `${res.fulfillment_percentage}%`;
      progressLabel.textContent = `${res.fulfillment_percentage}% Fulfilled (${res.fulfilled_qty_kg} / ${res.required_qty_kg} kg)`;
    }

    if (farmerListEl) {
      if (!res.matched_farmers || res.matched_farmers.length === 0) {
        farmerListEl.innerHTML = '<p style="color: var(--text-muted); padding: 16px;">No farmers currently registered for this product.</p>';
      } else {
        farmerListEl.innerHTML = res.matched_farmers.map((f) => `
          <div class="farmer-allocation-item">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px;">
                ${f.farmer_id}
              </div>
              <div>
                <strong style="color: var(--text-primary); font-size: 14px;">Farmer ${f.farmer_id}</strong>
                <div style="font-size: 12px; color: var(--text-secondary); display: flex; gap: 8px; align-items: center; margin-top: 2px;">
                  <span>📍 ${f.location}</span>
                  <span>•</span>
                  <span>★ ${f.rating}</span>
                  ${f.is_local ? '<span class="badge badge-available" style="padding: 2px 6px; font-size: 10px;">Same Mandi</span>' : ""}
                </div>
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 15px; font-weight: 700; color: var(--primary);">
                ${f.allocated_qty_kg} kg
              </div>
              <div style="font-size: 12px; color: var(--text-secondary);">
                ₹${f.price_per_kg}/kg (Score: ${f.match_score})
              </div>
            </div>
          </div>
        `).join("");
      }
    }
  } catch (err) {
    console.error("Match error:", err);
    showToast("Failed to match farmers: " + err.message, "danger");
  }
}

/* ==========================================================================
   5. Market Insights & Top Crops
   ========================================================================== */
function initMarketInsights() {
  const locSelect = document.getElementById("marketLocationSelect");
  if (locSelect) {
    locSelect.addEventListener("change", updateMarketInsights);
  }
}

async function updateMarketInsights() {
  const location = document.getElementById("marketLocationSelect")?.value || "Chennai";
  const listEl = document.getElementById("topCropsList");

  try {
    const data = await API.getTopProducts(location, 4);
    const products = data.top_products || [];

    if (listEl) {
      listEl.innerHTML = products.map((item, idx) => `
        <div class="card card-hover" style="display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="font-size: 22px; font-weight: 700; color: var(--primary); width: 28px;">#${idx + 1}</div>
            <div>
              <h4 style="font-size: 16px; font-weight: 600; color: var(--text-primary);">${item.product}</h4>
              <p style="font-size: 13px; color: var(--text-secondary); margin-top: 2px;">
                Predicted 7-Day Regional Demand: <strong>${item.predicted_qty_kg.toLocaleString()} kg</strong>
              </p>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 16px;">
            <span class="badge ${item.trend === "rising" ? "badge-available" : "badge-pending"}">
              ${item.trend === "rising" ? "↑ Rising Demand" : "→ Steady Demand"}
            </span>
            <div style="text-align: right;">
              <span style="font-size: 11px; color: var(--text-muted); display: block;">CONFIDENCE</span>
              <strong style="color: var(--dark);">${item.confidence}%</strong>
            </div>
          </div>
        </div>
      `).join("");
    }

    renderMarketChart(products);
  } catch (err) {
    console.error("Market Insights error:", err);
  }
}

function renderMarketChart(products) {
  const canvas = document.getElementById("marketChartCanvas");
  if (!canvas || !window.Chart) return;

  const ctx = canvas.getContext("2d");
  if (marketChartInstance) {
    marketChartInstance.destroy();
  }

  marketChartInstance = new window.Chart(ctx, {
    type: "bar",
    data: {
      labels: products.map((p) => p.product),
      datasets: [
        {
          label: "7-Day Projected Demand (kg)",
          data: products.map((p) => p.predicted_qty_kg),
          backgroundColor: ["#1F6B45", "#3D9B68", "#D9A441", "#3B82C4"],
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: "#E5E7EB" } },
      },
    },
  });
}

/* ==========================================================================
   6. AI Recommendations
   ========================================================================== */
function initRecommendations() {
  const farmerRecBtn = document.getElementById("getFarmerRecBtn");
  const buyerRecBtn = document.getElementById("getBuyerRecBtn");

  if (farmerRecBtn) farmerRecBtn.addEventListener("click", updateFarmerRecommendations);
  if (buyerRecBtn) buyerRecBtn.addEventListener("click", updateBuyerRecommendations);

  updateFarmerRecommendations();
  updateBuyerRecommendations();
}

async function updateFarmerRecommendations() {
  const loc = document.getElementById("recFarmerLocation")?.value || "Coimbatore";
  const currentProd = document.getElementById("recFarmerCurrentCrop")?.value || "Tomato";
  const resultsEl = document.getElementById("farmerRecResults");

  try {
    const res = await API.recommendForFarmer(loc, currentProd);
    if (resultsEl) {
      resultsEl.innerHTML = `
        <div style="background-color: var(--primary-light); padding: 14px 18px; border-radius: var(--radius-md); margin-bottom: 16px; border: 1px solid rgba(31, 107, 69, 0.2);">
          <strong style="color: var(--primary);">🌾 AI Crop Advisory for ${loc}</strong>
          <p style="font-size: 13px; color: var(--text-primary); margin-top: 4px;">
            Current produce <strong>${currentProd}</strong> is forecasted with <strong>${res.current_product_forecast?.confidence || 82}% confidence</strong> (${res.current_product_forecast?.trend || "stable"} trend).
          </p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${(res.recommended_products || []).map((p, idx) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background-color: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm);">
              <div>
                <strong>${idx + 1}. ${p.product}</strong>
                <span style="font-size: 12px; color: var(--text-secondary); display: block;">Expected Demand: ${p.predicted_qty_kg} kg</span>
              </div>
              <span class="badge badge-gold">Top Opportunity</span>
            </div>
          `).join("")}
        </div>
      `;
    }
  } catch (err) {
    console.error("Farmer Rec error:", err);
  }
}

async function updateBuyerRecommendations() {
  const prod = document.getElementById("recBuyerProduct")?.value || "Tomato";
  const loc = document.getElementById("recBuyerLocation")?.value || "Chennai";
  const resultsEl = document.getElementById("buyerRecResults");

  try {
    const res = await API.recommendFarmersForBuyer(prod, loc, 4);
    const farmers = res.recommended_farmers || [];

    if (resultsEl) {
      resultsEl.innerHTML = farmers.map((f) => `
        <div class="farmer-allocation-item" style="margin-bottom: 8px;">
          <div>
            <strong>👨‍🌾 Farmer ${f.farmer_id}</strong> (${f.location})
            <div style="font-size: 12px; color: var(--text-secondary);">
              Rating: ★ ${f.rating} | Available: ${f.available_qty_kg} kg
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 16px; font-weight: 700; color: var(--primary);">₹${f.price_per_kg} / kg</div>
            <button class="btn btn-sm btn-outline" style="margin-top: 4px; padding: 4px 8px; font-size: 11px;">Direct Order</button>
          </div>
        </div>
      `).join("");
    }
  } catch (err) {
    console.error("Buyer Rec error:", err);
  }
}

/* ==========================================================================
   7. Initial Overview & Live Counters
   ========================================================================== */
async function loadInitialOverview() {
  try {
    const health = await API.getHealth();
    const livePill = document.getElementById("aiEngineStatusPill");
    if (livePill) {
      livePill.innerHTML = '<span class="badge-dot" style="background-color: #3D9B68;"></span> AI Engine Active (:8001)';
    }
  } catch (e) {
    console.warn("Could not reach AI engine health check");
  }
}

/* ==========================================================================
   8. Global Toast Notification
   ========================================================================== */
export function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer") || createToastContainer();
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span style="font-size: 16px;">${type === "success" ? "✓" : type === "danger" ? "✕" : "ℹ"}</span>
    <span style="font-size: 13px; font-weight: 500;">${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(12px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function createToastContainer() {
  const c = document.createElement("div");
  c.id = "toastContainer";
  c.className = "toast-container";
  document.body.appendChild(c);
  return c;
}
