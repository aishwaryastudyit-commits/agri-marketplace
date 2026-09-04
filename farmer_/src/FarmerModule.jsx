import { useState } from 'react';
import { 
  LayoutDashboard, Package, Calendar, Truck, Wallet, 
  Plus, Sparkles, Mic, Globe, Trash2, 
  HelpCircle, X, Bell, User, CheckCircle2, AlertCircle, ArrowRight, LogOut
} from 'lucide-react';

const TRANSLATIONS = {
  en: {
    portalName: 'ANNAM Farmer Portal',
    loginTitle: 'Welcome to ANNAM',
    loginSub: 'Direct Farm-to-Enterprise & Market Aggregation System',
    loginBtn: 'Enter Farmer Portal →',
    profilePrompt: 'Complete your Farm Profile to unlock matched buyer orders & smart pooling!',
    updateBtn: 'Update Profile Now',
    skipBtn: 'Skip for Now',
    labels: {
      fullName: 'Full Name',
      email: 'Email Address',
      phone: 'Mobile Number',
      district: 'District / Location',
      pref: 'Selling Preference',
      prefBulk: 'Bulk Only (100kg+ to Wholesalers/Supermarkets)',
      prefRetail: 'Small Only (1-50kg to Consumers)',
      prefBoth: 'Both (Bulk Pooled + Direct Retail)',
      saveProfile: 'Save & Update Dashboard'
    },
    nav: {
      dashboard: 'Dashboard',
      inventory: 'My Produce',
      harvest: 'Upcoming Harvest',
      logistics: 'Logistics & Orders',
      wallet: 'Wallet & Payments'
    },
    metrics: {
      readyToSell: 'Active Produce Listings',
      pendingPickups: 'Driver Pickups Pending',
      withdrawable: 'Cash Available for Transfer',
      sellingMode: 'Active Supply Mode'
    },
    buttons: {
      addBtn: '+ Add Crop / Harvest',
      withdraw: 'Send to Bank Account',
      speak: 'Speak Crop',
      markReady: 'Mark Ready for Pickup',
      markDispatched: 'Handed to Driver'
    },
    tour: [
      {
        title: '1. Add Single or Bulk Harvest',
        desc: 'List fresh crops ready today or register upcoming harvests. Choose if they are for bulk contracts or retail sales.',
        tip: 'Supports voice input in English, Tamil, and Hindi.'
      },
      {
        title: '2. Manage Stock & Pricing',
        desc: 'View current inventory, update market pricing, or remove sold crops.',
        tip: 'Visible directly to matching verified buyers.'
      },
      {
        title: '3. Pre-Harvest Supply Pooling',
        desc: 'Schedule harvests 10-15 days ahead to pool volumes with neighboring farms for big buyers.',
        tip: 'Locks guaranteed minimum prices early.'
      },
      {
        title: '4. Driver Handover & Notifications',
        desc: 'Get notified when an order arrives. Mark orders ready so the driver picks up directly from your farm gate.',
        tip: 'No need to transport bags to distant mandis.'
      }
    ]
  },
  ta: {
    portalName: 'அன்னம் உழவர் தளம்',
    loginTitle: 'அன்னம் உழவர் தளத்திற்கு நல்வரவு',
    loginSub: 'விவசாயிகளுக்கான நேரடி மொத்த மற்றும் சில்லறை விற்பனை தளம்',
    loginBtn: 'தளத்திற்குள் செல்க →',
    profilePrompt: 'சரியான வியாபாரிகளை பெற உங்கள் சுயவிவரத்தை முழுமையாக பூர்த்தி செய்யவும்!',
    updateBtn: 'சுயவிவரம் சேர்க்க',
    skipBtn: 'பிறகு செய்கிறேன்',
    labels: {
      fullName: 'முழுப் பெயர்',
      email: 'மின்னஞ்சல் முகவரி',
      phone: 'அலைபேசி எண்',
      district: 'மாவட்டம் / ஊர்',
      pref: 'விற்பனை விருப்பம்',
      prefBulk: 'மொத்த விற்பனை மட்டும் (100+ கிலோ நிறுவனங்களுக்கு)',
      prefRetail: 'சில்லறை விற்பனை மட்டும் (1-50 கிலோ நுகர்வோருக்கு)',
      prefBoth: 'இரண்டும் (மொத்த வியாபாரம் + சில்லறை விற்பனை)',
      saveProfile: 'சேமித்து தொடர்க'
    },
    nav: {
      dashboard: 'முகப்பு',
      inventory: 'என் பயிர்கள்',
      harvest: 'எதிர்கால அறுவடை',
      logistics: 'ஏற்றுமதி & ஆர்டர்கள்',
      wallet: 'பணம் & கணக்கு'
    },
    metrics: {
      readyToSell: 'விற்பனைக்கு உள்ள பயிர்',
      pendingPickups: 'இன்று வரும் வண்டிகள்',
      withdrawable: 'உடனடி பண வரவு',
      sellingMode: 'விற்பனை வகை'
    },
    buttons: {
      addBtn: '+ பயிர் / அறுவடை சேர்க்க',
      withdraw: 'வங்கி கணக்கிற்கு மாற்றுக',
      speak: 'குரல் மூலம் கூற',
      markReady: 'தயார் என மாற்று',
      markDispatched: 'ஓட்டுநரிடம் ஒப்படைக்கப்பட்டது'
    },
    tour: [
      {
        title: '1. பயிர் மற்றும் அறுவடை சேர்க்க',
        desc: 'உடனடி விற்பனைக்கான பயிர்களை பட்டியலிட அல்லது எதிர்கால அறுவடையை பதிவு செய்ய இந்த பொத்தானை அழுத்தவும்.',
        tip: 'குரல் மூலமாகவும் பேசலாம்!'
      },
      {
        title: '2. பயிர்களை நிர்வகிக்க / நீக்க',
        desc: 'இங்கு சென்று உங்கள் பயிர்களின் விலையை மாற்றலாம் அல்லது விற்பனையான பயிர்களை நீக்கலாம்.',
        tip: 'நேரடி சந்தை விலை நிர்ணயம்.'
      },
      {
        title: '3. கூட்டு அறுவடை (Pooling)',
        desc: 'அறுவடைக்கு முன்பே பதிவு செய்து அக்கம் பக்கத்து விவசாயிகளுடன் இணைந்து மொத்த வியாபாரிகளை ஈர்க்கலாம்.',
        tip: 'முன்கூட்டியே நியாயமான விலை உறுதி.'
      },
      {
        title: '4. ஓட்டுநர் வருகை & ஏற்றுமதி',
        desc: 'ஆர்டர் வந்ததும் அறிவிப்பு வரும். தயார் என மாற்றினால் ஓட்டுநர் உங்கள் தோட்டத்திற்கே வந்து பெற்றுக்கொள்வார்.',
        tip: 'சந்தை தூக்கிச் செல்லும் அலைச்சல் இல்லை.'
      }
    ]
  },
  hi: {
    portalName: 'अन्नम किसान पोर्टल',
    loginTitle: 'अन्नम में आपका स्वागत है',
    loginSub: 'किसानों के लिए सीधा थोक एवं खुदरा बाजार मंच',
    loginBtn: 'पोर्टल में प्रवेश करें →',
    profilePrompt: 'उचित खरीदार पाने के लिए अपनी किसान प्रोफ़ाइल पूरी करें!',
    updateBtn: 'प्रोफ़ाइल अपडेट करें',
    skipBtn: 'बाद में',
    labels: {
      fullName: 'पूरा नाम',
      email: 'ईमेल पता',
      phone: 'मोबाइल नंबर',
      district: 'जिला / स्थान',
      pref: 'बिक्री प्राथमिकता',
      prefBulk: 'केवल थोक (100+ किग्रा फैक्टरी/थोक व्यापारी)',
      prefRetail: 'केवल खुदरा (1-50 किग्रा आम ग्राहक)',
      prefBoth: 'दोनों (थोक समूह + खुदरा बिक्री)',
      saveProfile: 'सहेजें और आगे बढ़ें'
    },
    nav: {
      dashboard: 'डैशबोर्ड',
      inventory: 'मेरी उपज',
      harvest: 'आगामी कटाई',
      logistics: 'लॉजिस्टिक्स और ऑर्डर',
      wallet: 'भुगतान और बटुआ'
    },
    metrics: {
      readyToSell: 'सक्रिय फसल लिस्टिंग',
      pendingPickups: 'आज आने वाले ट्रक',
      withdrawable: 'बैंक ट्रांसफर राशि',
      sellingMode: 'सक्रिय आपूर्ति मोड'
    },
    buttons: {
      addBtn: '+ फसल / कटाई जोड़ें',
      withdraw: 'बैंक में भेजें',
      speak: 'बोलकर बताएं',
      markReady: 'तैयार मार्क करें',
      markDispatched: 'ड्राइवर को सौंप दिया'
    },
    tour: [
      {
        title: '1. नई फसल या कटाई जोड़ें',
        desc: 'ताजा उपज या आगामी कटाई दर्ज करें और थोक/खुदरा मोड चुनें।',
        tip: 'बोलकर भी जानकारी भर सकते हैं!'
      },
      {
        title: '2. उपज प्रबंधन',
        desc: 'यहां अपनी फसलों की सूची देखें, भाव बदलें या फसल हटाएं।',
        tip: 'सीधा खरीदारों से संपर्क।'
      },
      {
        title: '3. स्मार्ट सप्लाई पूलिंग',
        desc: 'आस-पास के किसानों के साथ मिलकर बड़ी कंपनियों को बेहतर दाम पर फसल बेचें।',
        tip: 'कटाई से पहले सुरक्षित दाम।'
      },
      {
        title: '4. ड्राइवर पिकअप और सूचनाएं',
        desc: 'नया ऑर्डर आने पर नोटिफिकेशन मिलेगा। तैयार मार्क करें और ड्राइवर आपके खेत से माल उठाएगा।',
        tip: 'मंडी जाने का झंझट खत्म।'
      }
    ]
  }
};

