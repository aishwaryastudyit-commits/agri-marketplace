import { useState } from "react";
import { ArrowLeft, Leaf, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./roleSelection.css";
import { registerLogisticsWorker, startWorkerSession, upsertFarmer } from "../services/annamService";

const roleDetails = {
  farmer: { title: "Farmer login", subtitle: "Enter your mobile number to access your farm workspace.", destination: "/farmer", icon: Leaf },
  worker: { title: "Logistics worker login", subtitle: "Enter your mobile number to access delivery operations.", destination: "/worker", icon: Truck }
};

export default function RoleLogin({ role, onLogin }) {
  const navigate = useNavigate();
  const details = roleDetails[role];
  const Icon = details.icon;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");

  const sendOtp = () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setMessage("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    setOtpSent(true);
    setOtp("");
    setMessage("Verification code sent. Use demo code 123456.");
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!name.trim() || !/^[6-9]\d{9}$/.test(phone) || otp !== "123456") {
      setMessage("Enter your name, a valid mobile number, and code 123456.");
      return;
    }
    try {
      let profile;
      if (role === "farmer") {
        profile = await upsertFarmer({ full_name: name.trim(), phone, location: null });
      } else {
        const account = await startWorkerSession({ full_name: name.trim(), phone });
        const { worker } = await registerLogisticsWorker({
          full_name: name.trim(),
          phone,
          vehicle_registration: `ANNAM-${phone.slice(-4)}`,
          vehicle_type: "Delivery Van",
          capacity_kg: 2000,
        });
        profile = { ...account, worker_id: worker.id };
      }
      onLogin({ ...profile, name: profile.full_name, role });
      navigate(details.destination, { replace: true });
    } catch (error) {
      setMessage(error.message || "We could not save your profile. Is the API running?");
    }
  };

  return (
    <main className="role-login">
      <button className="role-back-button" type="button" onClick={() => navigate("/")}><ArrowLeft size={17} /> Back to role selection</button>
      <section className="role-login-panel" aria-labelledby="role-login-title">
        <div className="role-login-icon"><Icon size={28} /></div>
        <p className="role-gateway-kicker">ANNAM {role.toUpperCase()} WORKSPACE</p>
        <h1 id="role-login-title">{details.title}</h1>
        <p className="role-gateway-intro">{details.subtitle}</p>
        {message && <p className="role-login-message" role="status">{message}</p>}
        <form className="role-login-form" onSubmit={submit}>
          <label>Full name<input value={name} onChange={(event) => setName(event.target.value)} required /></label>
          <label>Mobile number<input inputMode="numeric" maxLength={10} value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))} required /></label>
          <button className="role-otp-button" type="button" onClick={sendOtp}>{otpSent ? "Resend verification code" : "Send verification code"}</button>
          {otpSent && <label>Verification code<input autoFocus inputMode="numeric" type="text" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="123456" required /></label>}
          <button className="role-submit-button" type="submit">Continue to workspace</button>
        </form>
      </section>
    </main>
  );
}
