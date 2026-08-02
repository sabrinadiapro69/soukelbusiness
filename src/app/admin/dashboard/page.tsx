import { requireAdminPage } from "@/lib/admin-guard";
import { getDashboardCounts } from "@/lib/queries";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function AdminDashboardPage() {
  const { adminClient } = await requireAdminPage();
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const t = dict.admin;

  const counts = await getDashboardCounts(adminClient);

  const cards = [
    { label: t.newUsersLabel, value: counts.newUsers },
    { label: t.newListingsLabel, value: counts.newListings },
    { label: t.pendingReportsLabel, value: counts.pendingReports },
    { label: t.pendingTalentsLabel, value: counts.pendingTalents },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold text-ink">{t.dashboardTitle}</h1>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-line bg-paper p-6"
          >
            <span className="block font-mono text-3xl font-bold text-accent-dark">
              {card.value}
            </span>
            <span className="mt-2 block text-sm text-ink-soft">
              {card.label}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
