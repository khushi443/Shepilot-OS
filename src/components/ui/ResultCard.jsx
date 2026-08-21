import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, Share2, FileDown, ArrowRight, Bot } from "lucide-react";
import ValidationScore from "../validator/ValidationScore";
import ValidationMetrics from "../validator/ValidationMetrics";
import { downloadPDF } from "../../services/pdfService";
import Skeleton from "./Skeleton";
import StartupBlueprint from "./StartupBlueprint";
import BusinessCanvas from "./BusinessCanvas";
import { JOURNEY_STEPS } from "../../utils/businessContext";

// Map each tool page's historyType to its step key in the shared journey,
// so "Continue to Next Tool" always points somewhere useful.
const HISTORY_TYPE_TO_STEP_KEY = {
  business: "Business Idea",
  validator: "Startup Validator",
  canvas: "Startup Canvas",
  finance: "Finance Plan",
  marketing: "Marketing Plan",
  pitchdeck: "Pitch Deck",
  roadmap: "Roadmap",
};

function getNextStep(toolType) {
  const currentKey = HISTORY_TYPE_TO_STEP_KEY[toolType];
  if (!currentKey) return null;

  const idx = JOURNEY_STEPS.findIndex((s) => s.key === currentKey);
  if (idx === -1 || idx === JOURNEY_STEPS.length - 1) return null;

  return JOURNEY_STEPS[idx + 1];
}

export default function ResultCard({
  title,
  emoji = "📋",
  content,
  loading,
  downloadName,
  toolType = "business",
}) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const nextStep = getNextStep(toolType);

  const COLLAPSE_THRESHOLD = 2200;
  const isLong = (content?.length || 0) > COLLAPSE_THRESHOLD;
  const [expanded, setExpanded] = useState(!isLong);

  const handleCopy = async () => {
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't copy.");
    }
  };

  const handleDownload = () => {
    if (!content) return;

    try {
      downloadPDF(downloadName || title, content);
      toast.success("PDF downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Couldn't generate PDF.");
    }
  };

  const handleShare = async () => {
    if (!content) return;

    try {
      if (navigator.share) {
        await navigator.share({ title: title || "ShePilot AI Result", text: content });
      } else {
        await navigator.clipboard.writeText(content);
        toast.success("Sharing isn't supported here — copied instead");
      }
    } catch (err) {
      // AbortError happens when the user just closes the native share sheet
      if (err?.name !== "AbortError") {
        console.error(err);
        toast.error("Couldn't share.");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 rounded-[18px] border p-5 sm:p-7"
      style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface)", boxShadow: "var(--sp-shadow)" }}
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-[12px] text-xl"
            style={{ background: "var(--sp-primary-soft)" }}
          >
            {emoji}
          </div>
          <div>
            <h2 className="text-[17px] font-bold text-[var(--sp-text)] sm:text-[19px]">{title}</h2>
            <p className="mt-0.5 text-[12.5px] text-[var(--sp-text-muted)]">
              AI-generated insights tailored for this tool.
            </p>
          </div>
        </div>

        {!loading && content && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-[10px] border px-3.5 py-2 text-[12.5px] font-semibold transition-colors hover:bg-[var(--sp-surface-muted)]"
              style={{ borderColor: "var(--sp-border)", color: "var(--sp-text)" }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-[10px] border px-3.5 py-2 text-[12.5px] font-semibold transition-colors hover:bg-[var(--sp-surface-muted)]"
              style={{ borderColor: "var(--sp-border)", color: "var(--sp-text)" }}
            >
              <Share2 size={14} />
              Share
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-[10px] px-3.5 py-2 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--sp-primary)" }}
            >
              <FileDown size={14} />
              Export PDF
            </button>
          </div>
        )}
      </div>

      <div className="mt-6">
        {loading ? (
          <div
            className="rounded-[14px] border p-6"
            style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface-muted)" }}
          >
            <div className="mb-5 flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{ background: "var(--sp-primary-soft)" }}
              >
                <Bot size={15} className="text-[var(--sp-primary)]" />
              </div>
              <p className="text-[13px] font-medium text-[var(--sp-text-muted)]">ShePilot is thinking…</p>
            </div>
            <Skeleton />
          </div>
        ) : (
          <>
            {/* AI Response */}
            <div
              className="rounded-[14px] border p-5 sm:p-7"
              style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface-muted)" }}
            >
              <div className="relative">
                <div
                  className={`prose prose-sm max-w-none sm:prose-base ${
                    !expanded ? "max-h-[420px] overflow-hidden" : ""
                  }`}
                  style={{ color: "var(--sp-text)" }}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className="mb-4 text-[22px] font-black text-[var(--sp-text)]">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="mb-3 mt-7 text-[17px] font-bold text-[var(--sp-primary-dark)]">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="mb-2.5 mt-5 text-[14.5px] font-semibold text-[var(--sp-accent)]">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="mb-3.5 text-[13.5px] leading-7 text-[var(--sp-text)]">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc space-y-1.5 pl-5 text-[13.5px] text-[var(--sp-text)]">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal space-y-1.5 pl-5 text-[13.5px] text-[var(--sp-text)]">
                          {children}
                        </ol>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-[var(--sp-text)]">{children}</strong>
                      ),
                      table: ({ children }) => (
                        <div className="overflow-x-auto">
                          <table
                            className="mt-4 w-full overflow-hidden rounded-[10px] border text-[13px]"
                            style={{ borderColor: "var(--sp-border)" }}
                          >
                            {children}
                          </table>
                        </div>
                      ),
                      th: ({ children }) => (
                        <th
                          className="border p-2.5 text-left font-semibold text-[var(--sp-text)]"
                          style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface)" }}
                        >
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="border p-2.5 text-[var(--sp-text-muted)]" style={{ borderColor: "var(--sp-border)" }}>
                          {children}
                        </td>
                      ),
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>

                {!expanded && (
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
                    style={{ background: "linear-gradient(to top, var(--sp-surface-muted), transparent)" }}
                  />
                )}
              </div>

              {isLong && (
                <button
                  onClick={() => setExpanded((e) => !e)}
                  className="mx-auto mt-4 block rounded-full border px-5 py-2 text-[12.5px] font-semibold transition-colors hover:bg-[var(--sp-surface)]"
                  style={{ borderColor: "var(--sp-border)", color: "var(--sp-text)" }}
                >
                  {expanded ? "Show less ▲" : "Show full result ▼"}
                </button>
              )}
            </div>

            {(toolType === "business" || toolType === "canvas") && (
              <>
                <StartupBlueprint content={content} />
                <BusinessCanvas content={content} />
              </>
            )}
            {toolType === "validator" && (
              <>
                <ValidationScore content={content} />
                <ValidationMetrics content={content} />
              </>
            )}

            {nextStep && (
              <div
                className="mt-8 flex flex-col items-center justify-between gap-4 rounded-[14px] border p-5 sm:flex-row"
                style={{ borderColor: "var(--sp-primary-soft)", background: "var(--sp-primary-soft)" }}
              >
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-[var(--sp-primary-dark)]">
                    Keep the momentum going
                  </p>
                  <p className="mt-1 text-[14.5px] font-semibold text-[var(--sp-text)]">
                    Next up: {nextStep.emoji} {nextStep.label}
                  </p>
                </div>

                <button
                  onClick={() => navigate(nextStep.path)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-[10px] px-5 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: "var(--sp-primary)" }}
                >
                  Continue to {nextStep.short}
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
