"use client";

import { useState } from "react";

const CONTACT_EMAIL = "contact@one-concept.fr";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")?.toString() ?? "";
    const email = formData.get("email")?.toString() ?? "";
    const subject = formData.get("subject")?.toString() ?? "";
    const message = formData.get("message")?.toString() ?? "";

    const mailtoBody = `${message}\n\n— ${name} (${email})`;
    const mailtoLink = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject || "Message depuis Souk El Business"
    )}&body=${encodeURIComponent(mailtoBody)}`;

    window.location.href = mailtoLink;
    setSent(true);
  };

  return (
    <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
      <div className="lg:col-span-2">
        {sent && (
          <div className="mb-6 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            Votre client email a dû s&apos;ouvrir avec votre message
            prérempli — il ne reste qu&apos;à l&apos;envoyer.
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-ink">
                Nom
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
                Email
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
              Sujet
            </label>
            <input
              type="text"
              name="subject"
              className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">
              Message
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
            Envoyer le message
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-6 h-fit">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft/70">
            Email
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
            Localisation
          </p>
          <p className="text-sm text-ink">Vaulx-en-Velin, France</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft/70">
            Éditeur
          </p>
          <p className="text-sm text-ink">One Concept</p>
        </div>
      </div>
    </div>
  );
}
