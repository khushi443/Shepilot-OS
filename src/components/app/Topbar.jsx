import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, ChevronDown, LogOut } from "lucide-react";
import Avatar from "./Avatar";

export default function Topbar({ title, subtitle, currentUser, onLogout, onOpenMobile }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b px-4 py-3.5 sm:px-6"
      style={{ background: "var(--sp-surface)", borderColor: "var(--sp-border)" }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-[var(--sp-text-muted)] hover:bg-[var(--sp-surface-muted)] lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={19} />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-[15px] font-semibold text-[var(--sp-text)] sm:text-base">
            {title}
          </h1>
          {subtitle && (
            <p className="hidden truncate text-[12px] text-[var(--sp-text-faint)] sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => navigate("/history")}
          className="flex h-9 w-9 items-center justify-center rounded-[10px] text-[var(--sp-text-muted)] transition-colors hover:bg-[var(--sp-surface-muted)]"
          aria-label="Notifications"
          title="Recent activity"
        >
          <Bell size={18} />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-[10px] py-1 pl-1 pr-2 transition-colors hover:bg-[var(--sp-surface-muted)]"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <Avatar user={currentUser} size={30} />
            <span className="hidden max-w-[140px] truncate text-[13px] font-medium text-[var(--sp-text)] sm:inline">
              {currentUser?.displayName || currentUser?.email?.split("@")[0]}
            </span>
            <ChevronDown size={14} className="hidden text-[var(--sp-text-faint)] sm:inline" />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-11 w-52 overflow-hidden rounded-[12px] border py-1 shadow-lg"
              style={{ background: "var(--sp-surface)", borderColor: "var(--sp-border)", boxShadow: "var(--sp-shadow-lg)" }}
            >
              <div className="border-b px-3.5 py-2.5" style={{ borderColor: "var(--sp-border)" }}>
                <p className="truncate text-[12.5px] font-semibold text-[var(--sp-text)]">
                  {currentUser?.displayName || "Founder"}
                </p>
                <p className="truncate text-[11.5px] text-[var(--sp-text-faint)]">
                  {currentUser?.email}
                </p>
              </div>
              <button
                onClick={onLogout}
                role="menuitem"
                className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-[13px] font-medium text-[var(--sp-danger)] hover:bg-[var(--sp-danger-soft)]"
              >
                <LogOut size={15} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
