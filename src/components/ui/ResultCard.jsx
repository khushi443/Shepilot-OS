import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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

  // NEW
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
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-10 rounded-[30px] border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.03] backdrop-blur-xl p-6 md:p-8 shadow-2xl"
    >
      {/* Header */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 text-3xl shadow-lg">
            {emoji}
          </div>

          <div>

            <h2 className="text-2xl font-black text-white md:text-3xl">
              {title}
            </h2>

            <p className="mt-1 text-white/60">
              AI-generated insights tailored for this tool.
            </p>

          </div>

        </div>

        {!loading && content && (

          <div className="flex gap-3">

            <button
              onClick={handleCopy}
              className="rounded-2xl bg-white/10 px-5 py-3 font-semibold transition hover:bg-white/20"
            >
              {copied ? "✅ Copied" : "📋 Copy"}
            </button>

            <button
              onClick={handleShare}
              className="rounded-2xl bg-white/10 px-5 py-3 font-semibold transition hover:bg-white/20"
            >
              🔗 Share
            </button>

            <button
              onClick={handleDownload}
              className="rounded-2xl bg-cyan-500 px-5 py-3 font-semibold transition hover:bg-cyan-600"
            >
              📄 Export PDF
            </button>

          </div>

        )}

      </div>

      <div className="mt-8">

        {loading ? (

          <Skeleton />

        ) : (

          <>
                      {/* AI Response */}

            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#1B2040] to-[#232B4A] p-8 shadow-xl">

              <div className="mb-8 flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-2xl">
                  🤖
                </div>

                <div>

                  <h3 className="text-2xl font-bold text-white">
                    {title}
                  </h3>

                  <p className="text-sm text-white/60">
                    AI-generated insights tailored for this tool.
                  </p>

                </div>

              </div>

              <div className={`prose prose-invert relative max-w-none ${!expanded ? "max-h-[420px] overflow-hidden" : ""}`}>

                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="mb-5 text-3xl font-black">
                        {children}
                      </h1>
                    ),

                    h2: ({ children }) => (
                      <h2 className="mt-8 mb-4 text-2xl font-bold text-cyan-300">
                        {children}
                      </h2>
                    ),

                    h3: ({ children }) => (
                      <h3 className="mt-6 mb-3 text-xl font-semibold text-purple-300">
                        {children}
                      </h3>
                    ),

                    p: ({ children }) => (
                      <p className="mb-4 leading-8 text-white/90">
                        {children}
                      </p>
                    ),

                    ul: ({ children }) => (
                      <ul className="list-disc space-y-2 pl-6">
                        {children}
                      </ul>
                    ),

                    ol: ({ children }) => (
                      <ol className="list-decimal space-y-2 pl-6">
                        {children}
                      </ol>
                    ),

                    table: ({ children }) => (
                      <table className="mt-6 w-full overflow-hidden rounded-xl border border-white/20">
                        {children}
                      </table>
                    ),

                    th: ({ children }) => (
                      <th className="border border-white/20 bg-white/10 p-3">
                        {children}
                      </th>
                    ),

                    td: ({ children }) => (
                      <td className="border border-white/20 p-3">
                        {children}
                      </td>
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>

                {!expanded && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#1B2040] to-transparent" />
                )}

              </div>

              {isLong && (
                <button
                  onClick={() => setExpanded((e) => !e)}
                  className="mx-auto mt-4 block rounded-full bg-white/10 px-6 py-2 text-sm font-semibold transition hover:bg-white/20"
                >
                  {expanded ? "Show less ▲" : "Show full result ▼"}
                </button>
              )}

            </div>

            {/* Only for Business Idea Tool */}

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
              <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-3xl border border-white/10 bg-gradient-to-r from-[#CE60F0]/10 to-[#464EFE]/10 p-6 sm:flex-row">
                <div>
                  <p className="text-sm uppercase tracking-[3px] text-white/50">
                    Keep the momentum going
                  </p>
                  <p className="mt-1 text-lg font-bold">
                    Next up: {nextStep.emoji} {nextStep.label}
                  </p>
                </div>

                <button
                  onClick={() => navigate(nextStep.path)}
                  className="shrink-0 rounded-2xl bg-gradient-to-r from-[#CE60F0] to-[#464EFE] px-6 py-3 font-semibold transition-all duration-300 hover:scale-105"
                >
                  Continue to {nextStep.short} →
                </button>
              </div>
            )}
          </>

        )}

      </div>

    </motion.div>
  );
}