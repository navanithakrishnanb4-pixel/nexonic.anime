"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FormField, TextInput } from "@/components/admin/form/FormField";
import { Button } from "@/components/ui/Button";

/**
 * Real Supabase Auth sign-in — no mock, no localStorage flag. On
 * success, the SDK sets the auth cookie itself (via the browser client
 * created in lib/supabase/client.ts); router.refresh() then makes the
 * next server render see that cookie so the (protected) layout's
 * server-side check passes and /admin renders normally.
 *
 * Deliberately minimal: email, password, submit, loading, error. No
 * "forgot password," no registration, no social login — this is a
 * single-admin CMS, per the brief.
 */
export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      // Supabase's own message ("Invalid login credentials") is safe to
      // show as-is — it never reveals whether the email exists, which
      // column failed, or any schema/implementation detail.
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-md w-full max-w-sm">
      <FormField label="Email" htmlFor="email">
        <TextInput
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormField>

      <FormField label="Password" htmlFor="password">
        <TextInput
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormField>

      {error && (
        <p role="alert" className="font-outfit text-xs text-red-300">
          {error}
        </p>
      )}

      <Button type="submit" variant="primary" disabled={loading} className="mt-1 !bg-gradient-to-r !from-neon-violet !to-neon-pink-deep !text-white !rounded-full hover:!opacity-90">
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
