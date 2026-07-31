"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ConnexionForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    window.location.href = "/";
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-ink">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-ink">
          Mot de passe
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
      >
        {loading ? "Connexion..." : "Se connecter"}
      </button>

      <p className="text-sm text-ink-soft">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="text-accent hover:underline">
          Inscrivez-vous
        </Link>
      </p>
    </form>
  );
}
