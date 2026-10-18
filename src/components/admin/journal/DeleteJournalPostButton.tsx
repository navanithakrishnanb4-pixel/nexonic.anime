"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteJournalPostAction } from "@/lib/journal-actions";

interface DeleteJournalPostButtonProps {
  postId: string;
  postTitle: string;
  redirectTo?: string;
}

export function DeleteJournalPostButton({
  postId,
  postTitle,
  redirectTo,
}: DeleteJournalPostButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    const confirmed = window.confirm(
      `Delete "${postTitle}"? This permanently removes it from the database and cannot be undone.`
    );
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteJournalPostAction(postId);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (redirectTo) {
        router.push(redirectTo);
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-xs">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="text-sm text-red-300 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Deleting…" : "Delete"}
      </button>
      {error && <span className="text-xs text-red-300 max-w-xs text-right">{error}</span>}
    </div>
  );
}
