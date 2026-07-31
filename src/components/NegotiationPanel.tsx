import Link from "next/link";
import { formatDA, type Offer } from "@/lib/queries";
import {
  acceptCounterAction,
  concludeTransactionAction,
  makeOfferAction,
} from "@/app/actions";

export default function NegotiationPanel({
  listingId,
  askingPrice,
  negociable,
  sellerName,
  userId,
  offer,
}: {
  listingId: number;
  askingPrice: number;
  negociable: boolean;
  sellerName: string;
  userId: string | null;
  offer: Offer | null;
}) {
  if (!negociable) {
    return (
      <div className="rounded-2xl border border-line bg-paper p-5">
        <h2 className="font-semibold text-ink">Prix ferme</h2>
        <p className="mt-1 text-sm text-ink-soft">
          {sellerName} ne souhaite pas négocier ce prix. Vous pouvez la/le
          contacter pour toute question.
        </p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="rounded-2xl border border-line bg-paper p-5">
        <h2 className="font-semibold text-ink">Négocier le prix</h2>
        <p className="mt-1 text-sm text-ink-soft">
          <Link href="/connexion" className="text-accent hover:underline">
            Connectez-vous
          </Link>{" "}
          pour faire une offre à {sellerName}.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <h2 className="font-semibold text-ink">Négocier le prix</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Prix affiché :{" "}
        <span className="font-semibold">{formatDA(askingPrice)}</span> —
        proposez votre prix, {sellerName} pourra l&apos;accepter ou faire une
        contre-offre.
      </p>

      {offer?.statut === "en_attente" && (
        <div className="mt-4 rounded-xl bg-bg-alt px-4 py-3 text-sm text-ink">
          Votre offre de {formatDA(offer.montant_propose)} est en attente de
          réponse du vendeur.
        </div>
      )}

      {offer?.statut === "refusee" && (
        <div className="mt-4 rounded-xl bg-bg-alt px-4 py-3 text-sm text-ink-soft">
          Votre offre a été refusée. Vous pouvez en proposer une nouvelle.
        </div>
      )}

      {offer?.statut === "contre_offre" && (
        <div className="mt-4 flex flex-col gap-3">
          <div className="rounded-xl bg-bg-alt px-4 py-3 text-sm text-ink">
            {sellerName} propose {formatDA(offer.montant_propose)}.
          </div>
          <form action={acceptCounterAction} className="flex gap-2">
            <input type="hidden" name="offerId" value={offer.id} />
            <input type="hidden" name="listingId" value={listingId} />
            <button
              type="submit"
              className="rounded-full border border-accent px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-dawn-soft"
            >
              Accepter à {formatDA(offer.montant_propose)}
            </button>
          </form>
        </div>
      )}

      {offer?.statut === "acceptee" && (
        <div className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          🎉 Prix fixé à {formatDA(offer.montant_propose)} !{" "}
          {offer.conclue_par_acheteur ? (
            "Transaction marquée comme conclue."
          ) : (
            <form action={concludeTransactionAction} className="mt-2">
              <input type="hidden" name="offerId" value={offer.id} />
              <input type="hidden" name="listingId" value={listingId} />
              <button
                type="submit"
                className="rounded-full bg-green-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-green-800"
              >
                Marquer cette transaction comme conclue
              </button>
            </form>
          )}
        </div>
      )}

      {offer?.statut !== "acceptee" && (
        <form
          action={makeOfferAction}
          className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <input type="hidden" name="listingId" value={listingId} />
          <div className="flex-1">
            <label className="text-xs font-medium text-ink-soft">
              Votre offre (DA)
            </label>
            <input
              type="number"
              name="montant"
              min={1}
              step="1"
              defaultValue={
                offer
                  ? offer.montant_propose
                  : Math.round(askingPrice * 0.85)
              }
              className="mt-1 w-full rounded-xl border border-line px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
          >
            {offer?.statut === "contre_offre"
              ? "Contre-offre"
              : "Envoyer mon offre"}
          </button>
        </form>
      )}
    </div>
  );
}
