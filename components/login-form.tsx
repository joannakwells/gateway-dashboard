"use client";

import { useState } from "react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase";

export function LoginForm() {
  const [email, setEmail] = useState("maya@gatewaygarden.com");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isSupabaseConfigured) {
      setMessage("Supabase environment variables are not configured yet. Add them to enable magic-link login.");
      return;
    }

    setLoading(true);
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase!.auth.signInWithOtp({ email });
    setMessage(error ? error.message : "Magic link sent. Check your inbox.");
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="panel p-8">
        <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Auth scaffolding</p>
        <h2 className="mt-2 text-3xl font-semibold text-bark">Email login</h2>
        <p className="mt-2 text-sm text-stone-600">Use Supabase magic links for a minimal, internal-team-friendly sign-in flow.</p>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button className="btn-primary w-full" disabled={loading}>{loading ? "Sending..." : "Send magic link"}</button>
        </form>
        {message ? <p className="mt-4 text-sm text-stone-600">{message}</p> : null}
      </div>
    </div>
  );
}
