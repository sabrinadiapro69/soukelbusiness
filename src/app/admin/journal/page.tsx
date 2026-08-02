import { requireAdminPage } from "@/lib/admin-guard";
import { getAuditLog, getAdmins } from "@/lib/queries";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

const actionTypes = [
  "approuver_annonce",
  "rejeter_annonce",
  "masquer_annonce",
  "rejeter_signalement",
  "avertir_utilisateur",
  "suspendre_utilisateur",
  "approuver_talentueux",
  "rejeter_talentueux",
];

export default async function AdminJournalPage({
  searchParams,
}: {
  searchParams: Promise<{ admin?: string; action?: string }>;
}) {
  const { adminClient } = await requireAdminPage();
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const t = dict.admin;
  const { admin, action } = await searchParams;

  const [entries, admins] = await Promise.all([
    getAuditLog(adminClient, { adminId: admin, action }),
    getAdmins(adminClient),
  ]);

  return (
    <>
      <h1 className="text-2xl font-bold text-ink">{t.journalTitle}</h1>

      <form className="mt-6 flex flex-wrap gap-3">
        <select
          name="admin"
          defaultValue={admin ?? ""}
          className="rounded-full border border-line bg-paper px-4 py-2.5 text-sm text-ink-soft"
        >
          <option value="">{t.filterAllAdmins}</option>
          {admins.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <select
          name="action"
          defaultValue={action ?? ""}
          className="rounded-full border border-line bg-paper px-4 py-2.5 text-sm text-ink-soft"
        >
          <option value="">{t.filterAllActions}</option>
          {actionTypes.map((a) => (
            <option key={a} value={a}>
              {a}
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

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs text-ink-soft uppercase">
              <th className="py-2 pr-4">{t.columnDate}</th>
              <th className="py-2 pr-4">{t.columnAdmin}</th>
              <th className="py-2 pr-4">{t.columnAction}</th>
              <th className="py-2 pr-4">{t.columnCible}</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-line">
                <td className="py-2 pr-4 whitespace-nowrap text-ink-soft">
                  {new Date(entry.created_at).toLocaleString("fr-FR")}
                </td>
                <td className="py-2 pr-4">{entry.admin?.name ?? entry.admin_id}</td>
                <td className="py-2 pr-4 font-mono text-xs">{entry.action}</td>
                <td className="py-2 pr-4 text-ink-soft">
                  {entry.cible_type} {entry.cible_id ? `#${entry.cible_id}` : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {entries.length === 0 && (
          <p className="mt-6 text-sm text-ink-soft">{t.noLogs}</p>
        )}
      </div>
    </>
  );
}
