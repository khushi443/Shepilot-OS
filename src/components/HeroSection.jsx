import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, Star, ChevronDown } from 'lucide-react';
import heroImg from '../assets/women_entrepreneur.jpg';

const EASE = [0.16, 1, 0.3, 1];

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function CountUp({ to, suffix = '', decimals = 0, duration = 2.2, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(0, to, {
      duration,
      ease: EASE,
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-[#15192e] font-['Inter']">
      {/* Full-bleed photographic backdrop with deep gradient overlays */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Woman entrepreneur building her first business"
          className="h-full w-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#15192e] via-[#15192e]/80 to-[#15192e]/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#15192e] via-transparent to-[#15192e]/60" />
      </div>

      {/* Ambient accent glows */}
      <div className="pointer-events-none absolute -top-32 right-[-10%] h-[480px] w-[480px] rounded-full bg-[#464efe]/25 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-[-20%] left-[-10%] h-[520px] w-[520px] rounded-full bg-[#ce60f0]/20 blur-[140px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-14 pt-32 sm:pt-36 lg:px-10">
        {/* Oversized headline — top-left, asymmetric */}
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl">
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4 text-[#ce60f0]" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
              ShePilot OS · AI Copilot Suite
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 font-['Archivo'] text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            The{' '}
            <span className="bg-gradient-to-r from-[#6a7bff] via-[#464efe] to-[#ce60f0] bg-clip-text text-transparent">
              AI Operating System
            </span>{' '}
            for First-Time Women Entrepreneurs
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
            ShePilot turns your idea into a launch-ready venture — AI copilots for planning,
            branding, finance, and growth, designed for women building their first business.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300 }}
             onClick={() => navigate("/signup")}
              className="group inline-flex items-center gap-2 rounded-[32px] bg-gradient-to-r from-[#464efe] to-[#ce60f0] px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:shadow-[0_8px_40px_rgba(206,96,240,0.45)]"
            >
              Start Building Free
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-2 rounded-[32px] border border-white/20 bg-white/5 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-white/10"
            >
              See How It Works
            </motion.button>
          </motion.div>

          <motion.p variants={item} className="mt-5 text-sm text-white/50">
            No credit card required · Launch in days, not months
          </motion.p>
        </motion.div>

        {/* Bottom row — scroll cue left, live metric tile anchored right */}
        <div className="mt-14 flex flex-1 flex-col justify-end">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              onClick={() => scrollToSection('features')}
              className="group hidden items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-white lg:inline-flex"
            >
              Scroll to explore
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 backdrop-blur-md transition-colors duration-300 group-hover:border-white/40">
                <ChevronDown className="h-4 w-4 animate-bounce" />
              </span>
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
              whileHover={{ y: -4 }}
              className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-7 lg:ml-auto"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ce60f0] opacity-60" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#ce60f0]" />
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
                    Beta &middot; Early Access
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <p className="font-['Archivo'] text-2xl font-extrabold tracking-tight text-white">
                  One idea. One connected workflow.
                </p>
                <p className="mt-1 text-sm text-white/60">
                  Validate, plan, and pitch your business without re-typing it six times.
                </p>
              </div>

              <div className="my-5 h-px bg-white/10" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-[#ce60f0] text-[#ce60f0]" />
                    <span className="font-['Archivo'] text-sm font-bold text-white">
                      Real Product Demo
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-white/50">not a mockup</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-[#6a7bff]" />
                    <span className="font-['Archivo'] text-sm font-bold text-white">
                      React + Firebase + AI
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-white/50">built for this hackathon</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
