"use client";

import { useActionState, useState } from "react";
import {
  addPortfolioItemAction,
  removePortfolioItemAction,
  updateProfileAction,
  type UpdateProfileState,
} from "@/app/actions";
import { wilayas } from "@/lib/wilayas";
import type { PortfolioItem } from "@/lib/queries";

const emojiOptions = [
  "🙂",
  "😊",
  "😎",
  "🥳",
  "🤓",
  "🧕",
  "🧔",
  "👩",
  "👨",
  "👵",
  "👴",
  "🧑",
];

const portfolioEmojiOptions = ["🛠️", "🎨", "🏗️", "✂️", "🍽️", "🚿", "⚡", "🚗"];

const initialState: UpdateProfileState = { error: null };

export default function ProfilForm({
  seller,
  metier,
  portfolio,
}: {
  seller: {
    name: string;
    city: string;
    description: string;
    avatar_emoji: string;
    type: "particulier" | "pro";
  };
  metier: string;
  portfolio: PortfolioItem[];
}) {
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    initialState
  );
  const [avatar, setAvatar] = useState(seller.avatar_emoji);
  const [portfolioEmoji, setPortfolioEmoji] = useState(
    portfolioEmojiOptions[0]
  );

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
          Profil mis à jour avec succès !
        </div>
      )}

      <input type="hidden" name="avatar_emoji" value={avatar} />
      <div>
        <label className="text-sm font-medium text-ink">
          Choisir un avatar
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
        <label className="text-sm font-medium text-ink">Nom</label>
        <input
          type="text"
          name="name"
          required
          defaultValue={seller.name}
          className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-ink">Wilaya</label>
        <select
          name="city"
          required
          defaultValue={seller.city}
          className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
        >
          <option value="" disabled>
            Choisir une wilaya
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
          Bio / description
        </label>
        <textarea
          name="description"
          rows={4}
          defaultValue={seller.description}
          className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
        />
      </div>

      {seller.type === "pro" && (
        <div>
          <label className="text-sm font-medium text-ink">Métier</label>
          <input
            type="text"
            name="metier"
            placeholder="Ex : Plombier, Couturière, Photographe..."
            defaultValue={metier}
            className="mt-1 w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
      >
        {pending ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>

    {seller.type === "pro" && (
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-ink">Mon portfolio</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Quelques réalisations à montrer aux visiteurs de votre profil.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
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
                  aria-label="Retirer cette réalisation"
                >
                  ✕
                </button>
              </form>
              <div className="text-2xl">{item.emoji}</div>
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
              Aucune réalisation ajoutée pour l&apos;instant.
            </p>
          )}
        </div>

        <form
          action={addPortfolioItemAction}
          className="mt-5 flex flex-col gap-3 rounded-xl border border-line bg-bg-alt p-4"
        >
          <input type="hidden" name="emoji" value={portfolioEmoji} />
          <div className="flex flex-wrap gap-2">
            {portfolioEmojiOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setPortfolioEmoji(option)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg border text-lg transition-colors ${
                  portfolioEmoji === option
                    ? "border-accent bg-dawn-soft"
                    : "border-line bg-paper hover:bg-bg-alt"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <input
            type="text"
            name="title"
            required
            placeholder="Titre de la réalisation"
            className="w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
          />
          <input
            type="text"
            name="description"
            placeholder="Description courte (facultatif)"
            className="w-full rounded-xl border border-line px-4 py-2 text-sm text-ink outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="self-start rounded-full border border-accent px-5 py-2 text-sm font-semibold text-accent transition-colors hover:bg-dawn-soft"
          >
            Ajouter au portfolio
          </button>
        </form>
      </div>
    )}
    </>
  );
}
