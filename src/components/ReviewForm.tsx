"use client";

import { useActionState } from "react";
import { submitReviewAction, type SubmitReviewState } from "@/app/actions";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";

const initialState: SubmitReviewState = { error: null };

export default function ReviewForm({
  offerId,
  dict,
}: {
  offerId: number;
  dict: Dictionary["reviewForm"];
}) {
  const [state, formAction, pending] = useActionState(
    submitReviewAction,
    initialState
  );

  if (state.success) {
    return (
      <p className="mt-3 text-sm font-medium text-green-700">
        {dict.thankYou}
      </p>
    );
  }

  return (
    <form
      action={formAction}
      className="mt-3 flex flex-col gap-2 rounded-xl border border-line bg-bg-alt p-4"
    >
      <input type="hidden" name="offerId" value={offerId} />
      {state.error && (
        <div className="text-sm text-red-700">{state.error}</div>
      )}
      <label className="text-xs font-medium text-ink-soft">
        {dict.yourRating}
      </label>
      <select
        name="rating"
        defaultValue="5"
        className="w-24 rounded-xl border border-line px-3 py-2 text-sm text-ink outline-none focus:border-accent"
      >
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>
            {n} ★
          </option>
        ))}
      </select>
      <label className="text-xs font-medium text-ink-soft">
        {dict.commentOptional}
      </label>
      <textarea
        name="comment"
        rows={2}
        className="w-full rounded-xl border border-line px-3 py-2 text-sm text-ink outline-none focus:border-accent"
      />
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
      >
        {pending ? dict.sending : dict.submit}
      </button>
    </form>
  );
}
