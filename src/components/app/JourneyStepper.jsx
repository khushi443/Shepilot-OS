import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

// Renders the founder's Startup Journey as a connected stepper. `steps` is
// the `progress.journey` array from getJourneyProgress() — each entry has
// { key, label, short, path, done, updatedAt }. `nextKey` marks the single
// "up next" step so only one step is ever highlighted as in-progress.
export default function JourneyStepper({ steps, nextKey }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-0 lg:flex-row lg:items-stretch lg:gap-0">
      {steps.map((step, i) => {
        const isNext = !step.done && step.key === nextKey;
        const status = step.done ? "Completed" : isNext ? "In progress" : "Upcoming";
        // A connector is "filled" once the step before it is done, so the
        // rail visually traces how far the founder has actually gotten.
        const connectorFilled = step.done;

        return (
          <div key={step.key} className="flex flex-1 flex-col lg:flex-row lg:items-center">
            <motion.button
              onClick={() => navigate(step.path)}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="w-full rounded-[12px] border p-4 text-left transition-colors duration-200 lg:min-h-[128px]"
              style={{
                background: isNext ? "var(--sp-primary-soft)" : "var(--sp-surface)",
                borderColor: step.done
                  ? "var(--sp-border)"
                  : isNext
                  ? "var(--sp-primary)"
                  : "var(--sp-border)",
                borderWidth: isNext ? 1.5 : 1,
              }}
            >
              <div className="flex items-center justify-between">
                {step.done ? (
                  <CheckCircle2 size={17} style={{ color: "var(--sp-success)" }} />
                ) : (
                  <Circle
                    size={17}
                    style={{ color: isNext ? "var(--sp-primary)" : "var(--sp-text-faint)" }}
                  />
                )}
                {isNext && (
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                    style={{ background: "var(--sp-primary)", color: "white" }}
                  >
                    Next
                  </span>
                )}
              </div>

              <p className="mt-3 text-[13.5px] font-semibold text-[var(--sp-text)]">
                {step.short}
              </p>
              <p
                className="mt-1 text-[11.5px] font-medium"
                style={{
                  color: step.done
                    ? "var(--sp-success)"
                    : isNext
                    ? "var(--sp-primary)"
                    : "var(--sp-text-faint)",
                }}
              >
                {status}
              </p>

              {isNext && (
                <span className="mt-2 inline-flex items-center gap-1 text-[11.5px] font-semibold text-[var(--sp-primary)]">
                  Continue
                  <ArrowRight size={12} />
                </span>
              )}
            </motion.button>

            {i < steps.length - 1 && (
              <div
                className="mx-auto my-1 h-5 w-px shrink-0 lg:mx-2 lg:my-0 lg:h-px lg:w-5"
                style={{ background: connectorFilled ? "var(--sp-success)" : "var(--sp-border-strong)" }}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
