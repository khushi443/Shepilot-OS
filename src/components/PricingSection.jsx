import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const PLANS = [
  {
    name: "Free",
    tagline: "Start building your first startup with AI.",
    price: "$0",
    period: "Forever",
    cta: "Start Free",
    featured: false,
    features: [
      "5 AI generations per day",
      "Business Idea Generator",
      "Business Validator",
      "Startup Blueprint",
      "Save AI History",
    ],
  },

  {
    name: "Pro",
    tagline: "Everything you need to launch your startup.",
    price: "$12",
    period: "/month",
    cta: "Upgrade to Pro",
    featured: true,
    badge: "Most Popular",
    features: [
      "Unlimited AI generations",
      "Business Idea Generator",
      "Business Validator",
      "Startup Blueprint",
      "Business Snapshot",
      "Marketing Strategy",
      "AI Mentor",
      "PDF Export",
      "Unlimited History",
    ],
  },

  {
    name: "Premium",
    tagline: "Advanced tools for scaling your business.",
    price: "Coming Soon",
    period: "",
    cta: "Join Waitlist",
    featured: false,
    comingSoon: true,
    features: [
      "Pricing Strategy AI",
      "Revenue Forecast",
      "Financial Planner",
      "Investor Toolkit",
      "Advanced Analytics",
      "Team Workspace",
    ],
  },
];

export default function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSelect = (planName) => {
    setSelectedPlan(planName);
  };

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-[#0c0f1f] py-24 sm:py-32"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_0%,rgba(70,78,254,0.18),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_85%_90%,rgba(206,96,240,0.14),transparent_70%)]" />
        <div className="absolute left-1/2 top-1/2 h-[540px] w-[540px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#464efe]/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="font-['Inter'] text-xs font-semibold uppercase tracking-[0.2em] text-[#ce60f0]">
            Pricing
          </span>

          <h2 className="mt-4 font-['Archivo'] text-4xl font-extrabold text-white sm:text-5xl">
            Choose the plan that grows with your startup
          </h2>

          <p className="mt-4 font-['Inter'] text-base leading-relaxed text-white/60">
            Start free, launch confidently, and unlock premium AI tools as your
            business grows.
          </p>
        </motion.div>

        {/* Pricing Cards */}

        <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:items-center">
          {PLANS.map((plan, i) => {
            const isSelected = selectedPlan === plan.name;
                        return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                whileHover={{ y: -6 }}
                className={`relative rounded-[32px] border backdrop-blur-xl transition-all duration-300 ${
                  plan.featured
                    ? "border-[#ce60f0]/40 bg-white/[0.08] p-8 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.6),0_0_60px_-12px_rgba(206,96,240,0.35)] lg:scale-[1.05] lg:p-10"
                    : "border-white/10 bg-white/[0.04] p-8 shadow-[0_16px_48px_-16px_rgba(0,0,0,0.55)]"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#464efe] to-[#ce60f0] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
                      <Sparkles className="h-3.5 w-3.5" />
                      {plan.badge}
                    </span>
                  </div>
                )}

                {plan.comingSoon && (
                  <div className="absolute right-5 top-5 rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-semibold text-yellow-300">
                    Coming Soon
                  </div>
                )}

                <h3 className="font-['Archivo'] text-2xl font-bold text-white">
                  {plan.name}
                </h3>

                <p className="mt-2 text-sm text-white/60">
                  {plan.tagline}
                </p>

                <div className="mt-8">
                  <h1 className="font-['Archivo'] text-5xl font-extrabold text-white">
                    {plan.price}
                  </h1>

                  {plan.period && (
                    <p className="mt-2 text-sm text-white/50">
                      {plan.period}
                    </p>
                  )}
                </div>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3"
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full ${
                          plan.featured
                            ? "bg-[#ce60f0]/20"
                            : "bg-[#464efe]/20"
                        }`}
                      >
                        <Check
                          className={`h-3 w-3 ${
                            plan.featured
                              ? "text-[#ce60f0]"
                              : "text-[#8b91ff]"
                          }`}
                        />
                      </span>

                      <span className="text-sm leading-relaxed text-white/70">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleSelect(plan.name)}
                  className={`mt-10 flex w-full items-center justify-center gap-2 rounded-full px-8 py-3 font-semibold transition-all ${
                    isSelected
                      ? "bg-white/15 text-white"
                      : plan.featured
                      ? "bg-gradient-to-r from-[#464efe] to-[#ce60f0] text-white"
                      : "border border-white/15 bg-white/5 text-white hover:border-[#464efe]"
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-[#ce60f0]" />
                      Selected
                    </>
                  ) : (
                    <>
                      {plan.cta}
                      {!plan.comingSoon && (
                        <ArrowRight className="h-4 w-4" />
                      )}
                    </>
                  )}
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Info */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-14 text-center"
        >
          <AnimatePresence>
            {selectedPlan && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ce60f0]/30 bg-[#ce60f0]/10 px-5 py-2 text-sm text-white"
              >
                <CheckCircle2 className="h-4 w-4 text-[#ce60f0]" />
                {selectedPlan} selected — Subscription system coming soon.
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-sm text-white/45">
            🚀 ShePilot is currently in MVP. Free plan is available today.
            Pro and Premium features will be released in future updates.
          </p>
        </motion.div>
      </div>
    </section>
  );
}