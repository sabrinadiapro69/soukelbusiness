import { requireAdminPage } from "@/lib/admin-guard";
import { searchAdminListings, formatDA, getListingPhotoUrl, categories } from "@/lib/queries";
import { wilayas } from "@/lib/wilayas";
import {
  approveListingAction,
  rejectListingAction,
  removeListingAction,
} from "@/app/actions";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function AdminAnnoncesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    categorie?: string;
    statut?: string;
    wilaya?: string;
  }>;
}) {
  const { adminClient } = await requireAdminPage();
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const t = dict.admin;
  const { q, categorie, statut, wilaya } = await searchParams;

  const listings = await searchAdminListings(adminClient, {
    query: q,
    category: categorie,
    statut,
    wilaya,
  });

  const statutLabels: Record<string, string> = {
    pending: t.statutPending,
    approved: t.statutApproved,
    rejected: t.statutRejected,
  };

  const postableCategories = categories.filter((c) => c !== "Toutes catégories");

  return (
    <>
      <h1 className="text-2xl font-bold text-ink">{t.annoncesTitle}</h1>

      <form className="mt-6 flex flex-wrap gap-3">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder={t.searchByTitlePlaceholder}
          className="min-w-[220px] flex-1 rounded-full border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-ink"
        />
        <select
          name="categorie"
          defaultValue={categorie ?? ""}
          className="rounded-full border border-line bg-paper px-4 py-2.5 text-sm text-ink-soft"
        >
          <option value="">{t.filterAllCategories}</option>
          {postableCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          name="statut"
          defaultValue={statut ?? ""}
          className="rounded-full border border-line bg-paper px-4 py-2.5 text-sm text-ink-soft"
        >
          <option value="">{t.filterAllStatuses}</option>
          <option value="pending">{t.statutPending}</option>
          <option value="approved">{t.statutApproved}</option>
          <option value="rejected">{t.statutRejected}</option>
        </select>
        <select
          name="wilaya"
          defaultValue={wilaya ?? ""}
          className="rounded-full border border-line bg-paper px-4 py-2.5 text-sm text-ink-soft"
        >
          <option value="">{t.filterAllWilayas}</option>
          {wilayas.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold transition-colors hover:border-ink"
        >
          {t.searchButton}
        </button>
      </form>

      <div className="mt-8 flex flex-col gap-4">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-5 sm:flex-row sm:items-center"
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-bg-alt text-3xl">
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
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold text-ink">{listing.title}</h2>
                <span className="rounded-full bg-bg-alt px-2 py-0.5 text-xs font-semibold text-ink-soft">
                  {statutLabels[listing.status ?? "approved"]}
                </span>
              </div>
              <p className="text-sm text-ink-soft">
                {listing.is_don ? dict.produit.don : formatDA(listing.price)} ·{" "}
                {listing.category} · {listing.location}
              </p>
              <p className="text-sm text-ink-soft">
                {listing.seller?.name}
              </p>
            </div>
            <div className="flex gap-2">
              {listing.status === "pending" ? (
                <>
                  <form action={approveListingAction}>
                    <input type="hidden" name="listingId" value={listing.id} />
                    <button
                      type="submit"
                      className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
                    >
                      {t.actionApproveListing}
                    </button>
                  </form>
                  <form action={rejectListingAction}>
                    <input type="hidden" name="listingId" value={listing.id} />
                    <button
                      type="submit"
                      className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                    >
                      {t.actionRejectListing}
                    </button>
                  </form>
                </>
              ) : (
                listing.status === "approved" && (
                  <form action={removeListingAction}>
                    <input type="hidden" name="listingId" value={listing.id} />
                    <button
                      type="submit"
                      className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                    >
                      {t.actionRemove}
                    </button>
                  </form>
                )
              )}
            </div>
          </div>
        ))}

        {listings.length === 0 && (
          <p className="text-sm text-ink-soft">{t.noListings}</p>
        )}
      </div>
    </>
  );
}
