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

  const [{ data: seller }, { count: reviewsCount }, { count: listingsCount }] =
    await Promise.all([
      supabase.from("sellers").select("*").eq("id", user.id).single(),
      supabase
        .from("reviews")
        .select("*", { count: "exact", head: true })
        .eq("seller_id", user.id),
      supabase
        .from("listings")
        .select("*", { count: "exact", head: true })
        .eq("seller_id", user.id),
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
        <h1 className="text-2xl font-bold text-stone-900">Mon profil</h1>

        <div className="mt-6 rounded-3xl border border-orange-100 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-5xl shadow-sm">
              {seller.avatar_emoji}
            </span>
            <h2 className="text-xl font-bold text-stone-900">
              {seller.name}
            </h2>
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-orange-700 shadow-sm">
              <span className="text-lg">{level.emoji}</span>
              {level.label}
            </div>
          </div>

          <div className="mt-6">
            {next ? (
              <>
                <div className="flex items-center justify-between text-xs font-medium text-stone-500">
                  <span>
                    {transactionsCount} transaction
                    {transactionsCount > 1 ? "s" : ""}
                  </span>
                  <span>
                    Prochain niveau : {next.emoji} {next.label} ({next.min})
                  </span>
                </div>
                <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-600 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </>
            ) : (
              <p className="text-center text-sm font-semibold text-orange-700">
                🎊 Niveau maximum atteint, bravo !
              </p>
            )}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-white p-3 shadow-sm">
              <p className="text-lg font-bold text-stone-900">
                {transactionsCount}
              </p>
              <p className="text-xs text-stone-500">Transactions</p>
            </div>
            <div className="rounded-2xl bg-white p-3 shadow-sm">
              <p className="text-lg font-bold text-stone-900">
                {rating.toFixed(1)} ★
              </p>
              <p className="text-xs text-stone-500">Note moyenne</p>
            </div>
            <div className="rounded-2xl bg-white p-3 shadow-sm">
              <p className="text-lg font-bold text-stone-900">
                {listingsCount ?? 0}
              </p>
              <p className="text-xs text-stone-500">Annonces</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
              Badges
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  key={badge.label}
                  title={badge.label}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                    badge.unlocked
                      ? "bg-white text-stone-700 shadow-sm"
                      : "bg-stone-100 text-stone-400"
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
          <h2 className="text-lg font-semibold text-stone-900">
            Modifier mon profil
          </h2>
          <ProfilForm seller={seller} />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
