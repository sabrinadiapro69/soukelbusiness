import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  formatDA,
  formatEurApprox,
  formatRelativeTime,
  getListingById,
  getListingsByCategory,
  getTauxChange,
  type Offer,
} from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import NegotiationPanel from "@/components/NegotiationPanel";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListingById(Number(id));

  if (!listing) return {};

  const description = `${formatDA(listing.price)} · ${listing.category} · ${listing.location}. ${listing.description}`.slice(
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

  const taux = await getTauxChange().catch(() => 260);

  const requestHeaders = await headers();
  const host = requestHeaders.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  const listingUrl = `${protocol}://${host}/produits/${listing.id}`;
  const whatsappMessage = `${listing.title} — ${formatDA(listing.price)}\n${listingUrl}`;
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
          ← Retour aux annonces
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="flex h-80 items-center justify-center rounded-2xl bg-bg-alt text-8xl">
            {listing.emoji}
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
                {listing.seller?.type === "pro" ? "Pro" : "Particulier"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-3xl font-bold text-accent-dark">
                {formatDA(listing.price)}
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  listing.negociable
                    ? "bg-primary/10 text-primary-dark"
                    : "bg-bg-alt text-ink-soft"
                }`}
              >
                {listing.negociable ? "Négociable" : "Prix ferme"}
              </span>
            </div>
            <span className="text-xs text-ink-soft">
              {formatEurApprox(listing.price, taux)} (taux indicatif)
            </span>

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

            <div className="mt-4 rounded-2xl border border-line bg-paper p-5">
              <p className="text-sm text-ink-soft">Vendu par</p>
              <Link
                href={`/vendeurs/${listing.seller_id}`}
                className="mt-1 inline-block font-semibold text-ink hover:text-accent"
              >
                {listing.seller?.name}
              </Link>
              <p className="text-sm text-ink-soft">📍 {listing.location}</p>
              <button className="mt-4 w-full rounded-full border border-accent px-6 py-3 text-sm font-semibold text-accent transition-colors hover:bg-dawn-soft">
                Contacter le vendeur
              </button>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1ebe57]"
              >
                Partager sur WhatsApp
              </a>
            </div>

            <NegotiationPanel
              listingId={listing.id}
              askingPrice={listing.price}
              negociable={listing.negociable}
              sellerName={listing.seller?.name ?? "le vendeur"}
              userId={user?.id ?? null}
              offer={offer}
            />
          </div>
        </div>

        {similarListings.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold text-ink">Annonces similaires</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {similarListings.map((item) => (
                <Link
                  key={item.id}
                  href={`/produits/${item.id}`}
                  className="flex flex-col overflow-hidden rounded-xl border border-line bg-paper transition-shadow hover:shadow-lg"
                >
                  <div className="flex h-28 items-center justify-center bg-bg-alt text-3xl">
                    {item.emoji}
                  </div>
                  <div className="flex flex-col gap-1 p-4">
                    <h3 className="font-semibold text-ink">{item.title}</h3>
                    <span className="font-mono font-bold text-accent-dark">
                      {formatDA(item.price)}
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
