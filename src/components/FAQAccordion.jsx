import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';

const FAQS = [
  {
    question: 'What exactly is ShePilot OS?',
    answer:
      'ShePilot OS is the AI operating system for first-time women entrepreneurs. It turns your idea into a structured business — generating your roadmap, validating your market, drafting your brand and messaging, and keeping every decision, task, and metric in one calm dashboard. Think of it as a co-pilot sitting beside you from day one.',
  },
  {
    question: 'I have zero business experience. Is this really for me?',
    answer:
      'Yes — that is exactly who it is built for. ShePilot assumes no MBA, no network, and no prior launch. It explains every concept in plain language, recommends the next right move based on where you are, and breaks big intimidating milestones (pricing, legal setup, first customers) into small, doable steps you can finish this week.',
  },
  {
    question: 'How is this different from just asking ChatGPT?',
    answer:
      'Generic chatbots give you one-off answers and forget you the moment you close the tab. ShePilot OS holds the full context of your business — your idea, your market, your finances, your progress — and builds on it over time. Plans, documents, and tasks live in a persistent workspace, so every recommendation is grounded in your actual venture, not a blank prompt.',
  },
  {
    question: 'How much time do I need each week?',
    answer:
      'As little as 3–4 focused hours. Most of our founders are building alongside a job or family, so ShePilot is designed for momentum in small windows: your weekly plan is pre-prioritized, tasks are sized to fit real life, and the AI drafts the heavy lifting (emails, copy, plans) so you spend your time deciding, not typing.',
  },
  {
    question: 'Is there a free trial? What does it cost?',
    answer:
      'Yes — every plan starts with a free trial, no credit card required, so you can validate your first idea before paying anything. After that, plans scale with your stage, from a solo starter tier to a full growth suite. You can compare every tier side by side in the pricing section above.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      'Absolutely. There are no contracts and no lock-in. You can downgrade, pause, or cancel from your settings in two clicks, and you keep read access to everything you have built. We would rather earn your renewal every month than trap it.',
  },
  {
    question: 'Is my business idea and data private?',
    answer:
      'Completely. Your ideas, plans, and financial data are encrypted in transit and at rest, never sold, and never used to train models for other users. You can export or permanently delete your workspace at any time — your venture belongs to you, full stop.',
  },
  {
    question: 'What happens after I sign up?',
    answer:
      'You will answer a short guided intake about your idea (or the problem you want to solve, if you are still searching). Within minutes, ShePilot generates your personalized launch roadmap, your first week of tasks, and a validation plan — so your very first session ends with real, tangible progress.',
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="relative py-24 px-6 overflow-hidden">
      {/* Ambient accent glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-10%] w-[480px] h-[480px] rounded-full opacity-20 blur-[140px]"
        style={{ background: 'radial-gradient(circle, #ce60f0 0%, transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-20%] left-[-8%] w-[420px] h-[420px] rounded-full opacity-15 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #464efe 0%, transparent 70%)' }}
      />

      <div className="relative max-w-3xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block font-['Inter'] font-semibold text-xs uppercase tracking-[0.14em] text-[#ce60f0] bg-[#ce60f0]/10 border border-[#ce60f0]/25 rounded-full px-5 py-2 mb-6">
            FAQ
          </span>
          <h2 className="font-['Archivo'] font-extrabold text-4xl md:text-5xl text-white leading-[1.1] tracking-tight">
            Questions, answered.
          </h2>
          <p className="font-['Inter'] font-normal text-base md:text-lg text-white/60 leading-relaxed mt-5 max-w-xl mx-auto">
            Everything first-time founders ask us before they take off — no jargon, no fine print.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="flex flex-col gap-4">
          {(FAQS ?? []).map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.3) }}
                whileHover={{ y: -2 }}
                className="rounded-[32px] border backdrop-blur-xl transition-all duration-300 overflow-hidden"
                style={{
                  background: isOpen ? 'rgba(206, 96, 240, 0.06)' : 'rgba(255, 255, 255, 0.04)',
                  borderColor: isOpen ? 'rgba(206, 96, 240, 0.4)' : 'rgba(255, 255, 255, 0.08)',
                  boxShadow: isOpen
                    ? '0 8px 32px rgba(206, 96, 240, 0.15), 0 8px 24px rgba(0,0,0,0.2)'
                    : '0 8px 24px rgba(0,0,0,0.2)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-6 text-left px-7 md:px-8 py-6 cursor-pointer"
                >
                  <span className="font-['Archivo'] font-bold text-base md:text-lg text-white leading-snug">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                    className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center border transition-colors duration-300"
                    style={{
                      borderColor: isOpen ? 'rgba(206, 96, 240, 0.5)' : 'rgba(255, 255, 255, 0.12)',
                      background: isOpen ? 'rgba(206, 96, 240, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <ChevronDown
                      size={18}
                      className={isOpen ? 'text-[#ce60f0]' : 'text-white/60'}
                    />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
                    >
                      <p className="font-['Inter'] font-normal text-[15px] text-white/60 leading-relaxed px-7 md:px-8 pb-7 -mt-1">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 text-center"
        >
          <span className="w-10 h-10 rounded-full bg-[#464efe]/15 border border-[#464efe]/30 flex items-center justify-center">
            <MessageCircle size={18} className="text-[#8a8fff]" />
          </span>
          <p className="font-['Inter'] font-medium text-sm text-white/50">
            Still weighing it up?{' '}
            <a
              href="#pricing"
              className="font-semibold text-[#ce60f0] hover:text-white transition-colors duration-200 underline-offset-4 hover:underline"
            >
              Compare plans
            </a>{' '}
            — every tier starts free.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
