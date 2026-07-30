"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  categories,
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
      <p className="mt-1 text-sm text-stone-500">
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
                  ? "bg-orange-600 text-white"
                  : "bg-white text-stone-600 border border-orange-100 hover:bg-orange-50"
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
            className="rounded-full border border-orange-100 bg-white px-4 py-2 text-sm text-stone-700"
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
            className="rounded-full border border-orange-100 bg-white px-4 py-2 text-sm text-stone-700"
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
            className="flex flex-col overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex h-36 items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 text-4xl">
              {listing.emoji}
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-stone-900">
                  {listing.title}
                </h3>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    listing.seller?.type === "pro"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {listing.seller?.type === "pro" ? "Pro" : "Particulier"}
                </span>
              </div>
              <span className="text-lg font-bold text-orange-700">
                {listing.price} €
              </span>
              <div className="mt-auto flex items-center justify-between text-xs text-stone-500">
                <span>{listing.seller?.name}</span>
                <span>{listing.location}</span>
              </div>
              <span className="text-xs text-stone-400">
                {formatRelativeTime(listing.created_at)}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <p className="mt-16 text-center text-stone-500">
          Aucune annonce ne correspond à ces filtres.
        </p>
      )}
    </>
  );
}
