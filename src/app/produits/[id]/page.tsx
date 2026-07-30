import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatRelativeTime,
  getListingById,
  getListingsByCategory,
} from "@/lib/queries";
import NegotiationPanel from "@/components/NegotiationPanel";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export default async function ProduitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListingById(Number(id));

  if (!listing) {
    notFound();
  }

  const similarListings = await getListingsByCategory(
    listing.category,
    listing.id
  );

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <Link
          href="/produits"
          className="text-sm font-medium text-stone-500 hover:text-orange-700"
        >
          ← Retour aux annonces
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="flex h-80 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 text-8xl">
            {listing.emoji}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl font-bold text-stone-900">
                {listing.title}
              </h1>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                  listing.seller?.type === "pro"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-stone-100 text-stone-600"
                }`}
              >
                {listing.seller?.type === "pro" ? "Pro" : "Particulier"}
              </span>
            </div>

            <span className="text-3xl font-bold text-orange-700">
              {listing.price} €
            </span>

            <p className="leading-relaxed text-stone-600">
              {listing.description}
            </p>

            <div className="flex items-center gap-4 text-sm text-stone-500">
              <span>{listing.category}</span>
              <span>•</span>
              <span>{listing.location}</span>
              <span>•</span>
              <span>{formatRelativeTime(listing.created_at)}</span>
            </div>

            <div className="mt-4 rounded-2xl border border-orange-100 bg-white p-5">
              <p className="text-sm text-stone-500">Vendu par</p>
              <Link
                href={`/vendeurs/${listing.seller_id}`}
                className="mt-1 inline-block font-semibold text-stone-900 hover:text-orange-700"
              >
                {listing.seller?.name}
              </Link>
              <p className="text-sm text-stone-500">{listing.location}</p>
              <button className="mt-4 w-full rounded-full border border-orange-600 px-6 py-3 text-sm font-semibold text-orange-700 transition-colors hover:bg-orange-50">
                Contacter le vendeur
              </button>
            </div>

            <NegotiationPanel
              askingPrice={listing.price}
              sellerName={listing.seller?.name ?? "le vendeur"}
            />
          </div>
        </div>

        {similarListings.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold text-stone-900">
              Annonces similaires
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {similarListings.map((item) => (
                <Link
                  key={item.id}
                  href={`/produits/${item.id}`}
                  className="flex flex-col overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex h-28 items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 text-3xl">
                    {item.emoji}
                  </div>
                  <div className="flex flex-col gap-1 p-4">
                    <h3 className="font-semibold text-stone-900">
                      {item.title}
                    </h3>
                    <span className="font-bold text-orange-700">
                      {item.price} €
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
