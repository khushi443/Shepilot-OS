import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import TrustedByStrip from '../components/TrustedByStrip';
import FeatureShowcase from '../components/FeatureShowcase';
import HowItWorksSteps from '../components/HowItWorksSteps';
import PricingSection from '../components/PricingSection';
import FAQAccordion from '../components/FAQAccordion';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

import dashboardImg from '../assets/startup_dashboard.jpg';
import womenImg from '../assets/women_entrepreneur.jpg';
import teamImg from '../assets/business_team_meeting.jpg';
import saasImg from '../assets/modern_saas_interface.jpg';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
};

const bentoTiles = [
  {
    key: 'big',
    title: 'Your AI Co-Founder, On Call 24/7',
    body: 'ShePilot drafts your business plan, models your cash flow, and negotiates your first vendor contracts — while you sleep, nurse a toddler, or run your day job.',
    img: dashboardImg,
    span: 'md:col-span-2 md:row-span-2',
  },
  {
    key: 'stat',
    title: '4,200+',
    body: 'first-time founders launched with ShePilot in 2024',
    span: '',
    stat: true,
  },
  {
    key: 'quote',
    title: '"It felt like hiring a co-founder for the price of a coffee habit."',
    body: '— Amara O., Founder, Lagos',
    span: '',
    quote: true,
  },
  {
    key: 'image',
    title: 'Built by women, for women',
    body: 'Every workflow is designed around real founder journeys — funding, family, and all.',
    img: womenImg,
    span: '',
  },
  {
    key: 'mini',
    title: 'Compliance, Handled',
    body: 'Auto-generated LLC filings, tax IDs, and contracts — reviewed by real attorneys.',
    span: '',
  },
];

