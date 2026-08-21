import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLevelProgress, getBadges } from "@/lib/gamification";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ProfilForm from "@/components/ProfilForm";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const dynamic = "force-dynamic";
// Laisse plus de temps au serveur pour l'envoi des photos de portfolio
// sur une connexion mobile lente.
export const maxDuration = 60;

export default async function ProfilPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const t = dict.profil;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const [
    { data: seller },
    { count: reviewsCount },
    { count: listingsCount },
    { data: proProfile },
    { data: portfolio },
  ] = await Promise.all([
    supabase.from("sellers").select("*").eq("id", user.id).single(),
    supabase
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("seller_id", user.id),
    supabase
      .from("listings")
      .select("*", { count: "exact", head: true })
      .eq("seller_id", user.id),
    supabase
      .from("pro_profiles")
      .select("*")
      .eq("seller_id", user.id)
      .maybeSingle(),
    supabase
      .from("portfolio_items")
      .select("*")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: true }),
  ]);

  if (!seller) {
    redirect("/");
  }

  const rating = Number(seller.rating);
  const transactionsCount = seller.transactions_count;
  const { level, next, progress } = getLevelProgress(
    transactionsCount,
    t.levels
  );
  const badges = getBadges(
    {
      transactionsCount,
      rating,
      reviewsCount: reviewsCount ?? 0,
      type: seller.type,
      listingsCount: listingsCount ?? 0,
    },
    t.badges
  );

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="text-2xl font-bold text-ink">{t.pageTitle}</h1>

        <div className="mt-6 rounded-3xl border border-line bg-bg-alt p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="flex h-24 w-24 items-center justify-center rounded-full bg-paper text-5xl shadow-sm">
              {seller.avatar_emoji}
            </span>
            <h2 className="text-xl font-bold text-ink">
              {seller.name}
            </h2>
            <div className="flex items-center gap-2 rounded-full bg-paper px-4 py-1.5 text-sm font-semibold text-accent shadow-sm">
              <span className="text-lg">{level.emoji}</span>
              {level.label}
            </div>
          </div>

          <div className="mt-6">
            {next ? (
              <>
                <div className="flex items-center justify-between text-xs font-medium text-ink-soft">
                  <span>{t.transactionsCount(transactionsCount)}</span>
                  <span>
                    {t.nextLevel} {next.emoji} {next.label} ({next.min})
                  </span>
                </div>
                <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-paper">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold to-accent transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </>
            ) : (
              <p className="text-center text-sm font-semibold text-accent">
                {t.maxLevel}
              </p>
            )}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-paper p-3 shadow-sm">
              <p className="text-lg font-bold text-ink">
                {transactionsCount}
              </p>
              <p className="text-xs text-ink-soft">{t.transactionsLabel}</p>
            </div>
            <div className="rounded-2xl bg-paper p-3 shadow-sm">
              <p className="text-lg font-bold text-ink">
                {rating.toFixed(1)} ★
              </p>
              <p className="text-xs text-ink-soft">{t.averageRating}</p>
            </div>
            <div className="rounded-2xl bg-paper p-3 shadow-sm">
              <p className="text-lg font-bold text-ink">
                {listingsCount ?? 0}
              </p>
              <p className="text-xs text-ink-soft">{t.listingsLabel}</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft/70">
              {t.badgesLabel}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  key={badge.label}
                  title={badge.label}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                    badge.unlocked
                      ? "bg-paper text-ink shadow-sm"
                      : "bg-bg-alt text-ink-soft/70"
                  }`}
                >
                  <span className={badge.unlocked ? "" : "grayscale opacity-50"}>
                    {badge.emoji}
                  </span>
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-ink">{t.editTitle}</h2>
          <ProfilForm
            seller={seller}
            metier={proProfile?.metier ?? ""}
            categories={proProfile?.categories ?? []}
            portfolio={portfolio ?? []}
            dict={dict.profilForm}
            categoryLabels={{
              creation: dict.home.categoryCreationTitle,
              mode: dict.home.categoryModeTitle,
              maison: dict.home.categoryMaisonTitle,
              beaute: dict.home.categoryBeauteTitle,
              photo: dict.home.categoryPhotoTitle,
              services: dict.home.categoryServicesTitle,
            }}
          />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
