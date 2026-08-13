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
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[70] p-6"
          onClick={onCancel}
          role="presentation"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            className="w-full max-w-sm rounded-3xl bg-[#1B2040] border border-white/10 p-6"
          >
            <h3 id="confirm-dialog-title" className="text-xl font-bold">
              {title}
            </h3>
            {description && <p className="text-white/60 mt-2">{description}</p>}

            <div className="flex gap-3 mt-6">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition font-semibold"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition ${
                  danger
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-gradient-to-r from-[#464EFE] to-[#CE60F0] hover:opacity-90"
                }`}
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
