"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  categories,
  formatDA,
  formatEurApprox,
  formatRelativeTime,
  getListingPhotoUrl,
  type Listing,
  type SellerType,
} from "@/lib/queries";
import { wilayas } from "@/lib/wilayas";
import { communesByWilaya } from "@/lib/communes";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";
import type { Locale } from "@/lib/i18n/locale";
import { formatResultsCount } from "@/lib/i18n/format";

type SortOrder = "recent" | "price-asc" | "price-desc";

export default function ProduitsFilters({
  listings,
  taux,
  dict,
  locale,
  initialQuery = "",
  initialCategory = "Toutes catégories",
  initialWilaya = "",
  initialCommune = "",
  justSaved = false,
  isLoggedIn = false,
  saveSearchAction,
}: {
  listings: Listing[];
  taux: number;
  dict: Dictionary["produits"];
  locale: Locale;
  initialQuery?: string;
  initialCategory?: string;
  initialWilaya?: string;
  initialCommune?: string;
  justSaved?: boolean;
  isLoggedIn?: boolean;
  saveSearchAction?: (formData: FormData) => void;
}) {
  const [sellerFilter, setSellerFilter] = useState<"tous" | SellerType>(
    "tous"
  );
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [wilayaFilter, setWilayaFilter] = useState(initialWilaya);
  const [communeFilter, setCommuneFilter] = useState(initialCommune);
  const [sort, setSort] = useState<SortOrder>("recent");

  const communeOptions = wilayaFilter ? (communesByWilaya[wilayaFilter] ?? []) : [];

  const filteredListings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    let result = listings.filter((listing) => {
      const matchesSeller =
        sellerFilter === "tous" || listing.seller?.type === sellerFilter;
      const matchesCategory =
        category === "Toutes catégories" || listing.category === category;
      const matchesQuery =
        normalizedQuery === "" ||
        listing.title.toLowerCase().includes(normalizedQuery) ||
        listing.description.toLowerCase().includes(normalizedQuery);
      const matchesWilaya =
        wilayaFilter === "" || listing.location === wilayaFilter;
      const matchesCommune =
        communeFilter === "" || listing.commune === communeFilter;
      return (
        matchesSeller &&
        matchesCategory &&
        matchesQuery &&
        matchesWilaya &&
        matchesCommune
      );
    });

    if (sort === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [listings, sellerFilter, category, query, wilayaFilter, communeFilter, sort]);

  return (
    <>
      {justSaved && (
        <p className="mt-4 rounded-lg border border-line bg-bg-alt px-4 py-2.5 text-sm text-ink">
          {dict.searchSavedToast}
        </p>
      )}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={dict.searchPlaceholder}
          className="w-full rounded-full border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-ink sm:max-w-sm"
        />
        <select
          value={wilayaFilter}
          onChange={(e) => {
            setWilayaFilter(e.target.value);
            setCommuneFilter("");
          }}
          className="rounded-full border border-line bg-paper px-4 py-2.5 text-sm text-ink-soft"
        >
          <option value="">{dict.filterWilayaAll}</option>
          {wilayas.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
        <select
          value={communeFilter}
          onChange={(e) => setCommuneFilter(e.target.value)}
          disabled={!wilayaFilter}
          className="rounded-full border border-line bg-paper px-4 py-2.5 text-sm text-ink-soft disabled:bg-bg-alt disabled:text-ink-soft/60"
        >
          <option value="">{dict.filterCommuneAll}</option>
          {communeOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {isLoggedIn && saveSearchAction && (
          <form action={saveSearchAction}>
            <input type="hidden" name="query" value={query} />
            <input type="hidden" name="category" value={category} />
            <input type="hidden" name="wilaya" value={wilayaFilter} />
            <input type="hidden" name="commune" value={communeFilter} />
            <button
              type="submit"
              className="w-full rounded-full border border-line px-4 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:border-ink sm:w-auto"
            >
              {dict.saveSearchButton}
            </button>
          </form>
        )}
      </div>

      <p className="mt-4 text-sm text-ink-soft">
        {formatResultsCount(locale, filteredListings.length)}
      </p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { value: "tous", label: dict.filterAll },
              { value: "particulier", label: dict.filterParticuliers },
              { value: "pro", label: dict.filterPro },
            ] as const
          ).map((option) => (
            <button
              key={option.value}
              onClick={() => setSellerFilter(option.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                sellerFilter === option.value
                  ? "bg-ink text-bg"
                  : "border border-line bg-paper text-ink-soft hover:border-ink"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-full border border-line bg-paper px-4 py-2 text-sm text-ink-soft"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOrder)}
            className="rounded-full border border-line bg-paper px-4 py-2 text-sm text-ink-soft"
          >
            <option value="recent">{dict.sortRecent}</option>
            <option value="price-asc">{dict.sortPriceAsc}</option>
            <option value="price-desc">{dict.sortPriceDesc}</option>
          </select>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredListings.map((listing) => (
          <Link
            key={listing.id}
            href={`/produits/${listing.id}`}
            className="flex flex-col overflow-hidden rounded-xl border border-line bg-paper transition-shadow hover:shadow-lg"
          >
            <div className="flex h-36 items-center justify-center overflow-hidden bg-bg-alt text-4xl">
              {listing.photos.length > 0 ? (
                <img
                  src={getListingPhotoUrl(listing.photos[0])}
                  alt={listing.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                listing.emoji
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-ink">{listing.title}</h3>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    listing.seller?.type === "pro"
                      ? "bg-dawn-soft text-accent-dark"
                      : "bg-bg-alt text-ink-soft"
                  }`}
                >
                  {listing.seller?.type === "pro"
                    ? dict.cardPro
                    : dict.cardParticulier}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-bold text-accent-dark">
                  {formatDA(listing.price)}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    listing.negociable
                      ? "bg-primary/10 text-primary-dark"
                      : "bg-bg-alt text-ink-soft"
                  }`}
                >
                  {listing.negociable ? dict.cardNegociable : dict.cardFerme}
                </span>
              </div>
              <span className="text-[11px] text-ink-soft/70">
                {formatEurApprox(listing.price, taux)}
              </span>
              <div className="mt-auto flex items-center justify-between text-xs text-ink-soft">
                <span>{listing.seller?.name}</span>
                <span>
                  📍 {listing.commune ? `${listing.commune}, ` : ""}
                  {listing.location}
                </span>
              </div>
              <span className="text-xs text-ink-soft/70">
                {formatRelativeTime(listing.created_at)}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <p className="mt-16 text-center text-ink-soft">{dict.noResults}</p>
      )}
    </>
  );
}
