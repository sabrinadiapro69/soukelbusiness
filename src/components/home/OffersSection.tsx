"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  Palette,
  Shirt,
  Home as HomeIcon,
  Sparkles,
  Camera,
  Briefcase,
  Heart,
  BadgeCheck,
  Star,
  MapPin,
} from "lucide-react";
import NegotiationModal, { type DemoOffer } from "./NegotiationModal";

type CategoryKey =
  | "creation"
  | "mode"
  | "maison"
  | "beaute"
  | "photo"
  | "services";

const CATEGORY_ICONS: Record<CategoryKey, typeof Palette> = {
  creation: Palette,
  mode: Shirt,
  maison: HomeIcon,
  beaute: Sparkles,
  photo: Camera,
  services: Briefcase,
};

const CATEGORY_TINTS: Record<CategoryKey, string> = {
  creation: "#F5E9E3",
  mode: "#EDEEE3",
  maison: "#F3EEDF",
  beaute: "#F5E8E6",
  photo: "#E9ECE4",
  services: "#EFEBE4",
};

// Donnees de demonstration : aucune de ces offres n'existe reellement en
// base, elles servent uniquement a illustrer la mise en page.
type Offer = DemoOffer & {
  category: CategoryKey;
  vendor: string;
  location: string;
  verified: boolean;
  rating: number;
  reviews: number;
  priceIsFrom: boolean;
};

function buildDemoOffers(): Offer[] {
  return [
    {
      id: "demo-1",
      category: "creation",
      title: "Bol en grès tourné main",
      vendor: "Léa M.",
      location: "Lyon",
      verified: true,
      rating: 4.9,
      reviews: 32,
      price: "38 €",
      priceIsFrom: false,
    },
    {
      id: "demo-2",
      category: "creation",
      title: "Bague en argent gravée",
      vendor: "Karim B.",
      location: "À distance",
      verified: true,
      rating: 4.8,
      reviews: 21,
      price: "55 €",
      priceIsFrom: true,
    },
    {
      id: "demo-3",
      category: "mode",
      title: "Retouche de robe de soirée",
      vendor: "Sofia R.",
      location: "Marseille",
      verified: false,
      rating: 4.7,
      reviews: 14,
      price: "25 €",
      priceIsFrom: true,
    },
    {
      id: "demo-4",
      category: "mode",
      title: "Sac à main en cuir végétal",
      vendor: "Yanis T.",
      location: "Paris",
      verified: true,
      rating: 5.0,
      reviews: 9,
      price: "120 €",
      priceIsFrom: false,
    },
    {
      id: "demo-5",
      category: "maison",
      title: "Tapisserie tissée main",
      vendor: "Nadia F.",
      location: "Bordeaux",
      verified: false,
      rating: 4.9,
      reviews: 17,
      price: "89 €",
      priceIsFrom: false,
    },
    {
      id: "demo-6",
      category: "maison",
      title: "Devis peinture décorative",
      vendor: "Hugo L.",
      location: "À distance",
      verified: false,
      rating: 4.6,
      reviews: 11,
      price: "Sur devis",
      priceIsFrom: false,
    },
    {
      id: "demo-7",
      category: "beaute",
      title: "Soin visage à domicile",
      vendor: "Aïcha D.",
      location: "Lille",
      verified: true,
      rating: 4.8,
      reviews: 26,
      price: "45 €",
      priceIsFrom: true,
    },
    {
      id: "demo-8",
      category: "photo",
      title: "Reportage photo mariage",
      vendor: "Thomas V.",
      location: "Toulouse",
      verified: false,
      rating: 4.9,
      reviews: 38,
      price: "350 €",
      priceIsFrom: true,
    },
    {
      id: "demo-9",
      category: "services",
      title: "Création de site vitrine",
      vendor: "Camille P.",
      location: "À distance",
      verified: true,
      rating: 5.0,
      reviews: 12,
      price: "400 €",
      priceIsFrom: true,
    },
  ];
}

const FAVORITES_STORAGE_KEY = "seb-demo-favorites";
const favoritesListeners = new Set<() => void>();

