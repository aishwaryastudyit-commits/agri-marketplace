import { useNavigate } from "react-router-dom";

const AI_ENGINE_URL = import.meta.env.VITE_AI_ENGINE_URL || "http://127.0.0.1:8001";

export default function AIInsights({ role, profile }) {
  const navigate = useNavigate();
  const backTo = role === "bulk" ? "/bulk-marketplace" : "/marketplace";
  const context = new URLSearchParams({
    role: role === "bulk" ? "bulk_buyer" : "consumer",
    location: profile?.location || "Coimbatore",
  });

  return (
    <main style={{ minHeight: "100vh", background: "#f7faf7", padding: "20px" }}>
      <header style={{ maxWidth: "1440px", margin: "0 auto 14px", display: "flex", gap: "12px", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
        <div>
          <p style={{ color: "#15803d", fontWeight: 800, margin: 0 }}>ANNAM AI ENGINE</p>
          <h1 style={{ margin: "4px 0" }}>Demand, matching, and market intelligence</h1>
          <p style={{ margin: 0, color: "#475569" }}>Insights are tailored for {profile?.location || "your selected location"}.</p>
        </div>
        <button type="button" className="secondary-btn" onClick={() => navigate(backTo)}>Back to marketplace</button>
      </header>
      <iframe
        title="ANNAM AI Engine"
        src={`${AI_ENGINE_URL}/?${context}`}
        style={{ display: "block", width: "100%", maxWidth: "1440px", height: "calc(100vh - 150px)", minHeight: "650px", margin: "0 auto", border: "1px solid #bbf7d0", borderRadius: "16px", background: "white" }}
      />
    </main>
  );
}
