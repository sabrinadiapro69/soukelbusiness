import { requireAdminPage } from "@/lib/admin-guard";
import {
  searchAdminUsers,
  getSellerListingsCount,
  getSellerReportsCount,
} from "@/lib/queries";
import { suspendUserAction } from "@/app/actions";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function AdminUtilisateursPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { adminClient } = await requireAdminPage();
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const t = dict.admin;
  const { q } = await searchParams;

  const sellers = await searchAdminUsers(adminClient, q ?? "");
  const rows = await Promise.all(
    sellers.map(async (seller) => ({
      seller,
      listingsCount: await getSellerListingsCount(adminClient, seller.id),
      reportsCount: await getSellerReportsCount(adminClient, seller.id),
    }))
  );

  return (
    <>
      <h1 className="text-2xl font-bold text-ink">{t.utilisateursTitle}</h1>

      <form className="mt-6 flex max-w-md gap-3">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder={t.searchPlaceholder}
          className="w-full rounded-full border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-ink"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full border border-line px-5 py-2.5 text-sm font-semibold transition-colors hover:border-ink"
        >
          {t.searchButton}
        </button>
      </form>

      <div className="mt-8 flex flex-col gap-3">
        {rows.map(({ seller, listingsCount, reportsCount }) => (
          <div
            key={seller.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-paper p-5"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg-alt text-xl">
                {seller.avatar_emoji}
              </span>
              <div>
                <p className="font-semibold text-ink">{seller.name}</p>
                <p className="text-xs text-ink-soft">
                  {t.columnListings}: {listingsCount} · {t.columnReports}:{" "}
                  {reportsCount}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  seller.status === "suspendu"
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {seller.status === "suspendu"
                  ? t.statusSuspended
                  : t.statusActive}
              </span>
              {seller.status !== "suspendu" && (
                <form action={suspendUserAction}>
                  <input type="hidden" name="sellerId" value={seller.id} />
                  <input
                    type="hidden"
                    name="redirectTo"
                    value={`/admin/utilisateurs${q ? `?q=${encodeURIComponent(q)}` : ""}`}
                  />
                  <button
                    type="submit"
                    className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                  >
                    {t.actionSuspend}
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}

        {rows.length === 0 && (
          <p className="text-sm text-ink-soft">{t.noUsers}</p>
        )}
      </div>
    </>
  );
}
