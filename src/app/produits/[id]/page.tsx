import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  formatEUR,
  formatRelativeTime,
  getListingById,
  getListingPhotoUrl,
  getListingsByCategory,
  type Offer,
} from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import NegotiationPanel from "@/components/NegotiationPanel";
import ReportButton from "@/components/ReportButton";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListingById(Number(id));

  if (!listing) return {};

  const priceLabel = listing.is_don ? "Don" : formatEUR(listing.price);
  const description = `${priceLabel} · ${listing.category} · ${listing.location}. ${listing.description}`.slice(
    0,
    160
  );

  return {
    title: listing.title,
    description,
    openGraph: {
      title: listing.title,
      description,
      type: "website",
    },
  };
}

export default async function ProduitPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ reported?: string; report_error?: string }>;
}) {
  const { id } = await params;
  const { reported, report_error } = await searchParams;
  const listing = await getListingById(Number(id));

  if (!listing) {
    notFound();
  }

  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const t = dict.produit;
  const reportDict = dict.report;

  const similarListings = await getListingsByCategory(
    listing.category,
    listing.id
  );

  const requestHeaders = await headers();
  const host = requestHeaders.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  const listingUrl = `${protocol}://${host}/produits/${listing.id}`;
  const whatsappMessage = `${listing.title} (${listing.is_don ? t.don : formatEUR(listing.price)})\n${listingUrl}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let offer: Offer | null = null;
  if (user) {
    const { data } = await supabase
      .from("offers")
      .select("*")
      .eq("listing_id", listing.id)
      .eq("buyer_id", user.id)
      .maybeSingle();
    offer = data ? { ...data, montant_propose: Number(data.montant_propose) } : null;
  }

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

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <div className="flex h-80 items-center justify-center overflow-hidden rounded-2xl bg-bg-alt text-8xl">
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
            {listing.photos.length > 1 && (
              <div className="mt-3 flex gap-3">
                {listing.photos.slice(1).map((path) => (
                  <img
                    key={path}
                    src={getListingPhotoUrl(path)}
                    alt={listing.title}
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl font-bold text-ink">{listing.title}</h1>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                  listing.seller?.type === "pro"
                    ? "bg-dawn-soft text-accent-dark"
                    : "bg-bg-alt text-ink-soft"
                }`}
              >
                {listing.seller?.type === "pro" ? t.pro : t.particulier}
              </span>
            </div>

            {listing.is_don ? (
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-primary/10 px-3 py-1.5 text-lg font-bold text-primary-dark">
                  {t.don}
                </span>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-3xl font-bold text-accent-dark">
                  {formatEUR(listing.price)}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    listing.negociable
                      ? "bg-primary/10 text-primary-dark"
                      : "bg-bg-alt text-ink-soft"
                  }`}
                >
                  {listing.negociable ? t.negociable : t.ferme}
                </span>
              </div>
            )}

            <p className="leading-relaxed text-ink-soft">
              {listing.description}
            </p>

            <div className="flex items-center gap-4 text-sm text-ink-soft">
              <span>{listing.category}</span>
              <span>•</span>
              <span>📍 {listing.location}</span>
              <span>•</span>
              <span>{formatRelativeTime(listing.created_at)}</span>
            </div>

            {reported === "1" && (
              <p className="rounded-lg border border-line bg-bg-alt px-4 py-2.5 text-sm text-ink">
                {reportDict.sentToast}
              </p>
            )}
            {report_error === "limit" && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                {reportDict.limitErrorToast}
              </p>
            )}

            <ReportButton
              type="annonce"
              targetId={listing.id}
              redirectTo={`/produits/${listing.id}`}
              isLoggedIn={Boolean(user)}
              label={reportDict.buttonListing}
              motifLabel={reportDict.motifLabel}
              descriptionLabel={reportDict.descriptionLabel}
              submitLabel={reportDict.submit}
              cancelLabel={reportDict.cancel}
            />

            <div className="mt-4 rounded-2xl border border-line bg-paper p-5">
              <p className="text-sm text-ink-soft">{t.soldBy}</p>
              <Link
                href={`/vendeurs/${listing.seller_id}`}
                className="mt-1 inline-block font-semibold text-ink hover:text-accent"
              >
                {listing.seller?.name}
              </Link>
              <p className="text-sm text-ink-soft">📍 {listing.location}</p>
              <button className="mt-4 w-full rounded-full border border-accent px-6 py-3 text-sm font-semibold text-accent transition-colors hover:bg-dawn-soft">
                {t.contactSeller}
              </button>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1ebe57]"
              >
                {t.shareWhatsapp}
              </a>
            </div>

            {!listing.is_don && (
              <NegotiationPanel
                listingId={listing.id}
                askingPrice={listing.price}
                negociable={listing.negociable}
                sellerName={listing.seller?.name ?? dict.negotiation.defaultSellerName}
                userId={user?.id ?? null}
                offer={offer}
              />
            )}
          </div>
        </div>

        {similarListings.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold text-ink">{t.similarListings}</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {similarListings.map((item) => (
                <Link
                  key={item.id}
                  href={`/produits/${item.id}`}
                  className="flex flex-col overflow-hidden rounded-xl border border-line bg-paper transition-shadow hover:shadow-lg"
                >
                  <div className="flex h-28 items-center justify-center overflow-hidden bg-bg-alt text-3xl">
                    {item.photos.length > 0 ? (
                      <img
                        src={getListingPhotoUrl(item.photos[0])}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      item.emoji
                    )}
                  </div>
                  <div className="flex flex-col gap-1 p-4">
                    <h3 className="font-semibold text-ink">{item.title}</h3>
                    {item.is_don ? (
                      <span className="w-fit rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary-dark">
                        {t.don}
                      </span>
                    ) : (
                      <span className="font-mono font-bold text-accent-dark">
                        {formatEUR(item.price)}
                      </span>
                    )}
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
