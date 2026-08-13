import { useEffect } from "react";

/**
 * Locks document.body scrolling while `active` is true.
 *
 * Root cause this fixes: every fixed-overlay modal in the app
 * (ConfirmDialog, the history-detail modal in RecentHistory) sits at
 * `position: fixed; inset: 0` with its own `overflow-y-auto` content pane,
 * but nothing ever told the page underneath to stop scrolling. That meant
 * two independent vertical scrollbars could be live at the same time: the
 * browser's normal page scrollbar (still scrolling the Dashboard behind the
 * overlay) and the modal's internal scrollbar (for long AI-generated
 * content or delete-confirmation text). Locking body scroll for the
 * lifetime of the modal removes the outer scrollbar entirely while it's
 * open, leaving only the modal's own — exactly one scrollbar at a time.
 *
 * Restores the previous inline overflow value on cleanup/unmount instead of
 * unconditionally clearing it, so nested or rapidly-toggled modals don't
 * clobber each other.
 */
export default function useLockBodyScroll(active) {
  useEffect(() => {
    if (!active) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [active]);
}
