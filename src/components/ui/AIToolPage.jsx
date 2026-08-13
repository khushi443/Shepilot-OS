import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAIGenerator } from "../../hooks/useAIGenerator";
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

  // NEW
  toolType = "business",

  resultTitle,
  resultEmoji = "📋",

  buildPrompt,

  heroGradientClass,
  buttonGradientClass,
  buttonTextClass,
  accentTextClass,

  minLength = 10,
  maxLength = 4000,
  rows = 8,
}) {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-[#15192E] text-white">

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">

        {/* Back Button */}

        <button
          onClick={() => navigate("/dashboard")}
          className="mb-8 flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-3 transition-all duration-300 hover:bg-white/20"
        >
          ← Back to Dashboard
        </button>

        {/* Hero */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`
            relative
            overflow-hidden
            rounded-[32px]
            border
            border-white/10
            bg-gradient-to-r
            ${heroGradientClass}
            p-8
            shadow-2xl
            md:p-10
          `}
        >

          {/* Background Glow */}

          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">

            <p
              className={`text-xs uppercase tracking-[4px] sm:text-sm ${accentTextClass}`}
            >
              {eyebrow}
            </p>

            <h1 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
              {emoji} {title}
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/70">
              {description}
            </p>

          </div>

        </motion.div>

        {/* Input */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-10"
        >

          <label
            htmlFor="ai-tool-input"
            className="sr-only"
          >
            {placeholder}
          </label>

          <textarea
            id="ai-tool-input"
            rows={rows}
            value={input}
            maxLength={maxLength}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="
              w-full
              resize-none
              rounded-3xl
              border
              border-white/10
              bg-white/5
              p-6
              text-white
              backdrop-blur-xl
              outline-none
              transition-all
              duration-300
              placeholder:text-white/40
              focus:border-cyan-400
              focus:ring-2
              focus:ring-cyan-500/20
            "
          />

          <div className="mt-3 flex justify-between text-xs text-white/40">

            <span>
              Describe your startup idea in as much detail as possible.
            </span>

            <span>
              {input.length}/{maxLength}
            </span>

          </div>

        </motion.div>

        {/* Generate */}

        <div className="mt-8">

          <GenerateButton
            onClick={generate}
            loading={loading}
            idleLabel={idleLabel}
            loadingLabel={loadingLabel}
            gradientClass={buttonGradientClass}
            textClass={buttonTextClass}
          />

        </div>
                {/* Error */}

        {error && !loading && (
          <div className="mt-8">
            <ErrorCard message={error} />
          </div>
        )}

        {/* Result */}

        {(result || loading) && (
          <motion.div
            ref={resultRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-10"
          >
            <ResultCard
              title={resultTitle}
              emoji={resultEmoji}
              content={result}
              loading={loading}
              downloadName={title}

              // NEW
              toolType={toolType}
            />
          </motion.div>
        )}

      </div>

    </div>
  );
}