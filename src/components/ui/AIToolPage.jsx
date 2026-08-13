import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import DashboardShell from "../app/DashboardShell";
import SectionHeader from "../app/SectionHeader";
import { useAIGenerator } from "../../hooks/useAIGenerator";
import { hasBusinessContext } from "../../utils/businessContext";
import ResultCard from "./ResultCard";
import ErrorCard from "./ErrorCard";
import GenerateButton from "./GenerateButton";

export default function AIToolPage({
  eyebrow,
  emoji,
  title,
  description,
  placeholder,
  idleLabel,
  loadingLabel,

  historyType,
  toolType = "business",

  resultTitle,
  resultEmoji = "📋",

  buildPrompt,

  minLength = 10,
  maxLength = 4000,
  rows = 8,

  suggestedQuestions,
}) {
  const {
    input,
    setInput,
    result,
    loading,
    error,
    generate,
    resultRef,
  } = useAIGenerator({
    historyType,
    buildPrompt,
    minInputLength: minLength,
  });

  // Only meaningful for downstream tools — the Business Idea page is where
  // this context originates, so it never shows its own indicator. Based on
  // whether context exists at all, not on whether the input box happens to
  // be prefilled (AI Mentor's box is a free-form question and is never
  // prefilled, but it still receives full context in its prompt).
  const isUsingPriorContext = historyType !== "Business Idea" && hasBusinessContext();

  return (
    <DashboardShell title={eyebrow} subtitle={description}>
      <div className="mx-auto max-w-4xl">
        <SectionHeader eyebrow={eyebrow} title={`${emoji} ${title}`} description={description} />

        {isUsingPriorContext && (
          <div
            className="mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium"
            style={{ background: "var(--sp-accent-soft)", color: "var(--sp-accent)" }}
          >
            <Sparkles size={13} />
            Using your startup idea from earlier
          </div>
        )}

        {/* Input */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mt-6">
          <label htmlFor="ai-tool-input" className="sr-only">
            {placeholder}
          </label>

          <textarea
            id="ai-tool-input"
            rows={rows}
            value={input}
            maxLength={maxLength}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="w-full resize-none rounded-[14px] border p-4.5 text-[13.5px] leading-6 outline-none transition-colors focus:border-[var(--sp-primary)]"
            style={{
              borderColor: "var(--sp-border)",
              background: "var(--sp-surface)",
              color: "var(--sp-text)",
            }}
          />

          <div className="mt-2.5 flex justify-between text-[11.5px] text-[var(--sp-text-faint)]">
            <span>Describe your startup idea in as much detail as possible.</span>
            <span>
              {input.length}/{maxLength}
            </span>
          </div>
        </motion.div>

        {/* Suggested questions */}
        {suggestedQuestions?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => setInput(q)}
                className="rounded-full border px-3.5 py-1.5 text-left text-[12px] font-medium transition-colors hover:bg-[var(--sp-surface-muted)]"
                style={{ borderColor: "var(--sp-border)", color: "var(--sp-text-muted)" }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Generate */}
        <GenerateButton onClick={generate} loading={loading} idleLabel={idleLabel} loadingLabel={loadingLabel} />

        {/* Error */}
        {error && !loading && <ErrorCard message={error} onRetry={generate} />}

        {/* Result */}
        {(result || loading) && (
          <motion.div
            ref={resultRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <ResultCard
              title={resultTitle}
              emoji={resultEmoji}
              content={result}
              loading={loading}
              downloadName={title}
              toolType={toolType}
            />
          </motion.div>
        )}
      </div>
    </DashboardShell>
  );
}
