"use client";

import { useActionState } from "react";
import { submitSiretAction, type SubmitSiretState } from "@/app/actions";

const initialState: SubmitSiretState = { error: null };

export default function SiretForm({
  labels,
}: {
  labels: {
    sectionTitle: string;
    sectionText: string;
    nameLabel: string;
    companyNameLabel: string;
    phoneLabel: string;
    contactEmailLabel: string;
    siretLabel: string;
    siretPlaceholder: string;
    submit: string;
    submitting: string;
    hint: string;
  };
}) {
  const [state, formAction, pending] = useActionState(
    submitSiretAction,
    initialState
  );

  return (
    <div className="mx-auto max-w-md rounded-xl border border-line bg-paper px-5 py-5 text-left">
      <h2 className="font-semibold text-ink">{labels.sectionTitle}</h2>
      <p className="mt-1 text-sm text-ink-soft">{labels.sectionText}</p>

      <form action={formAction} className="mt-4 flex flex-col gap-3">
        {state.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        )}

        <div>
          <label htmlFor="siret-name" className="text-sm font-medium text-ink">
            {labels.nameLabel}
          </label>
          <input
            id="siret-name"
            name="name"
            type="text"
            required
            className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
          />
        </div>

        <div>
          <label
            htmlFor="siret-company-name"
            className="text-sm font-medium text-ink"
          >
            {labels.companyNameLabel}
          </label>
          <input
            id="siret-company-name"
            name="companyName"
            type="text"
            required
            className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
          />
        </div>

        <div>
          <label htmlFor="siret-phone" className="text-sm font-medium text-ink">
            {labels.phoneLabel}
          </label>
          <input
            id="siret-phone"
            name="phone"
            type="tel"
            required
            className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
          />
        </div>

        <div>
          <label
            htmlFor="siret-contact-email"
            className="text-sm font-medium text-ink"
          >
            {labels.contactEmailLabel}
          </label>
          <input
            id="siret-contact-email"
            name="contactEmail"
            type="email"
            required
            className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
          />
        </div>

        <div>
          <label htmlFor="siret" className="text-sm font-medium text-ink">
            {labels.siretLabel}
          </label>
          <input
            id="siret"
            name="siret"
            type="text"
            inputMode="numeric"
            required
            placeholder={labels.siretPlaceholder}
            className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
        >
          {pending ? labels.submitting : labels.submit}
        </button>

        <p className="text-xs text-ink-soft">{labels.hint}</p>
      </form>
    </div>
  );
}
