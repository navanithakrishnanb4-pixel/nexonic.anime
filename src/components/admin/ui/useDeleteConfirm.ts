"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

/**
 * Shared state for the "ask → confirm → real Server Action → refresh"
 * delete flow used by the admin list tables. The action is always a real
 * Server Action; this hook only holds UI state.
 */
export function useDeleteConfirm<T extends { id: string }>(
  action: (id: string) => Promise<{ error: string | null }>
) {
  const router = useRouter();
  const [target, setTarget] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function ask(item: T) {
    setError(null);
    setTarget(item);
  }
  function cancel() {
    setTarget(null);
    setError(null);
  }
  function confirm() {
    if (!target) return;
    const id = target.id;
    startTransition(async () => {
      const result = await action(id);
      if (result.error) {
        setError(result.error);
        return;
      }
      setTarget(null);
      setError(null);
      router.refresh();
    });
  }

  return { target, error, pending, ask, cancel, confirm };
}
