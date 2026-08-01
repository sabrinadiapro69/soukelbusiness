"use client";

import { useActionState, useState } from "react";
import { createListingAction, type CreateListingState } from "@/app/actions";
import { categories } from "@/lib/queries";
import { wilayas } from "@/lib/wilayas";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";

const postableCategories = categories.filter((c) => c !== "Toutes catégories");

const emojiOptions = [
  "🛍️",
  "🚗",
  "🏠",
  "📱",
  "🛋️",
  "💼",
  "🐾",
  "👗",
  "🔧",
];

const initialState: CreateListingState = { error: null };

export default function PublierForm({
  dict,
}: {
  dict: Dictionary["publier"];
}) {
  const [state, formAction, pending] = useActionState(
    createListingAction,
    initialState
  );
  const [emoji, setEmoji] = useState(emojiOptions[0]);

  if (state.success) {
    return (
      <div className="mt-6 rounded-xl bg-green-50 px-4 py-4 text-sm text-green-700">
        {dict.successMessage}
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      {state.error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <input type="hidden" name="emoji" value={emoji} />
      <div>
        <label className="text-sm font-medium text-ink">
          {dict.chooseIcon}
        </label>
        <div className="mt-1 flex flex-wrap gap-2">
          {emojiOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setEmoji(option)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border text-xl transition-colors ${
                emoji === option
                  ? "border-accent bg-dawn-soft"
                  : "border-line bg-paper hover:bg-bg-alt"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-ink">{dict.title}</label>
        <input
          type="text"
          name="title"
          required
          className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-ink">{dict.price}</label>
          <input
            type="number"
            name="price"
            min={1}
            step="1"
            required
            className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
          />
          <label className="mt-2 flex items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              name="negociable"
              defaultChecked
              className="h-4 w-4 rounded border-line accent-accent"
            />
            {dict.negociable}
          </label>
        </div>
        <div>
          <label className="text-sm font-medium text-ink">
            {dict.category}
          </label>
          <select
            name="category"
            required
            className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
          >
            {postableCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-ink">{dict.wilaya}</label>
        <select
          name="location"
          required
          defaultValue=""
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
        <label className="text-sm font-medium text-ink">
          {dict.description}
        </label>
        <textarea
          name="description"
          required
          rows={5}
          className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
      >
        {pending ? dict.publishing : dict.publish}
      </button>
    </form>
  );
}
