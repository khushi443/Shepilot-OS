export default function GenerateButton({
  onClick,
  loading,
  idleLabel,
  loadingLabel,
  gradientClass,
  textClass = "font-bold text-white",
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`mt-6 sm:mt-8 w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r ${gradientClass} ${textClass} hover:scale-105 transition disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100`}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          {loadingLabel}
        </span>
      ) : (
        idleLabel
      )}
    </button>
  );
}
