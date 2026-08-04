import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  formatDA,
  formatMemberSince,
  getListingPhotoUrl,
  getListingsBySeller,
  getPortfolioBySeller,
  getPortfolioPhotoUrl,
  getProProfile,
  getReviewsBySeller,
  getSellerById,
} from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import ReportButton from "@/components/ReportButton";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const dynamic = "force-dynamic";

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.round(rating);
  return (
    <span className="text-gold" aria-label={`${rating} sur 5 étoiles`}>
      {"★".repeat(fullStars)}
      <span className="text-line">{"★".repeat(5 - fullStars)}</span>
    </span>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const seller = await getSellerById(id);

  if (!seller) return {};

  const title =
    seller.type === "pro" ? `${seller.name}, professionnel` : seller.name;
  const description =
    seller.description || `Profil vendeur ${seller.name} sur Souk El Business.`;

  return {
    title,
    description: description.slice(0, 160),
    openGraph: {
      title,
      description: description.slice(0, 160),
      type: "profile",
    },
  };
}

export default async function VendeurPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ reported?: string; report_error?: string }>;
}) {
  const { id } = await params;
  const { reported, report_error } = await searchParams;
  const seller = await getSellerById(id);

  if (!seller) {
    notFound();
  }

  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const t = dict.vendeur;
  const reportDict = dict.report;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [sellerListings, reviews, proProfile, portfolio] = await Promise.all([
    getListingsBySeller(seller.id),
    getReviewsBySeller(seller.id).catch(() => []),
    seller.type === "pro"
      ? getProProfile(seller.id).catch(() => null)
      : Promise.resolve(null),
    seller.type === "pro"
      ? getPortfolioBySeller(seller.id).catch(() => [])
      : Promise.resolve([]),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <Link
          href="/produits"
          className="text-sm font-medium text-ink-soft hover:text-ink"
        >
          {t.back}
        </Link>

        <div className="mt-6 flex flex-col gap-6 rounded-2xl border border-line bg-paper p-6 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-bg-alt text-5xl">
            {seller.avatar_emoji}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-ink">{seller.name}</h1>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  seller.type === "pro"
                    ? "bg-dawn-soft text-accent-dark"
                    : "bg-bg-alt text-ink-soft"
                }`}
              >
                {seller.type === "pro" ? t.professionnel : t.particulier}
              </span>
              {proProfile?.verified && (
                <span className="flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-xs font-bold text-[#3A2C05]">
                  {t.talentueux}
                </span>
              )}
            </div>
            {proProfile?.metier && (
              <p className="mt-1 text-sm font-medium text-ink-soft">
                {proProfile.metier}
              </p>
            )}
            <p className="mt-2 max-w-2xl text-sm text-ink-soft">
              {seller.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
              <span>
                {t.wilayaDe} {seller.city}
              </span>
              <span>
                {t.memberSince} {formatMemberSince(seller.member_since)}
              </span>
              <span>
                🤝 {seller.transactions_count} {t.transactions}
              </span>
              <span>
                <StarRating rating={seller.rating} />{" "}
                {seller.rating.toFixed(1)}/5
              </span>
            </div>
          </div>
        </div>

        {reported === "1" && (
          <p className="mt-4 rounded-lg border border-line bg-bg-alt px-4 py-2.5 text-sm text-ink">
            {reportDict.sentToast}
          </p>
        )}
        {report_error === "limit" && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
            {reportDict.limitErrorToast}
          </p>
        )}

        <div className="mt-3">
          <ReportButton
            type="utilisateur"
            targetId={seller.id}
            redirectTo={`/vendeurs/${seller.id}`}
            isLoggedIn={Boolean(user)}
            label={reportDict.buttonSeller}
            motifLabel={reportDict.motifLabel}
            descriptionLabel={reportDict.descriptionLabel}
            submitLabel={reportDict.submit}
            cancelLabel={reportDict.cancel}
          />
        </div>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-ink">
            {t.productsOf} {seller.name}
          </h2>
          {sellerListings.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {sellerListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/produits/${listing.id}`}
                  className="flex flex-col overflow-hidden rounded-xl border border-line bg-paper transition-shadow hover:shadow-lg"
                >
                  <div className="flex h-28 items-center justify-center overflow-hidden bg-bg-alt text-3xl">
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
                  <div className="flex flex-col gap-1 p-4">
                    <h3 className="font-semibold text-ink">
                      {listing.title}
                    </h3>
                    {listing.is_don ? (
                      <span className="w-fit rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary-dark">
                        {dict.produit.don}
                      </span>
                    ) : (
                      <span className="font-mono font-bold text-accent-dark">
                        {formatDA(listing.price)}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-ink-soft">{t.noListings}</p>
          )}
        </section>

        {seller.type === "pro" && portfolio.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-ink">{t.portfolio}</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {portfolio.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-line bg-paper p-4"
                >
                  <div className="flex gap-2">
                    {item.photos.map((path) => (
                      <img
                        key={path}
                        src={getPortfolioPhotoUrl(path)}
                        alt={item.title}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-ink">
                    {item.title}
                  </p>
                  {item.description && (
                    <p className="mt-1 text-xs text-ink-soft">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12">
          <h2 className="text-xl font-bold text-ink">
            {t.reviews} ({reviews.length})
          </h2>
          {reviews.length > 0 ? (
            <div className="mt-6 flex flex-col gap-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border border-line bg-paper p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ink">
                      {review.buyer?.avatar_emoji} {review.buyer?.name ?? t.buyer}
                    </span>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="mt-2 text-sm text-ink-soft">
                    {review.comment}
                  </p>
                  <p className="mt-2 text-xs text-ink-soft/70">
                    {formatMemberSince(review.created_at)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-ink-soft">{t.noReviews}</p>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
