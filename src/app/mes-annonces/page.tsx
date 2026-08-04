import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  formatDA,
  formatRelativeTime,
  getListingPhotoUrl,
  getMyListings,
} from "@/lib/queries";
import { deleteListingAction } from "@/app/actions";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const dynamic = "force-dynamic";

export default async function MesAnnoncesPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const t = dict.mesAnnonces;

  const statusStyles: Record<string, string> = {
    pending: "bg-primary/10 text-primary-dark",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-bg-alt text-ink-soft",
    vendu: "bg-dawn-soft text-accent-dark",
  };

  const statusLabels: Record<string, string> = {
    pending: t.statusPending,
    approved: t.statusApproved,
    rejected: t.statusRejected,
    vendu: t.statusVendu,
  };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const listings = await getMyListings(supabase, user.id);

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-ink">{t.pageTitle}</h1>
          <Link
            href="/publier"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
          >
            {t.newListing}
          </Link>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-paper p-4"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-bg-alt text-2xl">
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

              <div className="min-w-0 flex-1">
                <Link
                  href={`/produits/${listing.id}`}
                  className="font-semibold text-ink hover:text-accent"
                >
                  {listing.title}
                </Link>
                <p className="text-sm text-ink-soft">
                  {listing.is_don ? dict.produit.don : formatDA(listing.price)} ·{" "}
                  {formatRelativeTime(listing.created_at)}
                </p>
                {listing.status === "vendu" && listing.sold_offer && (
                  <p className="mt-1 text-sm text-ink-soft">
                    {t.soldTo} {listing.sold_offer.buyer?.name ?? "—"} {t.soldFor}{" "}
                    {formatDA(listing.sold_offer.montant_propose)}
                    {listing.sold_offer.conclue_le && (
                      <> · {formatRelativeTime(listing.sold_offer.conclue_le)}</>
                    )}
                  </p>
                )}
              </div>

              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[listing.status ?? "pending"]}`}
              >
                {statusLabels[listing.status ?? "pending"]}
              </span>

              {listing.status !== "vendu" && (
                <form action={deleteListingAction}>
                  <input type="hidden" name="listingId" value={listing.id} />
                  <button
                    type="submit"
                    className="shrink-0 rounded-full border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    {t.deleteButton}
                  </button>
                </form>
              )}
            </div>
          ))}

          {listings.length === 0 && (
            <div className="rounded-2xl border border-line bg-paper p-8 text-center">
              <p className="text-sm text-ink-soft">{t.empty}</p>
              <p className="mt-1 text-sm text-ink-soft">{t.emptyHint}</p>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
