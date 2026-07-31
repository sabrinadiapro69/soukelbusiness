"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

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
        <label className="text-sm font-medium text-stone-700">Nom</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-xl border border-orange-100 px-4 py-2 text-sm text-stone-900 outline-none focus:border-orange-400"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-stone-700">Ville</label>
        <input
          type="text"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="mt-1 w-full rounded-xl border border-orange-100 px-4 py-2 text-sm text-stone-900 outline-none focus:border-orange-400"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-stone-700">
          Vous êtes
        </label>
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
                  ? "border-orange-600 bg-orange-600 text-white"
                  : "border-orange-100 bg-white text-stone-600 hover:bg-orange-50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-stone-700">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl border border-orange-100 px-4 py-2 text-sm text-stone-900 outline-none focus:border-orange-400"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-stone-700">
          Mot de passe
        </label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-xl border border-orange-100 px-4 py-2 text-sm text-stone-900 outline-none focus:border-orange-400"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700 disabled:opacity-60"
      >
        {loading ? "Création..." : "Créer mon compte"}
      </button>

      <p className="text-sm text-stone-500">
        Déjà inscrit ?{" "}
        <Link href="/connexion" className="text-orange-700 hover:underline">
          Connectez-vous
        </Link>
      </p>
    </form>
  );
}
