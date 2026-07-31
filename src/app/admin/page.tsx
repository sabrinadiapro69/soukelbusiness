import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { approveListingAction, rejectListingAction } from "@/app/actions";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const { data: seller } = await supabase
    .from("sellers")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (!seller?.is_admin) {
    redirect("/");
  }

  const { data: pendingListings } = await supabase
    .from("listings")
    .select("*, seller:sellers(name, city)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
        <h1 className="text-2xl font-bold text-stone-900">
          Modération des annonces
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          {pendingListings?.length ?? 0} annonce
          {(pendingListings?.length ?? 0) > 1 ? "s" : ""} en attente
        </p>

        <div className="mt-8 flex flex-col gap-4">
          {pendingListings?.map((listing) => (
            <div
              key={listing.id}
              className="flex flex-col gap-4 rounded-2xl border border-orange-100 bg-white p-5 sm:flex-row sm:items-center"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 text-3xl">
                {listing.emoji}
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-stone-900">
                  {listing.title}
                </h2>
                <p className="text-sm text-stone-500">
                  {listing.price} € · {listing.category} · {listing.location}
                </p>
                <p className="text-sm text-stone-500">
                  Par {listing.seller?.name} ({listing.seller?.city})
                </p>
                <p className="mt-1 text-sm text-stone-600">
                  {listing.description}
                </p>
              </div>
              <div className="flex gap-2">
                <form action={approveListingAction}>
                  <input type="hidden" name="listingId" value={listing.id} />
                  <button
                    type="submit"
                    className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
                  >
                    Approuver
                  </button>
                </form>
                <form action={rejectListingAction}>
                  <input type="hidden" name="listingId" value={listing.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                  >
                    Refuser
                  </button>
                </form>
              </div>
            </div>
          ))}

          {(!pendingListings || pendingListings.length === 0) && (
            <p className="text-sm text-stone-500">
              Aucune annonce en attente de modération.
            </p>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