const POPULAR_CROPS = [
  { id: 'tomato', name: 'Country Tomato', local: 'நாட்டுத் தக்காளி', icon: '🍅', mandiPrice: 28 },
  { id: 'rice', name: 'Ponni Raw Rice', local: 'பொன்னி அரிசி', icon: '🌾', mandiPrice: 52 },
  { id: 'onion', name: 'Red Onion', local: 'சின்ன வெங்காயம்', icon: '🧅', mandiPrice: 35 },
  { id: 'potato', name: 'Potato', local: 'உருளைக்கிழங்கு', icon: '🥔', mandiPrice: 24 },
  { id: 'banana', name: 'Banana (Robusta)', local: 'வாழைப்பழம்', icon: '🍌', mandiPrice: 40 },
  { id: 'chilli', name: 'Green Chilli', local: 'பச்சை மிளகாய்', icon: '🌶️', mandiPrice: 65 },
];

export default function FarmerModule({ initialTab = 'dashboard' }) {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
  const [lang, setLang] = useState('en');
  
  // 1. Auth & Profile State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ name: '', email: '' });
  const [profile, setProfile] = useState({
    id: null,
    name: '',
    email: '',
    phone: '',
    district: '',
    preference: 'both', // 'bulk' | 'retail' | 'both'
    isCompleted: false
  });

  const [showProfileBanner, setShowProfileBanner] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // App Workflow State
  const [tourStep, setTourStep] = useState(0);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [isListening, setIsListening] = useState(false);

  const [notification, setNotification] = useState({
    show: true,
    message: 'New Bulk Order Received: 150 kg Country Tomato from Coimbatore Fresh Basket!',
    time: '5 mins ago'
  });

  const t = TRANSLATIONS[lang];

  const [products, setProducts] = useState([
    { id: 1, name: 'Ponni Raw Rice', local: 'பொன்னி அரிசி', qty: 1200, unit: 'kg', price: 52, channel: 'Bulk Only', icon: '🌾' },
    { id: 2, name: 'Country Tomato', local: 'நாட்டுத் தக்காளி', qty: 300, unit: 'kg', price: 28, channel: 'Both', icon: '🍅' },
    { id: 3, name: 'Red Onion', local: 'சின்ன வெங்காயம்', qty: 450, unit: 'kg', price: 35, channel: 'Retail & Bulk', icon: '🧅' },
  ]);

  const [harvests, setHarvests] = useState([
    { id: 1, name: 'Fresh Potatoes', local: 'உருளைக்கிழங்கு', expectedQty: 1500, unit: 'kg', harvestDate: '2026-09-18', channel: 'Bulk Pooled', status: 'Pooling Active' },
  ]);

  const [orders, setOrders] = useState([
    { 
      id: 'ORD-1092', 
      crop: 'Country Tomato', 
      buyer: 'Coimbatore Fresh Basket (Supermarket Chain)', 
      orderType: 'Bulk Enterprise',
      qty: '150 kg', 
      amount: 4200, 
      status: 'Ready for Pickup', 
      pickupSlot: 'Today, 4:00 PM', 
      driver: 'Selvam (TN-38-AF-9821)' 
    },
    { 
      id: 'ORD-1088', 
      crop: 'Ponni Raw Rice', 
      buyer: 'Malar Wholesalers', 
      orderType: 'Bulk Enterprise',
      qty: '500 kg', 
      amount: 26000, 
      status: 'In Transit', 
      pickupSlot: 'Yesterday', 
      driver: 'Karthik (TN-42-B-1102)' 
    },
    { 
      id: 'ORD-1085', 
      crop: 'Red Onion', 
      buyer: 'Direct Consumer (Ananya S.)', 
      orderType: 'Retail (Small)',
      qty: '10 kg', 
      amount: 350, 
      status: 'Ready for Pickup', 
      pickupSlot: 'Today, 5:30 PM', 
      driver: 'Local Hub Runner (Manoj)' 
    },
  ]);

  const [formData, setFormData] = useState({
    crop: null,
    isUpcoming: false,
    qty: 100,
    price: 30,
    harvestDate: '2026-09-08',
    channel: 'both'
  });

  // Handle Initial Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.name || !loginForm.email) return;
    const phone = profile.phone || '9840100000';
    try {
      const response = await fetch(`${API_BASE_URL}/farmers/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: loginForm.name,
          phone,
          location: profile.district || 'Coimbatore, Tamil Nadu',
          farm_name: 'ANNAM Farm'
        })
      });
      if (!response.ok && response.status !== 400) throw new Error('Farmer registration failed');
      const farmer = response.ok ? await response.json() : {};
      setProfile(prev => ({ ...prev, id: farmer.id || prev.id, name: loginForm.name, email: loginForm.email, phone, district: prev.district || 'Coimbatore, Tamil Nadu' }));
      setIsLoggedIn(true);
    } catch (error) {
      alert(error.message || 'Unable to connect to the farmer service.');
    }
  };

  const handleSaveProfile = async () => {
    if (profile.id) {
      await fetch(`${API_BASE_URL}/farmers/${profile.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: profile.name, phone: profile.phone, location: profile.district })
      });
    }
    setProfile(prev => ({ ...prev, isCompleted: true }));
    setIsProfileModalOpen(false);
    setShowProfileBanner(false);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Please use Google Chrome for voice assistance.");
    const rec = new SpeechRecognition();
    rec.lang = lang === 'ta' ? 'ta-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
    setIsListening(true);
    rec.onresult = (e) => {
      const txt = e.results[0][0].transcript.toLowerCase();
      const match = POPULAR_CROPS.find(c => txt.includes(c.name.toLowerCase()) || txt.includes(c.local.toLowerCase()));
      const qtyMatch = txt.match(/\d+/);
      if (match) setFormData(prev => ({ ...prev, crop: match, price: match.mandiPrice }));
      if (qtyMatch) setFormData(prev => ({ ...prev, qty: parseInt(qtyMatch[0]) }));
      setIsListening(false);
    };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    rec.start();
  };

  const handlePublish = () => {
    if (formData.isUpcoming) {
      setHarvests([...harvests, {
        id: Date.now(),
        name: formData.crop?.name || 'Assorted Produce',
        local: formData.crop?.local || '',
        expectedQty: formData.qty,
        unit: 'kg',
        harvestDate: formData.harvestDate,
        channel: formData.channel === 'bulk' ? 'Bulk Pooled' : 'Retail & Bulk',
        status: 'Pooling Active'
      }]);
      setActiveTab('harvest');
    } else {
      setProducts([...products, {
        id: Date.now(),
        name: formData.crop?.name || 'Produce',
        local: formData.crop?.local || '',
        qty: formData.qty,
        unit: 'kg',
        price: formData.price,
        channel: formData.channel === 'bulk' ? 'Bulk Only' : formData.channel === 'retail' ? 'Retail Only' : 'Both',
        icon: formData.crop?.icon || '📦'
      }]);
      setActiveTab('inventory');
    }
    setShowWizard(false);
    setWizardStep(1);
    setFormData({ crop: null, isUpcoming: false, qty: 100, price: 30, harvestDate: '2026-09-08', channel: profile.preference });
  };

  const togglePickup = (id) => {
    setOrders(orders.map(o => o.id === id ? {
      ...o,
      status: o.status === 'Ready for Pickup' ? 'Handed to Driver' : 'Ready for Pickup'
    } : o));
  };

  // ----------------------------------------------------
  // SCREEN 1: LOGIN PAGE
  // ----------------------------------------------------
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F7F6F0] flex items-center justify-center p-4 font-sans">
        <div className="bg-white max-w-md w-full rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-[#102820] text-white p-8 text-center relative">
            <span className="text-5xl block mb-2">🌱</span>
            <h1 className="text-2xl font-black tracking-tight">{t.loginTitle}</h1>
            <p className="text-xs text-emerald-300 mt-1">{t.loginSub}</p>

            {/* Language Switcher in Login */}
            <div className="flex justify-center gap-1.5 mt-4">
              {(['en', 'ta', 'hi']).map((code) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    lang === code ? 'bg-[#1F6B45] text-white' : 'bg-emerald-950 text-emerald-300'
                  }`}
                >
                  {code === 'en' ? 'English' : code === 'ta' ? 'தமிழ்' : 'हिंदी'}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t.labels.fullName}</label>
              <input
                type="text"
                required
                placeholder="e.g. Deepa"
                value={loginForm.name}
                onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                className="w-full p-3 border-2 border-gray-200 rounded-xl font-bold text-sm outline-none focus:border-[#1F6B45]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t.labels.email}</label>
              <input
                type="email"
                required
                placeholder="e.g. deepa@example.com"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                className="w-full p-3 border-2 border-gray-200 rounded-xl font-bold text-sm outline-none focus:border-[#1F6B45]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#1F6B45] hover:bg-[#165335] text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              {t.loginBtn}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // SCREEN 2: MAIN FARMER DASHBOARD
  // ----------------------------------------------------
  const filteredOrders = orders.filter(o => {
    if (profile.preference === 'bulk') return o.orderType.includes('Bulk');
    if (profile.preference === 'retail') return o.orderType.includes('Retail');
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F7F6F0] text-slate-900 flex font-sans relative">
      
      {/* 1. SIDEBAR */}
      <aside className="w-64 bg-[#102820] text-white flex flex-col justify-between shrink-0 p-4 min-h-screen z-10">
        <div>
          <div className="flex items-center gap-3 px-3 py-4 mb-3 border-b border-emerald-900/50">
            <span className="text-3xl">🌱</span>
            <div>
              <h1 className="text-lg font-bold">ANNAM</h1>
              <p className="text-[11px] text-[#3D9B68] font-semibold">{t.portalName}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
              { id: 'inventory', label: t.nav.inventory, icon: Package },
              ...(profile.preference !== 'retail' ? [{ id: 'harvest', label: t.nav.harvest, icon: Calendar }] : []),
              { id: 'logistics', label: t.nav.logistics, icon: Truck },
              { id: 'wallet', label: t.nav.wallet, icon: Wallet },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isHighlighted = (tourStep === 2 && item.id === 'inventory') || 
                                    (tourStep === 3 && item.id === 'harvest') || 
                                    (tourStep === 4 && item.id === 'logistics');

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition text-left relative ${
                    isActive ? 'bg-[#1F6B45] text-white shadow-sm' : 'text-gray-300 hover:bg-[#1A3D30]'
                  } ${isHighlighted ? 'ring-4 ring-[#D9A441] bg-[#1A3D30] z-40 scale-105 transition-transform' : ''}`}
                >
                  <Icon className="w-4 h-4 text-emerald-300" />
                  {item.label}
                  {isHighlighted && (
                    <span className="absolute -right-2 top-2.5 w-3 h-3 bg-[#D9A441] rounded-full animate-ping" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => setTourStep(1)}
            className="w-full bg-[#1A3D30] hover:bg-emerald-950 text-emerald-300 py-2.5 rounded-xl text-xs font-bold border border-emerald-800/50 flex items-center justify-center gap-2 transition"
          >
            <HelpCircle className="w-4 h-4" /> App Guide Tour 💡
          </button>

          {/* Farmer Profile Card */}
          <button 
            onClick={() => setIsProfileModalOpen(true)}
            className="w-full p-3 bg-[#1A3D30] hover:bg-emerald-950 rounded-2xl flex items-center justify-between border border-emerald-800/40 text-left transition"
          >
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" /> {profile.name}
              </p>
              <p className="text-[10px] text-emerald-300 truncate max-w-[130px]">
                {profile.district || 'Location pending'}
              </p>
            </div>
            <span className="text-[10px] uppercase font-bold bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-md">
              {profile.preference}
            </span>
          </button>

          <button
            onClick={() => setIsLoggedIn(false)}
            className="w-full text-gray-400 hover:text-red-400 text-[11px] font-bold py-1.5 flex items-center justify-center gap-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* TOP BAR */}
        <header className="bg-white border-b border-gray-200 px-8 py-3.5 flex justify-between items-center sticky top-0 z-20">
          <div>
            <h2 className="text-lg font-bold text-[#1F6B45]">{t.nav[activeTab]}</h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selection */}
            <div className="flex items-center bg-[#F7F6F0] rounded-xl p-1 border border-gray-200">
              <Globe className="w-4 h-4 text-gray-500 ml-2 mr-1" />
              {(['en', 'ta', 'hi']).map((code) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    lang === code ? 'bg-[#1F6B45] text-white shadow-sm' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {code === 'en' ? 'English' : code === 'ta' ? 'தமிழ்' : 'हिंदी'}
                </button>
              ))}
            </div>

            {/* Add Crop Button with Tour Ring */}
            <div className="relative">
              <button 
                onClick={() => { setShowWizard(true); setWizardStep(1); }}
                className={`bg-[#1F6B45] hover:bg-[#165335] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition ${
                  tourStep === 1 ? 'ring-4 ring-[#D9A441] scale-105 z-40' : ''
                }`}
              >
                <Plus className="w-4 h-4" /> {t.buttons.addBtn}
              </button>
              {tourStep === 1 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#D9A441] rounded-full animate-ping" />
              )}
            </div>
          </div>
        </header>

        {/* WORKSPACE CONTENT */}
        <main className="p-8 space-y-6 max-w-6xl">
          
          {/* A. Profile Completion Suggestion Banner */}
          {showProfileBanner && !profile.isCompleted && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-amber-500 text-white rounded-xl">
                  <AlertCircle className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider">
                    Profile Setup Incomplete
                  </h4>
                  <p className="text-xs font-bold text-amber-900 mt-0.5">{t.profilePrompt}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1"
                >
                  {t.updateBtn} <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setShowProfileBanner(false)}
                  className="text-xs font-bold text-gray-500 hover:text-gray-800 px-2 py-2"
                >
                  {t.skipBtn}
                </button>
              </div>
            </div>
          )}

          {/* B. Order Received Notification */}
          {notification.show && (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-[#1F6B45] text-white rounded-xl">
                  <Bell className="w-5 h-5 animate-bounce" />
                </span>
                <div>
                  <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-2">
                    <span>Direct Order Confirmed</span>
                    <span className="text-[10px] text-emerald-700 font-normal">({notification.time})</span>
                  </h4>
                  <p className="text-xs font-bold text-[#1F6B45] mt-0.5">{notification.message}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('logistics')}
                  className="bg-[#1F6B45] text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-[#165335] transition"
                >
                  View Logistics & Pickup
                </button>
                <button 
                  onClick={() => setNotification({ ...notification, show: false })}
                  className="p-1 text-gray-400 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: DASHBOARD (Adapts to preference) */}
          {activeTab === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <p className="text-xs font-bold text-gray-500">{t.metrics.readyToSell}</p>
                  <h3 className="text-2xl font-black text-gray-900 mt-1">{products.length} Crops</h3>
                  <span className="text-[11px] text-[#1F6B45] font-bold">1,950 kg available</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <p className="text-xs font-bold text-gray-500">{t.metrics.pendingPickups}</p>
                  <h3 className="text-2xl font-black text-[#E89B3C] mt-1">{filteredOrders.filter(o => o.status === 'Ready for Pickup').length} Orders</h3>
                  <span className="text-[11px] text-gray-500">Pickups at farm gate</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <p className="text-xs font-bold text-gray-500">{t.metrics.withdrawable}</p>
                  <h3 className="text-2xl font-black text-[#1F6B45] mt-1">₹34,800</h3>
                  <span className="text-[11px] text-emerald-600 font-bold">✓ Ready for payout</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <p className="text-xs font-bold text-gray-500">{t.metrics.sellingMode}</p>
                  <h3 className="text-lg font-black text-blue-700 mt-2 capitalize">{profile.preference} Mode</h3>
                  <span className="text-[11px] text-blue-500 font-semibold">Matched with buyers</span>
                </div>
              </div>

              {/* Demand Card (Shown only for Bulk & Both modes) */}
              {profile.preference !== 'retail' && (
                <div className="bg-gradient-to-r from-[#102820] to-[#1F6B45] text-white p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-[#E8F5EC] text-[#1F6B45] text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Mandi Alert: High Bulk Demand
                      </span>
                    </div>
                    <h3 className="text-base font-bold">Country Tomato Wholesale Price expected to jump +28%</h3>
                    <p className="text-xs text-emerald-100 mt-1">Reliance Retail & Local Supermarkets require 4 Tons in Coimbatore region.</p>
                  </div>
                  <button 
                    onClick={() => { setShowWizard(true); setFormData({ ...formData, isUpcoming: true }); setWizardStep(1); }}
                    className="bg-[#D9A441] hover:bg-[#c39134] text-[#102820] text-xs font-bold px-4 py-2.5 rounded-xl shrink-0"
                  >
                    Schedule Bulk Harvest
                  </button>
                </div>
              )}
            </>
          )}

          {/* TAB 2: MY PRODUCE */}
          {activeTab === 'inventory' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-gray-900">{t.nav.inventory}</h3>
                  <p className="text-xs text-gray-500">Live products listed on buyer exchange.</p>
                </div>
                <button onClick={() => { setShowWizard(true); setWizardStep(1); }} className="text-xs font-bold text-[#1F6B45] hover:underline">
                  + Add Another Crop
                </button>
              </div>

              <div className="space-y-3">
                {products.map(p => (
                  <div key={p.id} className="p-4 rounded-xl border border-gray-200 bg-[#F7F6F0]/50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{p.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-gray-900">{p.name} {p.local && `(${p.local})`}</h4>
                          <span className="text-[10px] font-bold bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md">
                            {p.channel}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">Available: <strong>{p.qty} {p.unit}</strong> • Rate: <strong className="text-[#1F6B45]">₹{p.price} / kg</strong></p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setProducts(products.filter(item => item.id !== p.id))}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                      title="Delete Crop"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: UPCOMING HARVEST */}
          {activeTab === 'harvest' && profile.preference !== 'retail' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-gray-900">{t.nav.harvest}</h3>
                  <p className="text-xs text-gray-500">Pre-harvest registrations pooled together to fulfill large enterprise contracts.</p>
                </div>
                <button onClick={() => { setShowWizard(true); setFormData({ ...formData, isUpcoming: true }); setWizardStep(1); }} className="text-xs font-bold text-[#1F6B45] hover:underline">
                  + Schedule Harvest
                </button>
              </div>

              <div className="space-y-3">
                {harvests.map(h => (
                  <div key={h.id} className="p-4 rounded-xl border border-emerald-200 bg-[#E8F5EC]/30 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-emerald-100 text-[#1F6B45] px-2 py-0.5 rounded-full">
                          {h.status}
                        </span>
                        <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          {h.channel}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-gray-900 mt-1">{h.name} {h.local && `(${h.local})`}</h4>
                      <p className="text-xs text-gray-500">Expected: <strong>{h.expectedQty} {h.unit}</strong> | Harvest Date: <strong>{h.harvestDate}</strong></p>
                    </div>
                    <button 
                      onClick={() => setHarvests(harvests.filter(item => item.id !== h.id))}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                      title="Remove Harvest"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: LOGISTICS */}
          {activeTab === 'logistics' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-gray-900">{t.nav.logistics}</h3>
              <p className="text-xs text-gray-500">Track incoming pickup trucks and update driver handover state.</p>
              
              <div className="space-y-3">
                {filteredOrders.map(o => (
                  <div key={o.id} className="p-4 rounded-xl border border-gray-200 bg-[#F7F6F0]/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-bold">{o.id}</span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                          o.orderType.includes('Bulk') ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {o.orderType}
                        </span>
                        <span className="text-xs font-semibold text-gray-700">• {o.buyer}</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#1F6B45] mt-1">{o.crop} ({o.qty}) — ₹{o.amount}</h4>
                      <p className="text-xs text-gray-600 mt-0.5">🚚 Assigned Driver: <strong>{o.driver}</strong> | Scheduled Slot: <strong>{o.pickupSlot}</strong></p>
                    </div>
                    <button
                      onClick={() => togglePickup(o.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                        o.status === 'Ready for Pickup' 
                          ? 'bg-[#1F6B45] text-white hover:bg-[#165335]' 
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {o.status === 'Ready for Pickup' ? t.buttons.markReady : t.buttons.markDispatched}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: WALLET */}
          {activeTab === 'wallet' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-gray-900">{t.nav.wallet}</h3>
              <div className="p-5 rounded-2xl bg-[#E8F5EC] border border-emerald-200">
                <p className="text-xs font-bold text-[#1F6B45]">{t.metrics.withdrawable}</p>
                <h2 className="text-3xl font-black text-gray-900 mt-1">₹34,800</h2>
                <button className="mt-3 bg-[#1F6B45] hover:bg-[#165335] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition">
                  {t.buttons.withdraw}
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* 3. PROFILE MODAL */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-[#F7F6F0] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
            <div className="bg-[#1F6B45] text-white p-6 flex justify-between items-start">
              <div>
                <span className="text-2xl">🌱</span>
                <h3 className="text-lg font-bold mt-1">{t.labels.saveProfile}</h3>
                <p className="text-xs text-emerald-200">Update your farm details and supply preferences</p>
              </div>
              <button onClick={() => setIsProfileModalOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>

            <div className="p-6 space-y-4 bg-white">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">{t.labels.fullName}</label>
                <input 
                  type="text" 
                  value={profile.name} 
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full p-2.5 border rounded-xl font-bold text-sm outline-none focus:border-[#1F6B45]" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">{t.labels.phone}</label>
                  <input 
                    type="text" 
                    value={profile.phone} 
                    placeholder="e.g. 98401 12345"
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full p-2.5 border rounded-xl text-xs font-bold outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">{t.labels.district}</label>
                  <input 
                    type="text" 
                    value={profile.district} 
                    placeholder="e.g. Coimbatore, TN"
                    onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                    className="w-full p-2.5 border rounded-xl text-xs font-bold outline-none" 
                  />
                </div>
              </div>

              {/* Selling Preference Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{t.labels.pref}</label>
                <div className="space-y-2">
                  {[
                    { id: 'bulk', title: 'Bulk Only (100kg+)', desc: 'Sell entire yield directly to supermarkets and food factories.' },
                    { id: 'retail', title: 'Small Only (1-50kg)', desc: 'Sell small crates directly to nearby consumers and local shops.' },
                    { id: 'both', title: 'Both (Recommended)', desc: 'Pool main harvest for bulk buyers + list surplus for direct retail.' },
                  ].map(option => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setProfile({ ...profile, preference: option.id })}
                      className={`w-full p-3 rounded-xl border-2 text-left transition flex items-center justify-between ${
                        profile.preference === option.id 
                          ? 'border-[#1F6B45] bg-[#E8F5EC]' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">{option.title}</h4>
                        <p className="text-[11px] text-gray-500">{option.desc}</p>
                      </div>
                      {profile.preference === option.id && <CheckCircle2 className="w-4 h-4 text-[#1F6B45]" />}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleSaveProfile}
                className="w-full py-3 bg-[#1F6B45] hover:bg-[#165335] text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                {t.labels.saveProfile}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. TOUR TOOLTIP OVERLAY */}
      {tourStep > 0 && tourStep <= 4 && (
        <div className="fixed inset-0 bg-black/40 z-30 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border-2 border-[#D9A441] space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <span className="bg-[#D9A441] text-[#102820] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                Step {tourStep} of 4
              </span>
              <button onClick={() => setTourStep(0)} className="text-gray-400 hover:text-gray-700 text-xs font-bold flex items-center gap-1">
                Skip Guide ✕
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900">{t.tour[tourStep - 1].title}</h3>
              <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{t.tour[tourStep - 1].desc}</p>
            </div>

            <div className="p-3 bg-[#F7F6F0] rounded-xl border border-gray-200 text-[11px] text-[#1F6B45] font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-[#D9A441]" />
              <span>{t.tour[tourStep - 1].tip}</span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                disabled={tourStep === 1}
                onClick={() => {
                  const prev = tourStep - 1;
                  setTourStep(prev);
                  if (prev === 2) setActiveTab('inventory');
                  if (prev === 3) setActiveTab('harvest');
                  if (prev === 4) setActiveTab('logistics');
                  if (prev === 1) setActiveTab('dashboard');
                }}
                className="px-4 py-2 text-xs font-bold text-gray-500 disabled:opacity-30"
              >
                Back
              </button>

              <button
                onClick={() => {
                  if (tourStep < 4) {
                    const next = tourStep + 1;
                    setTourStep(next);
                    if (next === 2) setActiveTab('inventory');
                    if (next === 3) setActiveTab('harvest');
                    if (next === 4) setActiveTab('logistics');
                  } else {
                    setTourStep(0);
                    setActiveTab('dashboard');
                  }
                }}
                className="bg-[#1F6B45] hover:bg-[#165335] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition"
              >
                {tourStep === 4 ? 'Finish Guide ✓' : 'Next Step →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. ADD PRODUCE / HARVEST WIZARD */}
      {showWizard && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#F7F6F0] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
            <div className="bg-[#1F6B45] text-white p-5 flex justify-between items-center">
              <h3 className="text-base font-bold">
                {wizardStep === 1 && "1. Select Crop / பயிர் தேர்வு"}
                {wizardStep === 2 && "2. Quantity & Supply Mode"}
                {wizardStep === 3 && "3. Price & Mandi Rate"}
                {wizardStep === 4 && "4. Confirm Listing"}
              </h3>
              <button onClick={() => setShowWizard(false)} className="text-white/80 hover:text-white">✕</button>
            </div>

            <div className="p-6 bg-white min-h-[280px]">
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold text-gray-700">Choose crop:</p>
                    <button 
                      onClick={handleVoiceInput}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 ${
                        isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-[#E8F5EC] text-[#1F6B45]'
                      }`}
                    >
                      <Mic className="w-3.5 h-3.5" /> {isListening ? 'Listening...' : t.buttons.speak}
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {POPULAR_CROPS.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setFormData({ ...formData, crop: c, price: c.mandiPrice })}
                        className={`p-3 rounded-2xl border-2 flex flex-col items-center text-center transition ${
                          formData.crop?.id === c.id ? 'border-[#1F6B45] bg-[#E8F5EC]' : 'border-gray-200'
                        }`}
                      >
                        <span className="text-2xl mb-1">{c.icon}</span>
                        <strong className="text-xs text-gray-900">{lang === 'ta' ? c.local : c.name}</strong>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isUpcoming: false })}
                      className={`p-2.5 rounded-xl border-2 text-xs font-bold ${
                        !formData.isUpcoming ? 'border-[#1F6B45] bg-[#E8F5EC] text-[#1F6B45]' : 'border-gray-200'
                      }`}
                    >
                      📦 Ready Stock
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isUpcoming: true })}
                      className={`p-2.5 rounded-xl border-2 text-xs font-bold ${
                        formData.isUpcoming ? 'border-[#1F6B45] bg-[#E8F5EC] text-[#1F6B45]' : 'border-gray-200'
                      }`}
                    >
                      🌾 Future Harvest
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Total Quantity (kg)</label>
                    <input 
                      type="number" 
                      value={formData.qty} 
                      onChange={(e) => setFormData({ ...formData, qty: Number(e.target.value) })}
                      className="w-full text-center font-bold text-2xl p-2 border-2 border-gray-200 rounded-xl outline-none focus:border-[#1F6B45]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Supply Mode Allocation</label>
                    <select
                      value={formData.channel}
                      onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                      className="w-full p-2 border rounded-xl text-xs font-bold"
                    >
                      <option value="both">Both Bulk Aggregators & Retail Buyers</option>
                      <option value="bulk">Bulk Only (Min 100 kg orders)</option>
                      <option value="retail">Small / Retail Only</option>
                    </select>
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4">
                  <div className="bg-[#E8F5EC] p-3 rounded-xl text-xs">
                    <p className="font-bold text-[#1F6B45]">District Mandi Price: ₹{formData.crop?.mandiPrice || 30} / kg</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Your Direct Price per kg (₹)</label>
                    <input 
                      type="number" 
                      value={formData.price} 
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full text-center font-bold text-3xl p-2 border-2 border-gray-200 rounded-xl outline-none text-[#1F6B45]"
                    />
                  </div>
                </div>
              )}

              {wizardStep === 4 && (
                <div className="p-4 bg-[#F7F6F0] rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between"><span>Produce:</span><strong>{formData.crop?.name}</strong></div>
                  <div className="flex justify-between"><span>Type:</span><strong>{formData.isUpcoming ? 'Future Harvest' : 'Ready Stock'}</strong></div>
                  <div className="flex justify-between"><span>Channel:</span><strong>{formData.channel}</strong></div>
                  <div className="flex justify-between"><span>Total:</span><strong>{formData.qty} kg @ ₹{formData.price}/kg</strong></div>
                  <div className="flex justify-between pt-2 border-t font-bold text-[#1F6B45] text-sm">
                    <span>Gross Value:</span><span>₹{(formData.qty * formData.price).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#F7F6F0] p-4 border-t border-gray-200 flex justify-between">
              {wizardStep > 1 ? (
                <button onClick={() => setWizardStep(wizardStep - 1)} className="px-4 py-2 border rounded-xl text-xs font-bold text-gray-700">Back</button>
              ) : <div />}
              {wizardStep < 4 ? (
                <button 
                  disabled={wizardStep === 1 && !formData.crop}
                  onClick={() => setWizardStep(wizardStep + 1)}
                  className="px-5 py-2 bg-[#1F6B45] text-white rounded-xl text-xs font-bold disabled:opacity-50"
                >
                  Next →
                </button>
              ) : (
                <button onClick={handlePublish} className="px-6 py-2 bg-[#1F6B45] text-white rounded-xl text-xs font-bold">
                  Publish Crop
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}