"use client";

import { useActionState, useState } from "react";
import { updateProfileAction, type UpdateProfileState } from "@/app/actions";

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
        <label className="text-sm font-medium text-stone-700">
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
        <label className="text-sm font-medium text-stone-700">Nom</label>
        <input
          type="text"
          name="name"
          required
          defaultValue={seller.name}
          className="mt-1 w-full rounded-xl border border-orange-100 px-4 py-2 text-sm text-stone-900 outline-none focus:border-orange-400"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-stone-700">Ville</label>
        <input
          type="text"
          name="city"
          required
          defaultValue={seller.city}
          className="mt-1 w-full rounded-xl border border-orange-100 px-4 py-2 text-sm text-stone-900 outline-none focus:border-orange-400"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-stone-700">
          Bio / description
        </label>
        <textarea
          name="description"
          rows={4}
          defaultValue={seller.description}
          className="mt-1 w-full rounded-xl border border-orange-100 px-4 py-2 text-sm text-stone-900 outline-none focus:border-orange-400"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700 disabled:opacity-60"
      >
        {pending ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>
  );
}
