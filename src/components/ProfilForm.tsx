"use client";

import { useActionState, useState } from "react";
import { updateProfileAction, type UpdateProfileState } from "@/app/actions";
import { wilayas } from "@/lib/wilayas";

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

const initialState: UpdateProfileState = { error: null };

export default function ProfilForm({
  seller,
}: {
  seller: {
    name: string;
    city: string;
    description: string;
    avatar_emoji: string;
  };
}) {
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    initialState
  );
  const [avatar, setAvatar] = useState(seller.avatar_emoji);

  return (
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

      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
      >
        {pending ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>
  );
}
