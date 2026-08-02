"use client";

import { useState } from "react";
import Link from "next/link";
import { createReportAction } from "@/app/actions";

const motifs = [
  "Arnaque ou fraude",
  "Contenu inapproprié",
  "Faux profil / usurpation",
  "Annonce interdite ou frauduleuse",
  "Autre",
];

export default function ReportButton({
  type,
  targetId,
  redirectTo,
  isLoggedIn,
  label,
  motifLabel,
  descriptionLabel,
  submitLabel,
  cancelLabel,
}: {
  type: "annonce" | "utilisateur";
  targetId: string | number;
  redirectTo: string;
  isLoggedIn: boolean;
  label: string;
  motifLabel: string;
  descriptionLabel: string;
  submitLabel: string;
  cancelLabel: string;
}) {
  const [open, setOpen] = useState(false);

  if (!isLoggedIn) {
    return (
      <Link
        href="/connexion"
        className="text-xs font-medium text-ink-soft underline hover:text-ink"
      >
        {label}
      </Link>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-medium text-ink-soft underline hover:text-ink"
      >
        {label}
      </button>
    );
  }

  return (
    <form
      action={createReportAction}
      className="mt-2 flex flex-col gap-2 rounded-xl border border-line bg-bg-alt p-4 text-sm"
    >
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="targetId" value={targetId} />
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <label className="text-xs font-medium text-ink-soft">
        {motifLabel}
      </label>
      <select
        name="motif"
        required
        className="rounded-lg border border-line bg-paper px-3 py-2 text-sm"
      >
        {motifs.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <label className="text-xs font-medium text-ink-soft">
        {descriptionLabel}
      </label>
      <textarea
        name="description"
        rows={3}
        className="rounded-lg border border-line bg-paper px-3 py-2 text-sm"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-full bg-accent px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-accent-dark"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full border border-line px-4 py-2 text-xs font-medium text-ink-soft transition-colors hover:border-ink"
        >
          {cancelLabel}
        </button>
      </div>
    </form>
  );
}
