"use client";

import { useActionState, useState } from "react";
import { updateListingAction, type UpdateListingState } from "@/app/actions";
import { compressPhotoInput } from "@/lib/imageCompression";
import { categories, getListingPhotoUrl, type Listing } from "@/lib/queries";
import { wilayas } from "@/lib/wilayas";
import { wilayasAlgerie } from "@/lib/wilayas-algerie";
import { communesByWilaya } from "@/lib/communes";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";

const postableCategories = categories.filter((c) => c !== "Toutes catégories");

const initialState: UpdateListingState = { error: null };

export default function ModifierListingForm({
  listing,
  dict,
}: {
  listing: Listing;
  dict: Dictionary["publier"] & Dictionary["modifier"];
}) {
  const [state, formAction, pending] = useActionState(
    updateListingAction,
    initialState
  );
  const [selectedWilaya, setSelectedWilaya] = useState(listing.location);
  const communeOptions = communesByWilaya[selectedWilaya] ?? [];
  const [isDon, setIsDon] = useState(listing.is_don);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <input type="hidden" name="listingId" value={listing.id} />

      {state.error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {listing.photos.length > 0 && (
        <div>
          <label className="text-sm font-medium text-ink">
            {dict.currentPhotos}
          </label>
          <div className="mt-1 flex gap-3">
            {listing.photos.map((path) => (
              <img
                key={path}
                src={getListingPhotoUrl(path)}
                alt={listing.title}
                className="h-20 w-20 rounded-xl object-cover"
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-ink">
          {dict.replacePhotos}
        </label>
        <input
          type="file"
          name="photo1"
          accept="image/*"
          onChange={(e) => compressPhotoInput(e.currentTarget)}
          className="mt-1 w-full cursor-pointer text-sm text-ink-soft file:mr-3 file:cursor-pointer file:rounded-full file:border file:border-accent file:bg-paper file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent hover:file:bg-dawn-soft"
        />
        <input
          type="file"
          name="photo2"
          accept="image/*"
          onChange={(e) => compressPhotoInput(e.currentTarget)}
          className="mt-2 w-full cursor-pointer text-sm text-ink-soft file:mr-3 file:cursor-pointer file:rounded-full file:border file:border-accent file:bg-paper file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent hover:file:bg-dawn-soft"
        />
        <input
          type="file"
          name="photo3"
          accept="image/*"
          onChange={(e) => compressPhotoInput(e.currentTarget)}
          className="mt-2 w-full cursor-pointer text-sm text-ink-soft file:mr-3 file:cursor-pointer file:rounded-full file:border file:border-accent file:bg-paper file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent hover:file:bg-dawn-soft"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-ink">{dict.title}</label>
        <input
          type="text"
          name="title"
          defaultValue={listing.title}
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
            min={0.01}
            step="0.01"
            defaultValue={isDon ? undefined : listing.price}
            required={!isDon}
            disabled={isDon}
            className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent disabled:bg-bg-alt disabled:text-ink-soft"
          />
          {!isDon && (
            <label className="mt-2 flex items-center gap-2 text-sm text-ink-soft">
              <input
                type="checkbox"
                name="negociable"
                defaultChecked={listing.negociable}
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
            defaultValue={listing.category}
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
            defaultValue={listing.commune ?? ""}
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
          defaultValue={listing.description}
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
        {pending ? dict.saving : dict.save}
      </button>
    </form>
  );
}
