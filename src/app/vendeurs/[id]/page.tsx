import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatMemberSince,
  getListingsBySeller,
  getReviewsBySeller,
  getSellerById,
} from "@/lib/queries";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.round(rating);
  return (
    <span className="text-amber-500" aria-label={`${rating} sur 5 étoiles`}>
      {"★".repeat(fullStars)}
      <span className="text-stone-300">{"★".repeat(5 - fullStars)}</span>
    </span>
  );
}

export default async function VendeurPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const seller = await getSellerById(id);

  if (!seller) {
    notFound();
  }

  const [sellerListings, reviews] = await Promise.all([
    getListingsBySeller(seller.id),
    getReviewsBySeller(seller.id),
  ]);

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

        <div className="mt-6 flex flex-col gap-6 rounded-2xl border border-orange-100 bg-white p-6 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 text-5xl">
            {seller.avatar_emoji}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-stone-900">
                {seller.name}
              </h1>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  seller.type === "pro"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-stone-100 text-stone-600"
                }`}
              >
                {seller.type === "pro" ? "Professionnel" : "Particulier"}
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-sm text-stone-600">
              {seller.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-500">
              <span>📍 {seller.city}</span>
              <span>📅 Membre depuis {formatMemberSince(seller.member_since)}</span>
              <span>🤝 {seller.transactions_count} transactions</span>
              <span>
                <StarRating rating={seller.rating} /> {seller.rating.toFixed(1)}
                /5
              </span>
            </div>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-stone-900">
            Produits de {seller.name}
          </h2>
          {sellerListings.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {sellerListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/produits/${listing.id}`}
                  className="flex flex-col overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex h-28 items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 text-3xl">
                    {listing.emoji}
                  </div>
                  <div className="flex flex-col gap-1 p-4">
                    <h3 className="font-semibold text-stone-900">
                      {listing.title}
                    </h3>
                    <span className="font-bold text-orange-700">
                      {listing.price} €
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-stone-500">
              Ce vendeur n&apos;a pas d&apos;annonce en ligne actuellement.
            </p>
          )}
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-stone-900">
            Avis ({reviews.length})
          </h2>
          {reviews.length > 0 ? (
            <div className="mt-6 flex flex-col gap-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border border-orange-100 bg-white p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900">
                      {review.author}
                    </span>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="mt-2 text-sm text-stone-600">
                    {review.comment}
                  </p>
                  <p className="mt-2 text-xs text-stone-400">
                    {formatMemberSince(review.created_at)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-stone-500">
              Ce vendeur n&apos;a pas encore reçu d&apos;avis.
            </p>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
