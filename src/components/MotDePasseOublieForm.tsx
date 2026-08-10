"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { SITE_URL } from "@/lib/site";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";

export default function MotDePasseOublieForm({
  dict,
}: {
  dict: Dictionary["motDePasseOublie"];
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${SITE_URL}/reinitialiser-mot-de-passe`,
    });

    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="mt-6 flex flex-col gap-4">
        <div className="rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary-dark">
          {dict.success}
        </div>
        <Link
          href="/connexion"
          className="text-sm font-semibold text-accent hover:underline"
        >
          {dict.backToLogin}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      <div>
        <label className="text-sm font-medium text-ink">{dict.email}</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
      >
        {loading ? dict.sending : dict.send}
      </button>

      <Link
        href="/connexion"
        className="text-sm text-ink-soft hover:text-accent hover:underline"
      >
        {dict.backToLogin}
      </Link>
    </form>
  );
}
