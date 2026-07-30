"use client";

import { useState } from "react";

type Message = {
  author: "buyer" | "seller";
  price: number;
  text: string;
};

type Status = "idle" | "negotiating" | "responding" | "accepted" | "closed";

const MAX_ROUNDS = 4;

function computeSellerResponse(
  offer: number,
  askingPrice: number
): { accept: boolean; counter: number } {
  if (offer >= askingPrice * 0.9) {
    return { accept: true, counter: offer };
  }
  const counter = Math.round((offer + askingPrice) / 2);
  if (counter - offer <= 2) {
    return { accept: true, counter: offer };
  }
  return { accept: false, counter };
}

export default function NegotiationPanel({
  askingPrice,
  sellerName,
}: {
  askingPrice: number;
  sellerName: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [rounds, setRounds] = useState(0);
  const [offerInput, setOfferInput] = useState(
    String(Math.round(askingPrice * 0.85))
  );
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [lastSellerOffer, setLastSellerOffer] = useState<number | null>(null);

  const sendOffer = (price: number) => {
    if (!Number.isFinite(price) || price <= 0) return;

    const buyerMessage: Message = {
      author: "buyer",
      price,
      text: `Je propose ${price} €`,
    };
    setMessages((prev) => [...prev, buyerMessage]);
    setStatus("responding");

    const nextRound = rounds + 1;
    setRounds(nextRound);

    window.setTimeout(() => {
      if (nextRound >= MAX_ROUNDS) {
        setMessages((prev) => [
          ...prev,
          {
            author: "seller",
            price,
            text: "Je ne peux pas descendre davantage sur cette négociation, mais contactez-moi directement si vous voulez en discuter.",
          },
        ]);
        setStatus("closed");
        return;
      }

      const { accept, counter } = computeSellerResponse(price, askingPrice);
      if (accept) {
        setMessages((prev) => [
          ...prev,
          {
            author: "seller",
            price,
            text: `Marché conclu, j'accepte ${price} € !`,
          },
        ]);
        setFinalPrice(price);
        setStatus("accepted");
      } else {
        setMessages((prev) => [
          ...prev,
          {
            author: "seller",
            price: counter,
            text: `Je peux descendre à ${counter} €, ça vous va ?`,
          },
        ]);
        setOfferInput(String(counter));
        setLastSellerOffer(counter);
        setStatus("negotiating");
      }
    }, 1200);
  };

  const acceptCounter = (price: number) => {
    setMessages((prev) => [
      ...prev,
      { author: "buyer", price, text: `J'accepte ${price} €` },
    ]);
    setFinalPrice(price);
    setStatus("accepted");
  };

  return (
    <div className="rounded-2xl border border-orange-100 bg-white p-5">
      <h2 className="font-semibold text-stone-900">Négocier le prix</h2>
      <p className="mt-1 text-sm text-stone-500">
        Prix affiché : <span className="font-semibold">{askingPrice} €</span>{" "}
        — proposez votre prix, {sellerName} pourra l&apos;accepter ou faire
        une contre-offre.
      </p>

      {messages.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                message.author === "buyer"
                  ? "ml-auto bg-orange-600 text-white"
                  : "bg-stone-100 text-stone-700"
              }`}
            >
              {message.text}
            </div>
          ))}
          {status === "responding" && (
            <div className="max-w-[85%] rounded-2xl bg-stone-100 px-4 py-2 text-sm text-stone-400">
              {sellerName} est en train de répondre...
            </div>
          )}
        </div>
      )}

      {status === "accepted" && finalPrice !== null && (
        <div className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          🎉 Prix fixé à {finalPrice} € ! Contactez {sellerName} pour
          finaliser la transaction.
        </div>
      )}

      {status === "closed" && (
        <div className="mt-4 rounded-xl bg-stone-50 px-4 py-3 text-sm text-stone-600">
          Négociation terminée pour cette session — contactez le vendeur
          directement pour continuer la discussion.
        </div>
      )}

      {(status === "idle" ||
        status === "negotiating") && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="text-xs font-medium text-stone-500">
              Votre offre (€)
            </label>
            <input
              type="number"
              min={1}
              value={offerInput}
              onChange={(e) => setOfferInput(e.target.value)}
              className="mt-1 w-full rounded-xl border border-orange-100 px-3 py-2 text-sm text-stone-900 outline-none focus:border-orange-400"
            />
          </div>
          <div className="flex gap-2">
            {status === "negotiating" && lastSellerOffer !== null && (
              <button
                onClick={() => acceptCounter(lastSellerOffer)}
                className="rounded-full border border-orange-600 px-4 py-2 text-sm font-semibold text-orange-700 transition-colors hover:bg-orange-50"
              >
                Accepter à {lastSellerOffer} €
              </button>
            )}
            <button
              onClick={() => sendOffer(Number(offerInput))}
              className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
            >
              {status === "negotiating" ? "Contre-offre" : "Envoyer mon offre"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