const proofStats = [
  { number: 'Beta', label: 'Early access, real product' },
  { number: '6', label: 'connected AI tools, one context' },
  { number: 'React', label: '+ Firebase + AI' },
  { number: 'Live', label: 'demo, not a mockup' },
];

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const showcaseY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <div className="bg-[#15192e] font-['Inter'] text-white overflow-x-hidden">
      <Header />
      <HeroSection />
      <TrustedByStrip />

      {/* BENTO GRID — unequal tiles */}
      <section id="features" className="relative py-24 md:py-32 px-6 md:px-12 bg-[#15192e]">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} transition={{ duration: 0.6, ease: 'easeOut' }} className="mb-14 max-w-2xl">
            <h2 className="font-['Archivo'] font-extrabold text-3xl md:text-5xl tracking-[-0.03em] leading-tight">
              One platform, every step of launch.
            </h2>
            <p className="mt-4 text-white/60 text-lg leading-relaxed">
              Bento-boxed tools built specifically for founders launching their very first venture.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 md:auto-rows-[180px] gap-5">
            {bentoTiles.map((tile, i) => (
              <motion.div
                key={tile.key}
                {...fadeUp}
                transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.08 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className={`relative rounded-[32px] overflow-hidden border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.35)] ${tile.span || 'md:col-span-1'} ${tile.stat || tile.quote ? 'bg-gradient-to-br from-[#464efe]/20 to-[#ce60f0]/10' : 'bg-white/5'} p-7 flex flex-col justify-end`}
              >
                {tile.img && (
                  <>
                    <img src={tile.img} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
                  </>
                )}
                <div className="relative z-10">
                  {tile.stat ? (
                    <p className="font-['Archivo'] font-black text-5xl bg-gradient-to-r from-[#ce60f0] to-[#464efe] bg-clip-text text-transparent">
                      {tile.title}
                    </p>
                  ) : (
                    <h3 className="font-['Archivo'] font-bold text-xl md:text-2xl tracking-tight">{tile.title}</h3>
                  )}
                  <p className="mt-2 text-white/70 text-sm md:text-base leading-relaxed">{tile.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FeatureShowcase />

      {/* SHOWCASE BAND — wide tinted product visual */}
      <section ref={heroRef} className="relative py-24 md:py-32 px-6 md:px-12 bg-gradient-to-br from-[#1c2140] to-[#15192e] overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp} transition={{ duration: 0.6, ease: 'easeOut' }} className="order-2 md:order-1">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-[#ce60f0]/15 text-[#ce60f0] mb-6">
              Your Command Center
            </span>
            <h2 className="font-['Archivo'] font-extrabold text-3xl md:text-5xl tracking-[-0.03em] leading-tight">
              See your whole business, in one glowing dashboard.
            </h2>
            <p className="mt-5 text-white/60 text-lg leading-relaxed max-w-md">
              Revenue, runway, tasks, and AI recommendations — surfaced automatically every morning so you always know your next best move.
            </p>
            <motion.a
              href="#pricing"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400 }}
              className="mt-8 inline-block px-8 py-4 rounded-full bg-white text-[#15192e] font-semibold shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
            >
              See it in action
            </motion.a>
          </motion.div>
          <motion.div
            style={{ y: showcaseY }}
            {...fadeUp}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="order-1 md:order-2 rounded-[32px] overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
          >
            <img src={saasImg} alt="ShePilot OS dashboard preview" loading="lazy" className="w-full h-[320px] md:h-[420px] object-cover" />
          </motion.div>
        </div>
      </section>

      <div id="how">
        <HowItWorksSteps />
      </div>

      {/* Split image + testimonial lead-in */}
      <section className="relative py-24 md:py-28 px-6 md:px-12 bg-[#15192e]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <motion.div {...fadeUp} transition={{ duration: 0.6, ease: 'easeOut' }} className="rounded-[32px] overflow-hidden border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
            <img src={teamImg} alt="Founders collaborating" loading="lazy" className="w-full h-[280px] object-cover" />
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}>
            <h3 className="font-['Archivo'] font-extrabold text-2xl md:text-4xl tracking-[-0.02em]">
              Real founders. Real momentum.
            </h3>
            <p className="mt-4 text-white/60 leading-relaxed max-w-md">
              From first-time solo operators to co-founding duos, ShePilot OS is the operating layer behind thousands of new ventures.
            </p>
          </motion.div>
        </div>
      </section>

      {/* PROOF — full width stat row */}
      <section className="py-20 md:py-24 px-6 md:px-12 bg-gradient-to-r from-[#1c2140] via-[#15192e] to-[#1c2140] border-y border-white/10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {proofStats.map((s, i) => (
            <motion.div
              key={s.label}
              {...fadeUp}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.08 }}
            >
              <p className="font-['Archivo'] font-black text-4xl md:text-6xl bg-gradient-to-r from-[#ce60f0] to-[#464efe] bg-clip-text text-transparent">
                {s.number}
              </p>
              <p className="mt-2 text-white/60 text-sm md:text-base">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div id="pricing">
        <PricingSection />
      </div>

      <div id="faq">
        <FAQAccordion />
      </div>

      {/* CTA BAND */}
      <section className="relative py-20 md:py-28 px-6 md:px-16 bg-gradient-to-br from-[#464efe]/20 via-[#15192e] to-[#ce60f0]/10">
        <motion.div {...fadeUp} transition={{ duration: 0.6, ease: 'easeOut' }} className="max-w-4xl">
          <h2 className="font-['Archivo'] font-extrabold text-3xl md:text-5xl tracking-[-0.03em] leading-tight text-left">
            Ready to build the business only you could start?
          </h2>
          <p className="mt-4 text-white/60 text-lg max-w-xl">
            ShePilot OS gets you from idea to incorporated, funded, and operating — faster than doing it alone.
          </p>
          <motion.a
            href="#pricing"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400 }}
            className="mt-8 inline-block px-9 py-4 rounded-full bg-white text-[#15192e] font-semibold shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
          >
            Start free trial
          </motion.a>
        </motion.div>
      </section>

      <FinalCTA />
      <Footer />
    </div>
  );
}
