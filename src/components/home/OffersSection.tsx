"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
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

export type CategoryKey =
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
//
// `image` est optionnel : quand une vraie photo (URL Supabase Storage, par
// exemple) sera disponible pour une offre, il suffira de renseigner ce champ
// pour qu'elle remplace l'icone-pastille ci-dessous, sans autre changement.
export type Offer = DemoOffer & {
  category: CategoryKey;
  vendor: string;
  location: string;
  verified: boolean;
  rating: number;
  reviews: number;
  priceIsFrom: boolean;
  image?: string;
  // Présent uniquement pour une vraie annonce (venant de Supabase) : la
  // carte entière devient un lien vers la fiche produit réelle, où vit déjà
  // le vrai système de négociation, plutôt que la modale de démonstration.
  href?: string;
  negociable?: boolean;
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
      // Exemple : photo fournie -> remplace l'icone automatiquement.
      image:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMzAwIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZzEiIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0Q5QTk4QyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM4QjVFM0MiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI2cxKSIvPgogIDxlbGxpcHNlIGN4PSIyMDAiIGN5PSIxOTAiIHJ4PSIxMTAiIHJ5PSI1NSIgZmlsbD0iIzZGNEEyRSIgb3BhY2l0eT0iMC41NSIvPgogIDxlbGxpcHNlIGN4PSIyMDAiIGN5PSIxNzAiIHJ4PSI5NSIgcnk9IjQyIiBmaWxsPSIjQzk4QTVFIi8+Cjwvc3ZnPgo=",
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
      // Exemple : photo fournie -> remplace l'icone automatiquement.
      image:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMzAwIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZzIiIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzVCNDYzNiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMyRTIxMTciLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI2cyKSIvPgogIDxyZWN0IHg9IjExMCIgeT0iOTAiIHdpZHRoPSIxODAiIGhlaWdodD0iMTQwIiByeD0iMTgiIGZpbGw9IiM4QTZBNEMiLz4KICA8cmVjdCB4PSIxNTAiIHk9IjYwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjYwIiByeD0iMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzhBNkE0QyIgc3Ryb2tlLXdpZHRoPSIxMCIvPgo8L3N2Zz4K",
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
  realOffers = [],
}: {
  categories: { key: CategoryKey; title: string; cta: string }[];
  realOffers?: Offer[];
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
  const isDemo = realOffers.length === 0;
  const offers = isDemo ? buildDemoOffers() : realOffers;

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
          <span className="mb-1.5 block font-mono text-xs font-medium tracking-wide text-primary uppercase">
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
                    <span className="mt-0.5 block text-sm text-ink-soft">
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
              <span className="mb-1.5 block font-mono text-xs font-medium tracking-wide text-primary uppercase">
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
          {isDemo && (
            <p className="mb-8 text-sm text-ink-soft">{labels.demoNotice}</p>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredOffers.map((offer) => {
              const isFavorite = favorites.has(offer.id);
              const cardClassName =
                "group overflow-hidden rounded-2xl border border-line bg-paper transition-shadow hover:shadow-md";

              const cardBody = (
                <>
                  <div
                    className="relative flex aspect-[4/3] items-center justify-center bg-cover bg-center"
                    style={
                      offer.image
                        ? { backgroundImage: `url(${offer.image})` }
                        : { backgroundColor: CATEGORY_TINTS[offer.category] }
                    }
                  >
                    {!offer.image &&
                      (() => {
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
                    <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wide text-primary-dark uppercase shadow-sm">
                      {categoryLabels[offer.category]}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(offer.id);
                      }}
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
                      <span className="flex items-center gap-1.5 text-sm text-ink">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary-dark">
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
                      <span className="flex items-center gap-1 text-sm text-ink-soft">
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
                    <p className="mb-4 flex items-center gap-1 text-sm text-ink-soft">
                      <MapPin size={12} aria-hidden="true" />
                      {offer.location}
                    </p>

                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[15px] font-semibold text-ink">
                        {offer.priceIsFrom && (
                          <span className="mr-1 text-sm font-normal text-ink-soft">
                            {labels.fromLabel}
                          </span>
                        )}
                        {offer.price}
                      </p>
                      {offer.href ? (
                        offer.negociable && (
                          <span className="rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary">
                            {labels.negotiateLabel}
                          </span>
                        )
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActiveOffer(offer)}
                          className="rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                        >
                          {labels.negotiateLabel}
                        </button>
                      )}
                    </div>
                  </div>
                </>
              );

              return offer.href ? (
                <Link key={offer.id} href={offer.href} className={cardClassName}>
                  {cardBody}
                </Link>
              ) : (
                <div key={offer.id} className={cardClassName}>
                  {cardBody}
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
