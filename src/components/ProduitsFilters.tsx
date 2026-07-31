"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  categories,
  formatDA,
  formatRelativeTime,
  type Listing,
  type SellerType,
} from "@/lib/queries";

type SortOrder = "recent" | "price-asc" | "price-desc";

export default function ProduitsFilters({
  listings,
}: {
  listings: Listing[];
}) {
  const [sellerFilter, setSellerFilter] = useState<"tous" | SellerType>(
    "tous"
  );
  const [category, setCategory] = useState("Toutes catégories");
  const [sort, setSort] = useState<SortOrder>("recent");

  const filteredListings = useMemo(() => {
    let result = listings.filter((listing) => {
      const matchesSeller =
        sellerFilter === "tous" || listing.seller?.type === sellerFilter;
      const matchesCategory =
        category === "Toutes catégories" || listing.category === category;
      return matchesSeller && matchesCategory;
    });

    if (sort === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [listings, sellerFilter, category, sort]);

  return (
    <>
      <p className="mt-1 text-sm text-ink-soft">
        {filteredListings.length} annonce
        {filteredListings.length > 1 ? "s" : ""} trouvée
        {filteredListings.length > 1 ? "s" : ""}
      </p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {(
            [
              { value: "tous", label: "Tous les vendeurs" },
              { value: "particulier", label: "Particuliers" },
              { value: "pro", label: "Professionnels" },
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

        <div className="flex gap-3">
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
            <option value="recent">Plus récentes</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
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
            <div className="flex h-36 items-center justify-center bg-bg-alt text-4xl">
              {listing.emoji}
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
                  {listing.seller?.type === "pro" ? "Pro" : "Particulier"}
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
                  {listing.negociable ? "Négociable" : "Prix ferme"}
                </span>
              </div>
              <div className="mt-auto flex items-center justify-between text-xs text-ink-soft">
                <span>{listing.seller?.name}</span>
                <span>📍 {listing.location}</span>
              </div>
              <span className="text-xs text-ink-soft/70">
                {formatRelativeTime(listing.created_at)}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <p className="mt-16 text-center text-ink-soft">
          Aucune annonce ne correspond à ces filtres.
        </p>
      )}
    </>
  );
}
