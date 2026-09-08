import { motion, useReducedMotion } from 'framer-motion';
import { Bot, Sparkles, Clock, TrendingUp, Zap, ArrowUpRight } from 'lucide-react';
import dashboardImg from '../assets/startup_dashboard.jpg';
import foundersImg from '../assets/diverse_businesswomen.jpg';

const EASE = [0.22, 1, 0.36, 1];

function Tile({ children, className = '', delay = 0 }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: EASE }}
      className={`group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-[0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_0_60px_rgba(206,96,240,0.16)] ${className}`}
    >
      {children}
    </motion.div>
  );
}

function IconChip({ Icon, tint = '#ce60f0' }) {
  if (!Icon) return null;
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-shadow duration-300 group-hover:shadow-[0_0_24px_rgba(206,96,240,0.45)]">
      <Icon className="h-5 w-5" style={{ color: tint }} strokeWidth={2} />
    </div>
  );
}

function Reveal({ children, delay = 0, className = '' }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function FeatureShowcase() {
  return (
    <section id="features" className="relative w-full overflow-hidden bg-[#15192e] py-24 sm:py-32">
      {/* Ambient glows */}
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/4 h-[480px] w-[480px] rounded-full bg-[#464efe]/20 blur-[140px]" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-[#ce60f0]/15 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header — left aligned, asymmetric */}
        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-2xl">
            <p className="font-['Inter'] text-xs font-semibold uppercase tracking-[0.2em] text-[#ce60f0]">
              Features
            </p>
            <h2 className="mt-4 font-['Archivo'] text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl">
              Your entire business,{' '}
              <span className="bg-gradient-to-r from-[#ce60f0] to-[#464efe] bg-clip-text text-transparent">
                one intelligent OS
              </span>
            </h2>
            <p className="mt-5 max-w-xl font-['Inter'] text-base leading-relaxed text-white/60">
              ShePilot OS replaces the patchwork of spreadsheets, courses, and guesswork with a single
              system that plans, forecasts, and coaches — built for first-time women founders.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="hidden lg:block">
            <a
              href="#pricing"
              className="group/link inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-['Inter'] text-sm font-medium text-white/80 backdrop-blur-md transition-all duration-300 hover:border-[#ce60f0]/40 hover:text-white hover:shadow-[0_0_30px_rgba(206,96,240,0.25)]"
            >
              See it in the plans
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </a>
          </Reveal>
        </div>

        {/* Bento grid — unequal tiles, never uniform */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:auto-rows-[minmax(220px,auto)]">
          {/* Large feature tile — 2x2 */}
          <Tile className="min-h-[440px] lg:col-span-2 lg:row-span-2" delay={0}>
            <img
              src={dashboardImg}
              alt="ShePilot OS live dashboard preview"
              className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#15192e] via-[#15192e]/70 to-[#15192e]/10" />
            <div className="absolute right-6 top-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ce60f0] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ce60f0]" />
              </span>
              <span className="font-['Inter'] text-xs font-medium text-white/85">Launch readiness · 92%</span>
            </div>
            <div className="relative flex h-full flex-col justify-end p-8 sm:p-10">
              <IconChip Icon={Bot} />
              <h3 className="mt-5 font-['Archivo'] text-2xl font-extrabold text-white sm:text-3xl">
                Meet your AI Co-Pilot
              </h3>
              <p className="mt-3 max-w-md font-['Inter'] text-sm leading-relaxed text-white/65">
                Ask anything — pricing, positioning, paperwork. The co-pilot turns first-time founder
                questions into a clear, step-by-step operating plan you can act on today.
              </p>
              <a
                href="#how"
                className="group/link mt-6 inline-flex w-fit items-center gap-2 font-['Inter'] text-sm font-semibold text-[#ce60f0] transition-colors duration-200 hover:text-white"
              >
                See how it works
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </a>
            </div>
          </Tile>

          {/* Mini feature — wide */}
          <Tile className="min-h-[220px] p-8 lg:col-span-2" delay={0.1}>
            <IconChip Icon={Sparkles} />
            <h3 className="mt-5 font-['Archivo'] text-xl font-bold text-white">
              Business blueprints in minutes
            </h3>
            <p className="mt-2 max-w-md font-['Inter'] text-sm leading-relaxed text-white/60">
              Answer five questions. Get a validated business model, brand direction, and a 90-day
              roadmap tailored to your market.
            </p>
          </Tile>

          {/* Stat tile */}
          <Tile className="flex min-h-[200px] flex-col justify-between p-7" delay={0.18}>
            <IconChip Icon={Clock} tint="#464efe" />
            <div>
              <p className="font-['Archivo'] text-4xl font-extrabold text-white">
                12<span className="text-[#ce60f0]">hrs</span>
              </p>
              <p className="mt-2 font-['Inter'] text-sm leading-relaxed text-white/55">
                saved weekly on planning and admin busywork
              </p>
            </div>
          </Tile>

          {/* Stat tile */}
          <Tile className="flex min-h-[200px] flex-col justify-between p-7" delay={0.24}>
            <IconChip Icon={TrendingUp} tint="#464efe" />
            <div>
              <p className="font-['Archivo'] text-4xl font-extrabold text-white">
                3.4<span className="text-[#ce60f0]">x</span>
              </p>
              <p className="mt-2 font-['Inter'] text-sm leading-relaxed text-white/55">
                faster to first revenue than going it alone
              </p>
            </div>
          </Tile>

          {/* Quote + image tile — wide */}
          <Tile className="min-h-[260px] lg:col-span-2" delay={0.3}>
            <img
              src={foundersImg}
              alt="Women entrepreneurs collaborating"
              className="absolute inset-0 h-full w-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#15192e] via-[#15192e]/60 to-[#15192e]/20" />
            <div className="relative flex h-full flex-col justify-end p-8">
              <p className="font-['Archivo'] text-xl font-bold leading-snug text-white sm:text-2xl">
                “ShePilot turned my napkin sketch into a funded launch plan in one weekend.”
              </p>
              <p className="mt-4 font-['Inter'] text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                Amara O. — Founder, Bloom &amp; Co.
              </p>
            </div>
          </Tile>

          {/* Mini feature — wide */}
          <Tile className="min-h-[220px] p-8 lg:col-span-2" delay={0.36}>
            <IconChip Icon={Zap} />
            <h3 className="mt-5 font-['Archivo'] text-xl font-bold text-white">Finance autopilot</h3>
            <p className="mt-2 max-w-md font-['Inter'] text-sm leading-relaxed text-white/60">
              Cash-flow forecasts, pricing guidance, and runway alerts — explained in plain language,
              never a spreadsheet.
            </p>
          </Tile>
        </div>
      </div>
    </section>
  );
}
