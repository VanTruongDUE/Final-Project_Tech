import { useState } from "react";
import { Eye } from "lucide-react";
import "../styles/fonts.css";
import "../styles/theme.css";
import { Landing } from "./components/auth/Landing";
import { CustomerApp } from "./components/customer/CustomerApp";
import { SellerApp } from "./components/seller/SellerScreens";
import { AdminApp } from "./components/admin/AdminScreens";
import { ShipperApp } from "./components/shipper/ShipperScreens";
import { DesignCanvas } from "./components/DesignCanvas";

type Role = "customer" | "seller" | "admin" | "shipper";

export default function App() {
  const [role, setRole] = useState<Role | null>(null);
  const [canvas, setCanvas] = useState(true);
  const logout = () => { setRole(null); setCanvas(true); };

  if (canvas) return <DesignCanvas onExit={() => setCanvas(false)} />;

  return (
    <>
      {!role && <Landing onSelect={(r) => setRole(r as Role)} />}
      {role === "customer" && <CustomerApp onLogout={logout} />}
      {role === "seller" && <SellerApp onLogout={logout} />}
      {role === "admin" && <AdminApp onLogout={logout} />}
      {role === "shipper" && <ShipperApp onLogout={logout} />}

      <button
        onClick={() => setCanvas(true)}
        className="fixed bottom-5 right-5 z-[100] bg-brand-gradient text-white px-5 py-3 rounded-full font-medium shadow-pop flex items-center gap-2 hover:scale-105 transition"
      >
        <Eye size={18} /> Quay lại Design Canvas
      </button>
    </>
  );
}
