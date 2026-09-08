export default function GenerateButton({
  onClick,
  loading,
  idleLabel,
  loadingLabel,
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[12px] px-6 py-3.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:mt-8 sm:w-auto"
      style={{ background: "var(--sp-primary)" }}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="h-4 w-4 animate-spin"
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
