import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  Sparkles,
  Rocket,
  History,
  Lightbulb,
  SearchCheck,
  Grid3x3,
  Wallet,
  Megaphone,
  Presentation,
  Map,
  Bot,
  HelpCircle,
  Settings,
  X,
} from "lucide-react";
import Avatar from "./Avatar";

const PRIMARY_NAV = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "AI Workspace", to: "/dashboard#ai-workspace", icon: Sparkles, match: "ai-workspace" },
  { label: "Startup Journey", to: "/dashboard#startup-journey", icon: Rocket, match: "startup-journey" },
  { label: "Activity History", to: "/history", icon: History },
];

const WORKSPACE_NAV = [
  { label: "Business Idea", to: "/business-idea", icon: Lightbulb },
  { label: "Market Validation", to: "/startup-validator", icon: SearchCheck },
  { label: "Business Canvas", to: "/startup-canvas", icon: Grid3x3 },
  { label: "Finance Planner", to: "/finance", icon: Wallet },
  { label: "Content Studio", to: "/marketing", icon: Megaphone },
  { label: "Pitch Deck", to: "/pitch", icon: Presentation },
  { label: "Launch Roadmap", to: "/roadmap", icon: Map },
  { label: "AI Mentor", to: "/mentor", icon: Bot },
];

function NavItem({ item, active, onNavigate }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`group flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13.5px] font-medium transition-colors duration-150 ${
        active
          ? "bg-[var(--sp-primary-soft)] text-[var(--sp-primary-dark)]"
          : "text-[var(--sp-text-muted)] hover:bg-[var(--sp-surface-muted)] hover:text-[var(--sp-text)]"
      }`}
    >
      <Icon
        size={17}
        strokeWidth={2}
        className={active ? "text-[var(--sp-primary)]" : "text-[var(--sp-text-faint)] group-hover:text-[var(--sp-text-muted)]"}
      />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function SidebarContent({ currentUser, onLogout, onNavigate }) {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const hash = location.hash.replace("#", "");

  const isActive = (item) => {
    if (item.match) return path === "/dashboard" && hash === item.match;
    if (item.exact) return path === "/dashboard" && !hash;
    return path === item.to;
  };

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[var(--sp-primary)] text-white shadow-sm">
          <Sparkles size={16} strokeWidth={2.25} />
        </div>
        <span className="text-[15px] font-bold tracking-tight text-[var(--sp-text)]">
          ShePilot <span className="text-[var(--sp-primary)]">OS</span>
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3">
        <div className="space-y-0.5">
          {PRIMARY_NAV.map((item) => (
            <NavItem key={item.label} item={item} active={isActive(item)} onNavigate={onNavigate} />
          ))}
        </div>

        <p className="mt-6 mb-2 px-3 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-[var(--sp-text-faint)]">
          Workspace
        </p>
        <div className="space-y-0.5">
          {WORKSPACE_NAV.map((item) => (
            <NavItem key={item.label} item={item} active={path === item.to} onNavigate={onNavigate} />
          ))}
        </div>
      </nav>

      <div className="px-3 pb-3">
        <div className="space-y-0.5 border-t border-[var(--sp-border)] pt-3">
          <button
            onClick={() => toast("Help & Support is coming soon.")}
            className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-[13.5px] font-medium text-[var(--sp-text-muted)] transition-colors hover:bg-[var(--sp-surface-muted)] hover:text-[var(--sp-text)]"
          >
            <HelpCircle size={17} className="text-[var(--sp-text-faint)]" />
            Help &amp; Support
          </button>
          <button
            onClick={() => toast("Settings are coming soon.")}
            className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-[13.5px] font-medium text-[var(--sp-text-muted)] transition-colors hover:bg-[var(--sp-surface-muted)] hover:text-[var(--sp-text)]"
          >
            <Settings size={17} className="text-[var(--sp-text-faint)]" />
            Settings
          </button>
        </div>

        {/* Profile */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-2 flex w-full items-center gap-2.5 rounded-[10px] border border-[var(--sp-border)] bg-[var(--sp-surface)] px-3 py-2.5 text-left transition-colors hover:bg-[var(--sp-surface-muted)]"
        >
          <Avatar user={currentUser} size={32} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-[var(--sp-text)]">
              {currentUser?.displayName || "Founder"}
            </p>
            <p className="truncate text-[11.5px] text-[var(--sp-text-faint)]">
              {currentUser?.email}
            </p>
          </div>
        </button>
        <button
          onClick={onLogout}
          className="mt-1.5 w-full rounded-[10px] px-3 py-2 text-center text-[12.5px] font-medium text-[var(--sp-text-faint)] transition-colors hover:bg-[var(--sp-danger-soft)] hover:text-[var(--sp-danger)]"
        >
          Log out
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ currentUser, onLogout, mobileOpen, onCloseMobile }) {
  return (
    <>
      {/* Desktop sidebar — fixed, always visible at lg+ */}
      <aside
        className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col border-r border-[var(--sp-border)]"
        style={{ background: "var(--sp-surface)" }}
      >
        <SidebarContent currentUser={currentUser} onLogout={onLogout} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[80vw] flex-col border-r border-[var(--sp-border)] lg:hidden"
              style={{ background: "var(--sp-surface)" }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
            >
              <button
                onClick={onCloseMobile}
                aria-label="Close navigation"
                className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[var(--sp-text-muted)] hover:bg-[var(--sp-surface-muted)]"
              >
                <X size={18} />
              </button>
              <SidebarContent currentUser={currentUser} onLogout={onLogout} onNavigate={onCloseMobile} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export { PRIMARY_NAV, WORKSPACE_NAV };
