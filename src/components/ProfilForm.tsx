"use client";

import { useActionState, useState } from "react";
import {
  addPortfolioItemAction,
  removePortfolioItemAction,
  updateProfileAction,
  type UpdateProfileState,
} from "@/app/actions";
import { wilayas } from "@/lib/wilayas";
import { wilayasAlgerie } from "@/lib/wilayas-algerie";
import { compressPhotoInput } from "@/lib/imageCompression";
import { getPortfolioPhotoUrl, type PortfolioItem } from "@/lib/queries";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";

const emojiOptions = [
  "🧑🏽",
  "👩🏽",
  "👨🏽",
  "🧕🏽",
  "🧔🏽",
  "👳🏽",
  "👱🏼",
  "🧑🏾‍🦱",
  "👩🏾‍🦱",
  "🧑🏻‍🦳",
  "👵🏽",
  "👴🏾",
];

const initialState: UpdateProfileState = { error: null };

const categorieOptions = ["evenements", "decoration", "mode", "creation"] as const;

export default function ProfilForm({
  seller,
  metier,
  categories,
  portfolio,
  dict,
}: {
  seller: {
    name: string;
    city: string;
    description: string;
    avatar_emoji: string;
    type: "particulier" | "pro";
  };
  metier: string;
  categories: string[];
  portfolio: PortfolioItem[];
  dict: Dictionary["profilForm"];
}) {
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    initialState
  );
  const [avatar, setAvatar] = useState(seller.avatar_emoji);

  const categorieLabels: Record<(typeof categorieOptions)[number], string> = {
    evenements: dict.categorieEvenements,
    decoration: dict.categorieDecoration,
    mode: dict.categorieMode,
    creation: dict.categorieCreation,
  };

  return (
    <>
    <form action={formAction} className="mt-4 flex flex-col gap-4">
      {state.error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
          {dict.successMessage}
        </div>
      )}

      <input type="hidden" name="avatar_emoji" value={avatar} />
      <div>
        <label className="text-sm font-medium text-ink">
          {dict.chooseAvatar}
        </label>
        <div className="mt-1 flex flex-wrap gap-2">
          {emojiOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setAvatar(option)}
              className={`flex h-10 w-10 items-center justify-center rounded-full border text-xl transition-colors ${
                avatar === option
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
        <label className="text-sm font-medium text-ink">{dict.name}</label>
        <input
          type="text"
          name="name"
          required
          defaultValue={seller.name}
          className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-ink">{dict.wilaya}</label>
        <select
          name="city"
          required
          defaultValue={seller.city}
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

      <div>
        <label className="text-sm font-medium text-ink">{dict.bio}</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={seller.description}
          className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
        />
      </div>

      {seller.type === "pro" && (
        <div>
          <label className="text-sm font-medium text-ink">
            {dict.metier}
          </label>
          <input
            type="text"
            name="metier"
            placeholder={dict.metierPlaceholder}
            defaultValue={metier}
            className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
          />
        </div>
      )}

      {seller.type === "pro" && (
        <div>
          <label className="text-sm font-medium text-ink">
            {dict.categoriesLabel}
          </label>
          <p className="mt-0.5 text-xs text-ink-soft">{dict.categoriesHint}</p>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
            {categorieOptions.map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 text-sm text-ink"
              >
                <input
                  type="checkbox"
                  name="categories"
                  value={option}
                  defaultChecked={categories.includes(option)}
                  className="h-4 w-4 accent-accent"
                />
                {categorieLabels[option]}
              </label>
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
      >
        {pending ? dict.saving : dict.save}
      </button>
    </form>

    {seller.type === "pro" && (
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-ink">{dict.myPortfolio}</h2>
        <p className="mt-1 text-sm text-ink-soft">{dict.portfolioHint}</p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {portfolio.map((item) => (
            <div
              key={item.id}
              className="relative rounded-xl border border-line bg-paper p-4"
            >
              <form action={removePortfolioItemAction}>
                <input type="hidden" name="itemId" value={item.id} />
                <button
                  type="submit"
                  className="absolute top-2 right-2 text-xs text-ink-soft hover:text-accent-dark"
                  aria-label={dict.removeItem}
                >
                  ✕
                </button>
              </form>
              <div className="flex gap-2">
                {item.photos.map((path) => (
                  <img
                    key={path}
                    src={getPortfolioPhotoUrl(path)}
                    alt={item.title}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                ))}
              </div>
              <p className="mt-2 text-sm font-semibold text-ink">
                {item.title}
              </p>
              {item.description && (
                <p className="mt-1 text-xs text-ink-soft">
                  {item.description}
                </p>
              )}
            </div>
          ))}
          {portfolio.length === 0 && (
            <p className="col-span-full text-sm text-ink-soft">
              {dict.noPortfolioItems}
            </p>
          )}
        </div>

        <form
          action={addPortfolioItemAction}
          className="mt-5 flex flex-col gap-3 rounded-xl border border-line bg-bg-alt p-4"
        >
          <input
            type="text"
            name="title"
            required
            placeholder={dict.titlePlaceholder}
            className="w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
          />
          <input
            type="text"
            name="description"
            placeholder={dict.descriptionPlaceholder}
            className="w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
          />
          <div>
            <label className="text-xs font-medium text-ink-soft">
              {dict.photo1}
            </label>
            <input
              type="file"
              name="photo1"
              accept="image/*"
              required
              onChange={(e) => compressPhotoInput(e.currentTarget)}
              className="mt-1 w-full cursor-pointer text-sm text-ink-soft file:mr-3 file:cursor-pointer file:rounded-full file:border file:border-accent file:bg-paper file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent hover:file:bg-dawn-soft"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-soft">
              {dict.photo2}
            </label>
            <input
              type="file"
              name="photo2"
              accept="image/*"
              onChange={(e) => compressPhotoInput(e.currentTarget)}
              className="mt-1 w-full cursor-pointer text-sm text-ink-soft file:mr-3 file:cursor-pointer file:rounded-full file:border file:border-accent file:bg-paper file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent hover:file:bg-dawn-soft"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-soft">
              {dict.photo3}
            </label>
            <input
              type="file"
              name="photo3"
              accept="image/*"
              onChange={(e) => compressPhotoInput(e.currentTarget)}
              className="mt-1 w-full cursor-pointer text-sm text-ink-soft file:mr-3 file:cursor-pointer file:rounded-full file:border file:border-accent file:bg-paper file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent hover:file:bg-dawn-soft"
            />
          </div>
          <button
            type="submit"
            className="self-start rounded-full border border-accent px-5 py-2 text-sm font-semibold text-accent transition-colors hover:bg-dawn-soft"
          >
            {dict.addToPortfolio}
          </button>
        </form>
      </div>
    )}
    </>
  );
}
