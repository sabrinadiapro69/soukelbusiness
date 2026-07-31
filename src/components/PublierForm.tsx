"use client";

import { useActionState, useState } from "react";
import { createListingAction, type CreateListingState } from "@/app/actions";
import { categories } from "@/lib/queries";

const postableCategories = categories.filter((c) => c !== "Toutes catégories");

const emojiOptions = [
  "🛍️",
  "🫖",
  "🧶",
  "🌶️",
  "🏺",
  "💍",
  "🧵",
  "🧴",
  "👡",
  "👜",
  "🏮",
  "💎",
  "🌿",
];

const initialState: CreateListingState = { error: null };

export default function PublierForm() {
  const [state, formAction, pending] = useActionState(
    createListingAction,
    initialState
  );
  const [emoji, setEmoji] = useState(emojiOptions[0]);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      {state.error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <input type="hidden" name="emoji" value={emoji} />
      <div>
        <label className="text-sm font-medium text-stone-700">
          Choisir une icône
        </label>
        <div className="mt-1 flex flex-wrap gap-2">
          {emojiOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setEmoji(option)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border text-xl transition-colors ${
                emoji === option
                  ? "border-orange-600 bg-orange-100"
                  : "border-orange-100 bg-white hover:bg-orange-50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-stone-700">Titre</label>
        <input
          type="text"
          name="title"
          required
          className="mt-1 w-full rounded-xl border border-orange-100 px-4 py-2 text-sm text-stone-900 outline-none focus:border-orange-400"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-stone-700">
            Prix (€)
          </label>
          <input
            type="number"
            name="price"
            min={1}
            step="0.01"
            required
            className="mt-1 w-full rounded-xl border border-orange-100 px-4 py-2 text-sm text-stone-900 outline-none focus:border-orange-400"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-stone-700">
            Catégorie
          </label>
          <select
            name="category"
            required
            className="mt-1 w-full rounded-xl border border-orange-100 px-4 py-2 text-sm text-stone-900 outline-none focus:border-orange-400"
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
        <label className="text-sm font-medium text-stone-700">Ville</label>
        <input
          type="text"
          name="location"
          required
          className="mt-1 w-full rounded-xl border border-orange-100 px-4 py-2 text-sm text-stone-900 outline-none focus:border-orange-400"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-stone-700">
          Description
        </label>
        <textarea
          name="description"
          required
          rows={5}
          className="mt-1 w-full rounded-xl border border-orange-100 px-4 py-2 text-sm text-stone-900 outline-none focus:border-orange-400"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700 disabled:opacity-60"
      >
        {pending ? "Publication..." : "Publier l'annonce"}
      </button>
    </form>
  );
}
