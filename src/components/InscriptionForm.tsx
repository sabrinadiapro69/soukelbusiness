"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { wilayas } from "@/lib/wilayas";

export default function InscriptionForm() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState<"particulier" | "pro">("particulier");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, city, type },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      window.location.href = "/";
      return;
    }

    setConfirmationSent(true);
  };

  if (confirmationSent) {
    return (
      <div className="mt-6 rounded-xl bg-green-50 px-4 py-4 text-sm text-green-700">
        Un email de confirmation vous a été envoyé à <strong>{email}</strong>.
        Cliquez sur le lien qu&apos;il contient pour activer votre compte,
        puis{" "}
        <Link href="/connexion" className="underline">
          connectez-vous
        </Link>
        .
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-ink">Nom</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-ink">Wilaya</label>
        <select
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
        >
          <option value="" disabled>
            Choisir une wilaya
          </option>
          {wilayas.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-ink">Vous êtes</label>
        <div className="mt-1 flex gap-2">
          {(
            [
              { value: "particulier", label: "Particulier" },
              { value: "pro", label: "Professionnel" },
            ] as const
          ).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setType(option.value)}
              className={`flex-1 rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                type === option.value
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-paper text-ink-soft hover:bg-bg-alt"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

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
        <label className="text-sm font-medium text-ink">Mot de passe</label>
        <input
          type="password"
          required
          minLength={6}
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
        {loading ? "Création..." : "Créer mon compte"}
      </button>

      <p className="text-sm text-ink-soft">
        Déjà inscrit ?{" "}
        <Link href="/connexion" className="text-accent hover:underline">
          Connectez-vous
        </Link>
      </p>
    </form>
  );
}
