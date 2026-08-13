import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  limit,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Search, Copy, FileDown, Trash2, ArrowRight, X, Download, FolderOpen, SearchX } from "lucide-react";
import { downloadPDF } from "../services/pdfService";
import ConfirmDialog from "./ui/ConfirmDialog";
import Skeleton from "./ui/Skeleton";
import useLockBodyScroll from "../hooks/useLockBodyScroll";

const PAGE_SIZE = 8;

export default function RecentHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [fetchLimit, setFetchLimit] = useState(PAGE_SIZE * 4);

  useLockBodyScroll(Boolean(selectedItem));

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "users", auth.currentUser.uid, "aiHistory"),
      orderBy("createdAt", "desc"),
      limit(fetchLimit)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        setHistory(data);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        toast.error("Couldn't load recent AI activity.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [fetchLimit]);

  const toolTypes = useMemo(() => {
    const set = new Set(history.map((item) => item.type).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [history]);

  const filtered = useMemo(() => {
    let items = [...history];

    if (typeFilter !== "All") {
      items = items.filter((item) => item.type === typeFilter);
    }

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      items = items.filter(
        (item) =>
          item.title?.toLowerCase().includes(term) ||
          item.type?.toLowerCase().includes(term) ||
          item.response?.toLowerCase().includes(term)
      );
    }

    items.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;
      return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
    });

    return items;
  }, [history, typeFilter, search, sortOrder]);

  const visibleItems = filtered.slice(0, visibleCount);
  const hasMoreLocally = visibleCount < filtered.length;
  const hasMoreOnServer = !hasMoreLocally && history.length === fetchLimit;

  function handleLoadMore() {
    if (visibleCount < filtered.length) {
      setVisibleCount((c) => c + PAGE_SIZE);
    } else {
      setFetchLimit((f) => f + PAGE_SIZE * 4);
      setVisibleCount((c) => c + PAGE_SIZE);
    }
  }

  async function handleConfirmDelete() {
    const id = pendingDeleteId;
    setPendingDeleteId(null);

    if (!id) return;

    try {
      if (!auth.currentUser) return;

      await deleteDoc(
        doc(db, "users", auth.currentUser.uid, "aiHistory", id)
      );

      setHistory((prev) => prev.filter((item) => item.id !== id));

      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }

      toast.success("Deleted from history.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete history.");
    }
  }

  function handleDownloadPDF(item) {
    try {
      downloadPDF(item.title || item.type, item.response);
      toast.success("PDF downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Couldn't generate PDF.");
    }
  }

  async function handleCopy(item) {
    try {
      await navigator.clipboard.writeText(item.response || "");
      toast.success("Copied to clipboard");
    } catch (err) {
      console.error(err);
      toast.error("Couldn't copy.");
    }
  }

  function handleExportAll() {
    if (!filtered.length) return;

    const combined = filtered
      .map((item) => `# ${item.type} — ${item.title}\n\n${item.response}\n\n---\n`)
      .join("\n");

    const blob = new Blob([combined], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shepilot-history-export.md";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported history");
  }

  function formatDate(seconds) {
    return new Date(seconds * 1000).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <>
      {/* Toolbar: search, filter, sort, export */}
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-2.5 sm:flex-row">
          <div className="relative sm:max-w-xs sm:flex-1">
            <Search
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
              style={{ color: "var(--sp-text-faint)" }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              placeholder="Search activity..."
              className="w-full rounded-[10px] border py-2.5 pl-9 pr-4 text-[13px] outline-none transition-colors"
              style={{
                borderColor: "var(--sp-border)",
                background: "var(--sp-surface)",
                color: "var(--sp-text)",
              }}
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            className="rounded-[10px] border px-3.5 py-2.5 text-[13px] outline-none"
            style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface)", color: "var(--sp-text)" }}
          >
            {toolTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <button
            onClick={() => setSortOrder((s) => (s === "newest" ? "oldest" : "newest"))}
            className="rounded-[10px] border px-3.5 py-2.5 text-[13px] font-medium transition-colors hover:bg-[var(--sp-surface-muted)]"
            style={{ borderColor: "var(--sp-border)", color: "var(--sp-text-muted)" }}
          >
            {sortOrder === "newest" ? "↓ Newest first" : "↑ Oldest first"}
          </button>
        </div>

        <button
          onClick={handleExportAll}
          disabled={!filtered.length}
          className="inline-flex items-center justify-center gap-2 rounded-[10px] px-4 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: "var(--sp-primary)" }}
        >
          <Download size={14} />
          Export All
        </button>
      </div>

      <div className="grid gap-2.5">
        {loading && (
          <div
            className="rounded-[16px] border p-6"
            style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface)" }}
          >
            <Skeleton lines={3} />
          </div>
        )}

        {!loading && history.length === 0 && (
          <div
            className="rounded-[16px] border border-dashed p-10 text-center"
            style={{ borderColor: "var(--sp-border-strong)", background: "var(--sp-surface-muted)" }}
          >
            <FolderOpen size={22} className="mx-auto text-[var(--sp-primary)]" />
            <h3 className="mt-3 text-[14.5px] font-semibold text-[var(--sp-text)]">
              No business activity yet.
            </h3>
            <p className="mt-1.5 text-[13px] text-[var(--sp-text-muted)]">
              Start your first AI workspace task to see your progress here.
            </p>
          </div>
        )}

        {!loading && history.length > 0 && filtered.length === 0 && (
          <div
            className="rounded-[16px] border border-dashed p-10 text-center"
            style={{ borderColor: "var(--sp-border-strong)", background: "var(--sp-surface-muted)" }}
          >
            <SearchX size={22} className="mx-auto text-[var(--sp-text-faint)]" />
            <h3 className="mt-3 text-[14.5px] font-semibold text-[var(--sp-text)]">No matches</h3>
            <p className="mt-1.5 text-[13px] text-[var(--sp-text-muted)]">
              Try a different search term or tool filter.
            </p>
          </div>
        )}

        {!loading &&
          visibleItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-3 rounded-[14px] border p-4 transition-colors duration-150 sm:flex-row sm:items-center sm:justify-between"
              style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface)" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--sp-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--sp-border)")}
            >
              <div
                className="min-w-0 flex-1 cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold"
                    style={{ background: "var(--sp-primary-soft)", color: "var(--sp-primary-dark)" }}
                  >
                    {item.type}
                  </span>
                  {item.createdAt?.seconds && (
                    <span className="text-[11.5px]" style={{ color: "var(--sp-text-faint)" }}>
                      {formatDate(item.createdAt.seconds)}
                    </span>
                  )}
                </div>

                <h3 className="mt-2 truncate text-[14.5px] font-semibold text-[var(--sp-text)]">
                  {item.title}
                </h3>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  onClick={() => handleCopy(item)}
                  title="Copy"
                  className="flex h-9 w-9 items-center justify-center rounded-[9px] transition-colors hover:bg-[var(--sp-surface-muted)]"
                  style={{ color: "var(--sp-text-muted)" }}
                >
                  <Copy size={15} />
                </button>
                <button
                  onClick={() => handleDownloadPDF(item)}
                  title="Export PDF"
                  className="flex h-9 w-9 items-center justify-center rounded-[9px] transition-colors hover:bg-[var(--sp-surface-muted)]"
                  style={{ color: "var(--sp-text-muted)" }}
                >
                  <FileDown size={15} />
                </button>
                <button
                  onClick={() => setPendingDeleteId(item.id)}
                  title="Delete"
                  className="flex h-9 w-9 items-center justify-center rounded-[9px] transition-colors hover:bg-[var(--sp-danger-soft)] hover:text-[var(--sp-danger)]"
                  style={{ color: "var(--sp-text-muted)" }}
                >
                  <Trash2 size={15} />
                </button>
                <button
                  onClick={() => setSelectedItem(item)}
                  title="Open"
                  className="flex h-9 w-9 items-center justify-center rounded-[9px] transition-colors hover:bg-[var(--sp-surface-muted)]"
                  style={{ color: "var(--sp-primary)" }}
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}

        {!loading && (hasMoreLocally || hasMoreOnServer) && (
          <button
            onClick={handleLoadMore}
            className="mx-auto mt-1 rounded-[10px] border px-5 py-2.5 text-[13px] font-semibold transition-colors hover:bg-[var(--sp-surface-muted)]"
            style={{ borderColor: "var(--sp-border)", color: "var(--sp-text-muted)" }}
          >
            Load more
          </button>
        )}
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-6"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 12 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[20px] p-6 shadow-2xl sm:p-8"
              style={{ background: "var(--sp-surface)" }}
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-[12.5px] font-semibold"
                    style={{ background: "var(--sp-primary-soft)", color: "var(--sp-primary-dark)" }}
                  >
                    {selectedItem.type}
                  </span>
                  <h2 className="mt-3 break-words text-[21px] font-bold text-[var(--sp-text)]">
                    {selectedItem.title}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCopy(selectedItem)}
                    className="inline-flex items-center gap-1.5 rounded-[10px] border px-3.5 py-2 text-[13px] font-semibold transition-colors hover:bg-[var(--sp-surface-muted)]"
                    style={{ borderColor: "var(--sp-border)", color: "var(--sp-text)" }}
                  >
                    <Copy size={14} /> Copy
                  </button>
                  <button
                    onClick={() => handleDownloadPDF(selectedItem)}
                    className="inline-flex items-center gap-1.5 rounded-[10px] px-3.5 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ background: "var(--sp-primary)" }}
                  >
                    <FileDown size={14} /> Export PDF
                  </button>
                  <button
                    onClick={() => setPendingDeleteId(selectedItem.id)}
                    className="inline-flex items-center gap-1.5 rounded-[10px] px-3.5 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ background: "var(--sp-danger)" }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="flex h-9 w-9 items-center justify-center rounded-[10px] transition-colors hover:bg-[var(--sp-surface-muted)]"
                    style={{ color: "var(--sp-text-muted)" }}
                    aria-label="Close"
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>

              <div
                className="prose mt-7 max-w-none rounded-[16px] border p-6 leading-7"
                style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface-muted)", color: "var(--sp-text)" }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {selectedItem.response}
                </ReactMarkdown>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={!!pendingDeleteId}
        title="Delete this item?"
        description="This AI history entry will be permanently deleted. This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </>
  );
}