function readFavoritesRaw(): string {
  try {
    return window.localStorage.getItem(FAVORITES_STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function getFavoritesServerSnapshot(): string {
  return "[]";
}

function subscribeFavorites(callback: () => void) {
  favoritesListeners.add(callback);
  return () => favoritesListeners.delete(callback);
}

function writeFavorites(next: Set<string>) {
  try {
    window.localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify([...next])
    );
  } catch {
    // localStorage indisponible : l'etat reste en memoire pour la session.
  }
  favoritesListeners.forEach((callback) => callback());
}

function parseFavorites(raw: string): Set<string> {
  try {
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

export default function OffersSection({
  categories,
  labels,
  modalLabels,
}: {
  categories: { key: CategoryKey; title: string; cta: string }[];
  labels: {
    categoriesEyebrow: string;
    categoriesTitle: string;
    offersEyebrow: string;
    offersTitle: string;
    filterAll: string;
    verifiedLabel: string;
    reviewsLabel: string;
    fromLabel: string;
    favoriteLabel: string;
    unfavoriteLabel: string;
    negotiateLabel: string;
    demoNotice: string;
  };
  modalLabels: {
    title: string;
    displayedPrice: string;
    yourPrice: string;
    yourPriceLabel: string;
    message: string;
    messagePlaceholder: string;
    submit: string;
    hint: string;
    close: string;
    sentTitle: string;
    sentText: string;
  };
}) {
  const categoryLabels = Object.fromEntries(
    categories.map((c) => [c.key, c.title])
  ) as Record<CategoryKey, string>;
  const offers = buildDemoOffers();

  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(
    null
  );
  const favoritesRaw = useSyncExternalStore(
    subscribeFavorites,
    readFavoritesRaw,
    getFavoritesServerSnapshot
  );
  const favorites = useMemo(() => parseFavorites(favoritesRaw), [favoritesRaw]);
  const [activeOffer, setActiveOffer] = useState<Offer | null>(null);

  function toggleFavorite(id: string) {
    const next = parseFavorites(readFavoritesRaw());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    writeFavorites(next);
  }

  const filteredOffers = selectedCategory
    ? offers.filter((o) => o.category === selectedCategory)
    : offers;

  return (
    <>
      {/* Categories */}
      <section id="categories" className="scroll-mt-[6rem] py-16">
        <div className="mx-auto max-w-6xl px-6">
          <span className="mb-1.5 block font-mono text-[11px] font-medium tracking-wide text-primary uppercase">
            {labels.categoriesEyebrow}
          </span>
          <h2 className="font-serif text-3xl font-semibold text-ink">
            {labels.categoriesTitle}
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.key];
              const isActive = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(isActive ? null : cat.key)
                  }
                  aria-pressed={isActive}
                  className={`group flex flex-col items-center gap-3 rounded-2xl border p-5 text-center transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    isActive
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-line bg-paper"
                  }`}
                >
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-full"
                    style={{ backgroundColor: CATEGORY_TINTS[cat.key] }}
                  >
                    <Icon
                      size={22}
                      strokeWidth={1.6}
                      className="text-primary-dark"
                      aria-hidden="true"
                    />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">
                      {cat.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-ink-soft">
                      {cat.cta}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Offres */}
      <section
        id="offres"
        className="scroll-mt-[6rem] border-y border-line bg-bg-alt py-16"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="mb-1.5 block font-mono text-[11px] font-medium tracking-wide text-primary uppercase">
                {labels.offersEyebrow}
              </span>
              <h2 className="font-serif text-3xl font-semibold text-ink">
                {labels.offersTitle}
              </h2>
            </div>
            {selectedCategory && (
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="rounded-full border border-line bg-paper px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-primary hover:text-primary"
              >
                {labels.filterAll}
              </button>
            )}
          </div>
          <p className="mb-8 text-xs text-ink-soft">{labels.demoNotice}</p>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredOffers.map((offer) => {
              const isFavorite = favorites.has(offer.id);
              return (
                <div
                  key={offer.id}
                  className="group overflow-hidden rounded-2xl border border-line bg-paper transition-shadow hover:shadow-md"
                >
                  <div
                    className="relative flex aspect-[4/3] items-center justify-center"
                    style={{ backgroundColor: CATEGORY_TINTS[offer.category] }}
                  >
                    {(() => {
                      const Icon = CATEGORY_ICONS[offer.category];
                      return (
                        <Icon
                          size={40}
                          strokeWidth={1.3}
                          className="text-primary-dark/70"
                          aria-hidden="true"
                        />
                      );
                    })()}
                    <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wide text-primary-dark uppercase shadow-sm">
                      {categoryLabels[offer.category]}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(offer.id)}
                      aria-pressed={isFavorite}
                      aria-label={
                        isFavorite ? labels.unfavoriteLabel : labels.favoriteLabel
                      }
                      className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition-colors hover:bg-white"
                    >
                      <Heart
                        size={17}
                        strokeWidth={1.8}
                        className={isFavorite ? "fill-accent text-accent" : ""}
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  <div className="p-5">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-xs text-ink">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary-dark">
                          {offer.vendor[0]}
                        </span>
                        {offer.vendor}
                        {offer.verified && (
                          <BadgeCheck
                            size={14}
                            className="text-primary"
                            aria-label={labels.verifiedLabel}
                          />
                        )}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-ink-soft">
                        <Star
                          size={13}
                          className="fill-accent text-accent"
                          aria-hidden="true"
                        />
                        {offer.rating.toFixed(1)} ({offer.reviews})
                      </span>
                    </div>
                    <h3 className="mb-1 text-[15px] font-semibold text-ink">
                      {offer.title}
                    </h3>
                    <p className="mb-4 flex items-center gap-1 text-xs text-ink-soft">
                      <MapPin size={12} aria-hidden="true" />
                      {offer.location}
                    </p>

                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[15px] font-semibold text-ink">
                        {offer.priceIsFrom && (
                          <span className="mr-1 text-xs font-normal text-ink-soft">
                            {labels.fromLabel}
                          </span>
                        )}
                        {offer.price}
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveOffer(offer)}
                        className="rounded-full border border-primary px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                      >
                        {labels.negotiateLabel}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {activeOffer && (
        <NegotiationModal
          offer={activeOffer}
          onClose={() => setActiveOffer(null)}
          labels={modalLabels}
        />
      )}
    </>
  );
}
