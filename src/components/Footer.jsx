import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

// Exact link set from design spec (footer_links) — in-page section anchors on Home.
const FOOTER_LINKS = [
  { label: 'About', route: '#about' },
  { label: 'Features', route: '#features' },
  { label: 'Pricing', route: '#pricing' },
  { label: 'Contact', route: '#contact' },
];

// External socials — inline SVG only (lucide brand icons are removed from core).
const SOCIALS = [
  {
    name: 'X',
    href: 'https://x.com/shepilotos',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/shepilotos',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/shepilotos',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

export default function Footer() {
  const reduceMotion = useReducedMotion();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Pure frontend behavior only — validates locally, no network call.
  const handleSubscribe = (e) => {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubscribed(true);
  };

  const reveal = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-40px' },
        transition: { duration: 0.5, ease: 'easeOut' },
      };

  return (
    <motion.footer
      {...reveal}
      className="relative w-full bg-[#0f1326] font-['Inter'] text-white"
    >
      {/* Gradient hairline divider */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(70,78,254,0.6) 35%, rgba(206,96,240,0.6) 65%, transparent 100%)',
        }}
      />

      <div className="mx-auto max-w-7xl px-6 pb-10 pt-16 lg:px-10 lg:pt-20">
        {/* Top: oversized brand + newsletter */}
        <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="font-['Archivo'] text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(100deg, #ffffff 20%, #464efe 60%, #ce60f0 100%)' }}
              >
                ShePilot OS
              </span>
            </p>
            <p className="mt-4 text-base leading-relaxed text-white/60">
              The AI Operating System for First-Time Women Entrepreneurs
            </p>
          </div>

          {/* Newsletter — local validation + local success state only */}
          <div className="w-full max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-white/50">
              Launch updates
            </p>
            {subscribed ? (
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#464efe]/20 text-[#ce60f0]">
                  <Check className="h-4 w-4" />
                </span>
                <p className="text-sm text-white/80">
                  You&rsquo;re on the list — we&rsquo;ll be in touch soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-4" noValidate>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1.5 backdrop-blur-xl transition-colors focus-within:border-white/25">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="you@yourventure.com"
                    aria-label="Email address"
                    className="w-full bg-transparent px-4 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none"
                  />
                  <motion.button
                    type="submit"
                    whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="flex shrink-0 items-center gap-2 rounded-full bg-[#464efe] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_24px_rgba(70,78,254,0.55)]"
                  >
                    Notify me
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </div>
                {error && <p className="mt-2 px-4 text-xs text-[#ce60f0]">{error}</p>}
              </form>
            )}
          </div>
        </div>

        {/* Middle: explore links in a single refined row */}
        <nav aria-label="Footer" className="mt-14 border-t border-white/10 pt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-white/50">
            Explore
          </p>
          <ul className="mt-5 flex flex-wrap gap-x-10 gap-y-4">
            {FOOTER_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.route}
                  className="group relative text-sm font-medium text-white/60 transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-[#464efe] to-[#ce60f0] transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} ShePilot OS. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {SOCIALS.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                whileHover={reduceMotion ? undefined : { y: -2 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 backdrop-blur-xl transition-all duration-300 hover:border-[#ce60f0]/40 hover:text-white hover:shadow-[0_0_18px_rgba(206,96,240,0.35)]"
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
