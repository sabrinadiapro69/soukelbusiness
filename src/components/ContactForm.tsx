"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";

const CONTACT_EMAIL = "contact@one-concept.fr";

export default function ContactForm({
  dict,
}: {
  dict: Dictionary["contact"];
}) {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")?.toString() ?? "";
    const email = formData.get("email")?.toString() ?? "";
    const subject = formData.get("subject")?.toString() ?? "";
    const message = formData.get("message")?.toString() ?? "";

    const mailtoBody = `${message}\n\n${name} (${email})`;
    const mailtoLink = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject || dict.defaultSubject
    )}&body=${encodeURIComponent(mailtoBody)}`;

    window.location.href = mailtoLink;
    setSent(true);
  };

  return (
    <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
      <div className="lg:col-span-2">
        {sent && (
          <div className="mb-6 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {dict.sentMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-ink">
                {dict.name}
              </label>
              <input
                type="text"
                name="name"
                required
                className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink">
                {dict.email}
              </label>
              <input
                type="email"
                name="email"
                required
                className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-ink">
              {dict.subject}
            </label>
            <input
              type="text"
              name="subject"
              className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">
              {dict.message}
            </label>
            <textarea
              name="message"
              required
              rows={6}
              className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
            />
          </div>
          <button
            type="submit"
            className="mt-2 self-start rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
          >
            {dict.send}
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-6 h-fit">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft/70">
            {dict.emailLabel}
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-sm font-medium text-accent hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft/70">
            {dict.locationLabel}
          </p>
          <p className="text-sm text-ink">{dict.location}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft/70">
            {dict.publisherLabel}
          </p>
          <p className="text-sm text-ink">{dict.publisher}</p>
        </div>
      </div>
    </div>
  );
}
