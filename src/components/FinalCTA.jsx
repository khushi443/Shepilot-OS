import { motion } from 'framer-motion';
import { ArrowRight, Check, Sparkles } from 'lucide-react';

// Smooth-scroll helper for in-page section jumps (#pricing / #features exist on Home).
const scrollToId = (id) => {
  const el = typeof document !== 'undefined' ? document.getElementById(id) : null;
  if (!el) return;
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
};

const TRUST_POINTS = ['No credit card required', 'Free 14-day trial', 'Cancel anytime'];

export default function FinalCTA() {
  return (
    <section aria-label="Get started with ShePilot OS" className="relative w-full px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-white/10 bg-[#15192e] shadow-[0_8px_24px_rgba(0,0,0,0.2),0_32px_80px_rgba(0,0,0,0.5)]"
      >
        {/* Ambient brand glows + glass sheen */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-32 h-96 w-96 rounded-full bg-[#464efe]/30 blur-[120px]" />
          <div className="absolute -bottom-40 -right-16 h-[28rem] w-[28rem] rounded-full bg-[#ce60f0]/25 blur-[140px]" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
        </div>

        <div className="relative flex flex-col gap-10 p-10 sm:p-14 lg:flex-row lg:items-center lg:justify-between lg:p-16">
          {/* Copy — left-aligned per layout plan */}
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-['Inter'] text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#ce60f0]" aria-hidden="true" />
              ShePilot OS
            </span>

            <h2 className="mt-6 font-['Archivo'] text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl">
              Your business co-pilot is ready when you are.
            </h2>

            <p className="mt-5 font-['Inter'] text-base leading-relaxed text-white/65 sm:text-lg">
              Join first-time women entrepreneurs turning ideas into operating
              businesses — with AI handling the heavy lifting from day one.
            </p>

            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
              {TRUST_POINTS.map((point) => (
                <li key={point} className="flex items-center gap-2 font-['Inter'] text-sm text-white/60">
                  <Check className="h-4 w-4 text-[#ce60f0]" strokeWidth={2.5} aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions — pure frontend: smooth-scroll to on-page sections */}
          <div className="flex flex-col items-stretch gap-4 sm:flex-row lg:flex-col lg:items-end">
            <motion.button
              type="button"
              onClick={() => scrollToId('pricing')}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="group inline-flex items-center justify-center gap-2 rounded-[32px] bg-gradient-to-r from-[#464efe] to-[#ce60f0] px-8 py-3.5 font-['Inter'] text-base font-semibold text-white shadow-[0_8px_24px_rgba(70,78,254,0.35)] transition-all duration-300 hover:shadow-[0_0_44px_rgba(206,96,240,0.5)]"
            >
              Start Building Free
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </motion.button>

            <motion.button
              type="button"
              onClick={() => scrollToId('features')}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="inline-flex items-center justify-center gap-2 rounded-[32px] border border-white/20 bg-transparent px-8 py-3.5 font-['Inter'] text-base font-semibold text-white/85 transition-all duration-300 hover:border-[#ce60f0]/60 hover:bg-white/10 hover:text-white"
            >
              Explore Features
            </motion.button>

            <p className="text-center font-['Inter'] text-xs text-white/40 lg:text-right">
              Set up in under 5 minutes.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
