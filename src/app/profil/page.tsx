import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLevelProgress, getBadges } from "@/lib/gamification";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ProfilForm from "@/components/ProfilForm";

export const dynamic = "force-dynamic";

export default async function ProfilPage() {
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
  const { level, next, progress } = getLevelProgress(transactionsCount);
  const badges = getBadges({
    transactionsCount,
    rating,
    reviewsCount: reviewsCount ?? 0,
    type: seller.type,
    listingsCount: listingsCount ?? 0,
  });

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="text-2xl font-bold text-ink">Mon profil</h1>

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
                  <span>
                    {transactionsCount} transaction
                    {transactionsCount > 1 ? "s" : ""}
                  </span>
                  <span>
                    Prochain niveau : {next.emoji} {next.label} ({next.min})
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
                🎊 Niveau maximum atteint, bravo !
              </p>
            )}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-paper p-3 shadow-sm">
              <p className="text-lg font-bold text-ink">
                {transactionsCount}
              </p>
              <p className="text-xs text-ink-soft">Transactions</p>
            </div>
            <div className="rounded-2xl bg-paper p-3 shadow-sm">
              <p className="text-lg font-bold text-ink">
                {rating.toFixed(1)} ★
              </p>
              <p className="text-xs text-ink-soft">Note moyenne</p>
            </div>
            <div className="rounded-2xl bg-paper p-3 shadow-sm">
              <p className="text-lg font-bold text-ink">
                {listingsCount ?? 0}
              </p>
              <p className="text-xs text-ink-soft">Annonces</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft/70">
              Badges
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
          <h2 className="text-lg font-semibold text-ink">
            Modifier mon profil
          </h2>
          <ProfilForm
            seller={seller}
            metier={proProfile?.metier ?? ""}
            portfolio={portfolio ?? []}
          />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
