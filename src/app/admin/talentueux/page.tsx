import { requireAdminPage } from "@/lib/admin-guard";
import { getPendingTalents } from "@/lib/queries";
import { approveTalentAction, rejectTalentAction } from "@/app/actions";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function AdminTalentueuxPage() {
  const { adminClient } = await requireAdminPage();
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const t = dict.admin;

  const pending = await getPendingTalents(adminClient);

  return (
    <>
      <h1 className="text-2xl font-bold text-ink">{t.talentueuxTitle}</h1>

      <div className="mt-8 flex flex-col gap-4">
        {pending.map(({ seller, pro_profile }) => (
          <div
            key={seller.id}
            className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-5 sm:flex-row sm:items-center"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-bg-alt text-2xl">
              {seller.avatar_emoji}
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-ink">{seller.name}</h2>
              <p className="text-sm text-ink-soft">
                {pro_profile.metier || "—"} · {seller.city}
              </p>
              {seller.description && (
                <p className="mt-1 text-sm text-ink-soft">
                  {seller.description}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <form action={approveTalentAction}>
                <input type="hidden" name="sellerId" value={seller.id} />
                <button
                  type="submit"
                  className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
                >
                  {t.actionApprove}
                </button>
              </form>
              <form action={rejectTalentAction}>
                <input type="hidden" name="sellerId" value={seller.id} />
                <button
                  type="submit"
                  className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                  {t.actionRejectTalent}
                </button>
              </form>
            </div>
          </div>
        ))}

        {pending.length === 0 && (
          <p className="text-sm text-ink-soft">{t.noTalents}</p>
        )}
      </div>
    </>
  );
}
