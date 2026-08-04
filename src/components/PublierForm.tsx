"use client";

import { useActionState, useState } from "react";
import { createListingAction, type CreateListingState } from "@/app/actions";
import { categories } from "@/lib/queries";
import { wilayas } from "@/lib/wilayas";
import { wilayasAlgerie } from "@/lib/wilayas-algerie";
import { communesByWilaya } from "@/lib/communes";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";

const postableCategories = categories.filter((c) => c !== "Toutes catégories");

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
  const [selectedWilaya, setSelectedWilaya] = useState("");
  const communeOptions = communesByWilaya[selectedWilaya] ?? [];
  const [isDon, setIsDon] = useState(false);

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

      <div>
        <label className="text-sm font-medium text-ink">{dict.photo1}</label>
        <input
          type="file"
          name="photo1"
          accept="image/*"
          required
          className="mt-1 w-full cursor-pointer text-sm text-ink-soft file:mr-3 file:cursor-pointer file:rounded-full file:border file:border-accent file:bg-paper file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent hover:file:bg-dawn-soft"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-ink">{dict.photo2}</label>
        <input
          type="file"
          name="photo2"
          accept="image/*"
          className="mt-1 w-full cursor-pointer text-sm text-ink-soft file:mr-3 file:cursor-pointer file:rounded-full file:border file:border-accent file:bg-paper file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent hover:file:bg-dawn-soft"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-ink">{dict.photo3}</label>
        <input
          type="file"
          name="photo3"
          accept="image/*"
          className="mt-1 w-full cursor-pointer text-sm text-ink-soft file:mr-3 file:cursor-pointer file:rounded-full file:border file:border-accent file:bg-paper file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent hover:file:bg-dawn-soft"
        />
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
            required={!isDon}
            disabled={isDon}
            className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent disabled:bg-bg-alt disabled:text-ink-soft"
          />
          {!isDon && (
            <label className="mt-2 flex items-center gap-2 text-sm text-ink-soft">
              <input
                type="checkbox"
                name="negociable"
                defaultChecked
                className="h-4 w-4 rounded border-line accent-accent"
              />
              {dict.negociable}
            </label>
          )}
          <label className="mt-2 flex items-center gap-2 text-sm font-medium text-accent">
            <input
              type="checkbox"
              name="don"
              checked={isDon}
              onChange={(e) => setIsDon(e.target.checked)}
              className="h-4 w-4 rounded border-line accent-accent"
            />
            {dict.donLabel}
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
          value={selectedWilaya}
          onChange={(e) => setSelectedWilaya(e.target.value)}
          className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
        >
          <option value="" disabled>
            {dict.chooseWilaya}
          </option>
          <optgroup label={dict.franceGroupLabel}>
            {wilayas.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </optgroup>
          <optgroup label={dict.algerieGroupLabel} disabled>
            {wilayasAlgerie.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {communeOptions.length > 0 && (
        <div>
          <label className="text-sm font-medium text-ink">{dict.commune}</label>
          <select
            name="commune"
            defaultValue=""
            disabled={!selectedWilaya}
            className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent disabled:bg-bg-alt disabled:text-ink-soft"
          >
            <option value="">{dict.chooseCommune}</option>
            {communeOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}

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
