import { useRef } from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { Lightbulb, Compass, Rocket, TrendingUp, ArrowRight, Check } from 'lucide-react';

const STEPS = [
  {
    icon: Lightbulb,
    title: 'Share your vision',
    body: "Answer a short, conversational intake about your idea, your strengths, and the life you're building around it. No 40-tab spreadsheets, no MBA jargon.",
    outcome: 'A crisp one-page business thesis',
  },
  {
    icon: Compass,
    title: 'Receive your flight plan',
    body: "ShePilot's AI drafts your personalized roadmap — business model, pricing, positioning, and the exact order to tackle your first 90 days.",
    outcome: 'A 90-day roadmap, sequenced for you',
  },
  {
    icon: Rocket,
    title: 'Launch in guided sprints',
    body: 'Execute week by week with an AI copilot beside you — sales scripts, landing-page copy, and hard decisions unblocked in minutes, not months.',
    outcome: 'Scripts, templates & copy on demand',
  },
  {
    icon: TrendingUp,
    title: 'Grow with live insight',
    body: "Your dashboard tracks revenue, audience, and momentum. When the data shifts, ShePilot reroutes the plan — you're never flying blind.",
    outcome: 'A dashboard that reroutes as you learn',
  },
];

const EASE = [0.22, 1, 0.36, 1];

export default function HowItWorksSteps() {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 0.75', 'end 0.55'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });

  return (
    <section id="how" className="relative overflow-hidden bg-[#15192e] py-24 font-['Inter'] sm:py-32">
      {/* Ambient glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-[#464efe]/20 blur-[140px]" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[460px] w-[460px] rounded-full bg-[#ce60f0]/15 blur-[160px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          {/* Sticky intro column */}
          <div className="lg:col-span-5">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, ease: EASE }}
              className="lg:sticky lg:top-28"
            >
              <span className="inline-flex items-center rounded-full border border-[#ce60f0]/30 bg-[#ce60f0]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ce60f0]">
                How it works
              </span>
              <h2 className="mt-6 font-['Archivo'] text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl">
                From first idea to first revenue, in four moves.
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-[#9aa3bd]">
                ShePilot OS turns the overwhelming solo-founder journey into a guided flight plan —
                you always know the next move, and exactly why it matters.
              </p>
              <a
                href="#pricing"
                className="mt-9 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#464efe] to-[#ce60f0] px-8 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(70,78,254,0.35)] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(206,96,240,0.5)] hover:brightness-110 active:scale-95"
              >
                See launch plans
                <ArrowRight className="h-4 w-4" />
              </a>
              <p className="mt-4 text-xs text-[#6d7590]">No credit card needed — chart your first route free.</p>
            </motion.div>
          </div>

          {/* Steps track */}
          <div className="lg:col-span-7">
            <div ref={trackRef} className="relative">
              {/* Rail + scroll progress */}
              <div aria-hidden="true" className="absolute bottom-6 left-[27px] top-6 w-px bg-white/10" />
              <motion.div
                aria-hidden="true"
                style={reduceMotion ? undefined : { scaleY: progress }}
                className="absolute bottom-6 left-[27px] top-6 w-px origin-top bg-gradient-to-b from-[#464efe] via-[#8f57f7] to-[#ce60f0] shadow-[0_0_12px_rgba(206,96,240,0.6)]"
              />

              <ol className="space-y-6">
                {STEPS.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <motion.li
                      key={step.title}
                      initial={reduceMotion ? false : { opacity: 0, y: 32 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                      className="relative pl-20"
                    >
                      {/* Node */}
                      <div className="absolute left-0 top-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-[#1b2140]/90 shadow-[0_0_24px_rgba(70,78,254,0.35)] backdrop-blur-xl">
                        <Icon className="h-6 w-6 text-[#ce60f0]" strokeWidth={1.8} />
                      </div>

                      {/* Card */}
                      <motion.div
                        whileHover={reduceMotion ? undefined : { y: -4 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                        className="group rounded-[2rem] border border-white/10 bg-white/[0.05] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-[box-shadow,border-color] duration-300 hover:border-[#ce60f0]/40 hover:shadow-[0_24px_70px_rgba(0,0,0,0.5),0_0_40px_rgba(206,96,240,0.18)] sm:p-8"
                      >
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ce60f0]">
                            Step {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="font-['Archivo'] text-3xl font-extrabold leading-none text-white/10 transition-colors duration-300 group-hover:text-white/20">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <h3 className="mt-3 font-['Archivo'] text-xl font-bold text-white sm:text-2xl">
                          {step.title}
                        </h3>
                        <p className="mt-2.5 text-sm leading-relaxed text-[#9aa3bd]">{step.body}</p>
                        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5">
                          <Check className="h-3.5 w-3.5 text-[#ce60f0]" strokeWidth={2.5} />
                          <span className="text-xs font-medium text-white/75">{step.outcome}</span>
                        </div>
                      </motion.div>
                    </motion.li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
