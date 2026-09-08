import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Cpu, Rocket } from 'lucide-react';

const LOGOS = [
  { name: 'Built for Shepreneurs Hackathon', icon: Sparkles, wordmark: "font-['Archivo'] font-extrabold tracking-tight" },
  { name: 'Early Access', icon: Rocket, wordmark: "font-['Inter'] font-semibold tracking-wide" },
  { name: 'Beta Version', icon: ShieldCheck, wordmark: "font-['Archivo'] font-bold uppercase tracking-[0.22em] text-sm" },
  { name: 'Powered by React + Firebase + AI', icon: Cpu, wordmark: "font-['Inter'] font-medium tracking-tight" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function TrustedByStrip() {
  return (
    <section className="relative w-full overflow-hidden bg-[#15192e] px-6 py-20 sm:py-24">
      {/* Ambient accent glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-[#464efe] opacity-[0.12] blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#ce60f0] opacity-[0.10] blur-[140px]"
      />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[32px] border border-white/10 bg-white/[0.04] px-8 py-12 backdrop-blur-xl sm:px-12"
          style={{
            boxShadow:
              '0 1px 2px rgba(0,0,0,0.2), 0 8px 24px rgba(0,0,0,0.25), 0 24px 64px rgba(0,0,0,0.35)',
          }}
        >
          {/* Eyebrow label */}
          <div className="mb-10 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#ce60f0]/60" />
            <p className="text-center font-['Inter'] text-xs font-semibold uppercase tracking-[0.24em] text-white/50">
              A real product demo — built for first-time founders
            </p>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#ce60f0]/60" />
          </div>

          {/* Logo row */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-2 items-center gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6"
          >
            {(LOGOS ?? []).map((logo) => {
              const Icon = logo.icon;
              return (
                <motion.div
                  key={logo.name}
                  variants={item}
                  whileHover={{ y: -3 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="group flex cursor-default items-center justify-center gap-2 text-white/40 transition-colors duration-300 hover:text-white/90"
                  style={{ transition: 'color 0.33s cubic-bezier(0.25,0.1,0.25,1)' }}
                >
                  <Icon
                    className="h-4 w-4 shrink-0 transition-all duration-300 group-hover:text-[#ce60f0] group-hover:drop-shadow-[0_0_10px_rgba(206,96,240,0.6)]"
                    strokeWidth={1.75}
                  />
                  <span className={`text-base leading-none ${logo.wordmark}`}>{logo.name}</span>
                </motion.div>
              );
            })}
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
