"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { wilayas } from "@/lib/wilayas";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";
import type { Locale } from "@/lib/i18n/locale";
import { formatConfirmationSent } from "@/lib/i18n/format";

export default function InscriptionForm({
  dict,
  locale,
}: {
  dict: Dictionary["inscription"];
  locale: Locale;
}) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState<"particulier" | "pro">("particulier");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!accepted) {
      setError(dict.acceptError);
      return;
    }

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
        {formatConfirmationSent(locale, email)} {dict.confirmationInstructions}{" "}
        <Link href="/connexion" className="underline">
          {dict.loginLink}
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
        <label className="text-sm font-medium text-ink">{dict.name}</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-ink">{dict.wilaya}</label>
        <select
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
        >
          <option value="" disabled>
            {dict.chooseWilaya}
          </option>
          {wilayas.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-ink">{dict.youAre}</label>
        <div className="mt-1 flex gap-2">
          {(
            [
              { value: "particulier", label: dict.particulier },
              { value: "pro", label: dict.professionnel },
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
        <label className="text-sm font-medium text-ink">{dict.email}</label>
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
          {dict.password}
        </label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
        />
      </div>

      <label className="flex items-start gap-2 text-sm text-ink-soft">
        <input
          type="checkbox"
          required
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-line accent-accent"
        />
        <span>
          {dict.acceptPrefix}{" "}
          <Link href="/cgu" className="text-accent hover:underline">
            {dict.cgu}
          </Link>{" "}
          {dict.and}{" "}
          <Link href="/confidentialite" className="text-accent hover:underline">
            {dict.privacy}
          </Link>
          .
        </span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
      >
        {loading ? dict.creating : dict.createAccount}
      </button>

      <p className="text-sm text-ink-soft">
        {dict.alreadyRegistered}{" "}
        <Link href="/connexion" className="text-accent hover:underline">
          {dict.signIn}
        </Link>
      </p>
    </form>
  );
}
