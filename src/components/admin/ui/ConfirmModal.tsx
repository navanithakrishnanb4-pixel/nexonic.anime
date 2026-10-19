"use client";

import { useEffect } from "react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  pending?: boolean;
  error?: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * Delete-confirmation dialog in the Figma admin style (replaces the
 * browser's window.confirm). Escape cancels; announced as a modal. The
 * confirm action is supplied by the caller and is always a real Server
 * Action — this component only collects the yes/no.
 */
export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Delete",
  pending = false,
  error,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pending) onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, pending, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/80 backdrop-blur-sm px-4"
    >
      <div className="admin-card rounded-2xl border border-white/10 p-7 max-w-sm w-full shadow-2xl">
        <h3 className="font-display font-semibold text-paper-50 text-lg mb-2">{title}</h3>
        <p className="font-outfit text-paper-400 text-sm mb-5 leading-relaxed">{message}</p>
        {error && (
          <p role="alert" className="font-outfit text-red-300 text-sm mb-4">
            {error}
          </p>
        )}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="font-outfit flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-paper-300 text-sm font-medium hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className="font-outfit flex-1 px-4 py-2.5 rounded-xl bg-red-500/15 border border-red-500/25 text-red-300 text-sm font-semibold hover:bg-red-500/25 transition-colors disabled:opacity-50"
          >
            {pending ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
