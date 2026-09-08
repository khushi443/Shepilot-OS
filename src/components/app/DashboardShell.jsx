import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAuth } from "../../context/AuthContext";
import { logout } from "../../firebase/auth";

export default function DashboardShell({ title, subtitle, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Couldn't log out.");
    }
  };

  return (
    <div className="shepilot-app min-h-screen">
      <Sidebar
        currentUser={currentUser}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="lg:pl-64">
        <Topbar
          title={title}
          subtitle={subtitle}
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenMobile={() => setMobileOpen(true)}
        />
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
