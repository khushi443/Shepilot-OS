import { AnimatePresence, motion } from "framer-motion";
import useLockBodyScroll from "../../hooks/useLockBodyScroll";

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  danger = true,
}) {
  useLockBodyScroll(open);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm"
          onClick={onCancel}
          role="presentation"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            className="w-full max-w-sm rounded-[20px] border p-6 shadow-2xl"
            style={{ background: "var(--sp-surface)", borderColor: "var(--sp-border)" }}
          >
            <h3 id="confirm-dialog-title" className="text-[17px] font-bold text-[var(--sp-text)]">
              {title}
            </h3>
            {description && (
              <p className="mt-2 text-[13.5px] leading-5 text-[var(--sp-text-muted)]">
                {description}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 rounded-[10px] border px-4 py-2.5 text-[13.5px] font-semibold transition-colors hover:bg-[var(--sp-surface-muted)]"
                style={{ borderColor: "var(--sp-border)", color: "var(--sp-text)" }}
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 rounded-[10px] px-4 py-2.5 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: danger ? "var(--sp-danger)" : "var(--sp-primary)" }}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
