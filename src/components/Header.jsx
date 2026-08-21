import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout } from "../firebase/auth";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, ArrowRight } from 'lucide-react';

// Exact nav links from design spec (order + labels preserved)
const NAV_LINKS = [
  { label: 'Features', route: '#features' },
  { label: 'How It Works', route: '#how' },
  { label: 'Pricing', route: '#pricing' },
  { label: 'FAQ', route: '#faq' },
];

const scrollToSection = (hash) => {
  const id = (hash || '').replace('#', '');
  const el = typeof document !== 'undefined' ? document.getElementById(id) : null;
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if (typeof window !== 'undefined') {
    window.location.hash = hash;
  }
};

export default function Header() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleNav = (hash) => {
    setMenuOpen(false);
    scrollToSection(hash);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? 'bg-[rgba(21,25,46,0.72)] backdrop-blur-xl border-b border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.2)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Brand */}
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              if (typeof window !== 'undefined') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-3 group"
            aria-label="ShePilot OS — back to top"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-2xl bg-gradient-to-br from-[#464efe] to-[#ce60f0] shadow-[0_4px_16px_rgba(70,78,254,0.4)] transition-shadow duration-300 group-hover:shadow-[0_4px_24px_rgba(206,96,240,0.55)]">
              <Sparkles className="text-white" size={18} strokeWidth={2.2} />
            </span>
            <span className="font-['Archivo'] font-extrabold text-lg tracking-tight text-white">
              ShePilot{' '}
              <span className="bg-gradient-to-r from-[#464efe] to-[#ce60f0] bg-clip-text text-transparent">
                OS
              </span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <motion.button
                key={link.route}
                type="button"
                whileHover={{ y: -1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                onClick={() => handleNav(link.route)}
                className="relative px-4 py-2 font-['Inter'] text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 rounded-full hover:bg-white/5"
              >
                {link.label}
              </motion.button>
            ))}
          </nav>

          {/* Desktop CTA — points at the declared #pricing section */}
          <div className="hidden lg:flex items-center gap-3">

  {currentUser ? (

    <>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/dashboard")}
        className="px-6 py-2.5 rounded-full border border-white/20 text-white hover:bg-white/10"
      >
        Dashboard
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        onClick={async () => {
          await logout();
          navigate("/");
        }}
        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white"
      >
        Logout
      </motion.button>
    </>

  ) : (

    <>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/login")}
        className="px-6 py-2.5 rounded-full border border-white/20 text-white hover:bg-white/10"
      >
        Login
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/signup")}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#464efe] to-[#ce60f0] text-white font-semibold"
      >
        Get Started
        <ArrowRight size={16} />
      </motion.button>
    </>

  )}

</div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer — same nav links + CTA, no divergence */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            key="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden bg-[rgba(21,25,46,0.95)] backdrop-blur-xl border-b border-white/10"
            aria-label="Mobile"
          >
            <div className="px-6 py-4 flex flex-col">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.route}
                  type="button"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.25 }}
                  onClick={() => handleNav(link.route)}
                  className="text-left px-2 py-3.5 font-['Inter'] text-base font-medium text-white/75 hover:text-white border-b border-white/5 last:border-b-0 transition-colors duration-200"
                >
                  {link.label}
                </motion.button>
              ))}

              <div className="flex items-center gap-3 pt-4 mt-2 border-t border-white/10">
                {currentUser ? (
                  <>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/dashboard");
                      }}
                      className="flex-1 px-5 py-2.5 rounded-full border border-white/20 text-white hover:bg-white/10 transition"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={async () => {
                        setMenuOpen(false);
                        await logout();
                        navigate("/");
                      }}
                      className="flex-1 px-5 py-2.5 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/login");
                      }}
                      className="flex-1 px-5 py-2.5 rounded-full border border-white/20 text-white hover:bg-white/10 transition"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/signup");
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#464efe] to-[#ce60f0] text-white font-semibold"
                    >
                      Get Started
                      <ArrowRight size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
