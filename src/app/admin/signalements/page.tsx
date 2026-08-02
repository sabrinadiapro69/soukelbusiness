import Link from "next/link";
import { requireAdminPage } from "@/lib/admin-guard";
import { getReports } from "@/lib/queries";
import {
  removeListingAction,
  warnUserAction,
  rejectReportAction,
  suspendUserAction,
} from "@/app/actions";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

const statusStyles: Record<string, string> = {
  en_attente: "bg-primary/10 text-primary-dark",
  traite: "bg-green-100 text-green-700",
  rejete: "bg-bg-alt text-ink-soft",
};

export default async function AdminSignalementsPage() {
  const { adminClient } = await requireAdminPage();
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const t = dict.admin;

  const reports = await getReports(adminClient);

  const statusLabels: Record<string, string> = {
    en_attente: t.statusPending,
    traite: t.statusTreated,
    rejete: t.statusRejected,
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-ink">{t.signalementsTitle}</h1>

      <div className="mt-8 flex flex-col gap-4">
        {reports.map((report) => {
          const targetHref =
            report.type === "annonce"
              ? `/produits/${report.target_id}`
              : `/vendeurs/${report.target_id}`;

          return (
            <div
              key={report.id}
              className="rounded-2xl border border-line bg-paper p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link
                    href={targetHref}
                    className="font-semibold text-ink hover:text-accent"
                  >
                    {report.type === "annonce" ? "📦" : "👤"} {report.type} #
                    {report.target_id}
                  </Link>
                  <p className="mt-1 text-sm text-ink-soft">
                    {t.reportedBy} {report.reporter?.name ?? report.reporter_id}
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">
                    {t.motifLabel} {report.motif}
                  </p>
                  {report.description && (
                    <p className="mt-1 text-sm text-ink-soft">
                      {report.description}
                    </p>
                  )}
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[report.statut]}`}
                >
                  {statusLabels[report.statut]}
                </span>
              </div>

              {report.statut === "en_attente" && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {report.type === "annonce" && (
                    <form action={removeListingAction}>
                      <input type="hidden" name="listingId" value={report.target_id} />
                      <input type="hidden" name="reportId" value={report.id} />
                      <button
                        type="submit"
                        className="rounded-full border border-line px-4 py-2 text-sm font-medium transition-colors hover:border-ink"
                      >
                        {t.actionHide}
                      </button>
                    </form>
                  )}
                  {report.sellerId && (
                    <form action={warnUserAction}>
                      <input type="hidden" name="sellerId" value={report.sellerId} />
                      <input type="hidden" name="reportId" value={report.id} />
                      <button
                        type="submit"
                        className="rounded-full border border-line px-4 py-2 text-sm font-medium transition-colors hover:border-ink"
                      >
                        {t.actionWarn}
                      </button>
                    </form>
                  )}
                  <form action={rejectReportAction}>
                    <input type="hidden" name="reportId" value={report.id} />
                    <button
                      type="submit"
                      className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-ink"
                    >
                      {t.actionRejectReport}
                    </button>
                  </form>
                  {report.sellerId && (
                    <form action={suspendUserAction}>
                      <input type="hidden" name="sellerId" value={report.sellerId} />
                      <input type="hidden" name="reportId" value={report.id} />
                      <input type="hidden" name="redirectTo" value="/admin/signalements" />
                      <button
                        type="submit"
                        className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                      >
                        {t.actionBan}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {reports.length === 0 && (
          <p className="text-sm text-ink-soft">{t.noReports}</p>
        )}
      </div>
    </>
  );
}
