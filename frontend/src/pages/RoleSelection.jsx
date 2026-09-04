import { BriefcaseBusiness, Leaf, ShoppingBasket, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./roleSelection.css";

const roles = [
  { key: "buyer", title: "Buyer", description: "Shop fresh produce from verified farmers.", icon: ShoppingBasket, path: "/login" },
  { key: "farmer", title: "Farmer", description: "List your harvest and manage farm orders.", icon: Leaf, path: "/farmer-login" },
  { key: "worker", title: "Logistics Worker", description: "Manage pickups, delivery jobs, and routes.", icon: Truck, path: "/worker-login" },
  { key: "bulk-buyer", title: "Bulk Buyer", description: "Source reliable volumes for your business.", icon: BriefcaseBusiness, path: "/bulk-login" }
];

export default function RoleSelection() {
  const navigate = useNavigate();
  return (
    <main className="role-gateway">
      <section className="role-gateway-panel" aria-labelledby="role-title">
        <div className="role-gateway-mark">A</div>
        <p className="role-gateway-kicker">ANNAM MARKETPLACE</p>
        <h1 id="role-title">How are you joining today?</h1>
        <p className="role-gateway-intro">Choose your workspace to continue.</p>
        <div className="role-grid">
          {roles.map(({ key, title, description, icon: Icon, path }) => (
            <button className={`role-card role-card-${key}`} key={key} type="button" onClick={() => navigate(path)}>
              <span className="role-card-icon" aria-hidden="true"><Icon size={25} strokeWidth={1.8} /></span>
              <span className="role-card-copy"><strong>{title}</strong><span>{description}</span></span>
              <span className="role-card-arrow" aria-hidden="true">→</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
