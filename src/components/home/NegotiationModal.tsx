"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export type DemoOffer = {
  id: string;
  title: string;
  price: string;
};

export default function NegotiationModal({
  offer,
  onClose,
  labels,
}: {
  offer: DemoOffer;
  onClose: () => void;
  labels: {
    title: string;
    displayedPrice: string;
    yourPrice: string;
    yourPriceLabel: string;
    message: string;
    messagePlaceholder: string;
    submit: string;
    hint: string;
    close: string;
    sentTitle: string;
    sentText: string;
  };
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement;
    const dialog = dialogRef.current;
    const focusable = dialog?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.[0]?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialog) return;

      const items = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="negotiation-modal-title"
        className="w-full max-w-md rounded-2xl border border-line bg-paper p-6 shadow-xl"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] font-medium tracking-wide text-ink-soft uppercase">
              {labels.title}
            </p>
            <h2
              id="negotiation-modal-title"
              className="mt-1 font-serif text-xl font-semibold text-ink"
            >
              {offer.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={labels.close}
            className="shrink-0 rounded-full p-1.5 text-ink-soft transition-colors hover:bg-bg-alt hover:text-ink"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {sent ? (
          <div className="rounded-xl bg-primary/10 px-4 py-4 text-sm text-primary-dark">
            <p className="font-semibold">{labels.sentTitle}</p>
            <p className="mt-1">{labels.sentText}</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="flex flex-col gap-4"
          >
            <p className="text-sm text-ink-soft">
              {labels.displayedPrice}{" "}
              <span className="font-semibold text-ink">{offer.price}</span>
            </p>

            <div>
              <label
                htmlFor="negotiation-price"
                className="text-sm font-medium text-ink"
              >
                {labels.yourPriceLabel}
              </label>
              <input
                id="negotiation-price"
                name="price"
                type="text"
                inputMode="numeric"
                required
                placeholder={labels.yourPrice}
                className="mt-1 w-full rounded-xl border border-line px-4 py-2.5 text-sm text-ink outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
              />
            </div>

            <div>
              <label
                htmlFor="negotiation-message"
                className="text-sm font-medium text-ink"
              >
                {labels.message}
              </label>
              <textarea
                id="negotiation-message"
                name="message"
                rows={3}
                placeholder={labels.messagePlaceholder}
                className="mt-1 w-full rounded-xl border border-line px-4 py-2.5 text-sm text-ink outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
              />
            </div>

            <p className="text-xs text-ink-soft">{labels.hint}</p>

            <button
              type="submit"
              className="mt-1 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {labels.submit}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
