import { redirect } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { createClient } from "@/lib/supabase/server";
import { getSavedSearches } from "@/lib/queries";
import { deleteSavedSearchAction } from "@/app/actions";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const dynamic = "force-dynamic";

export default async function MesRecherchesPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const t = dict.mesRecherches;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const savedSearches = await getSavedSearches(supabase, user.id);

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="text-2xl font-bold text-ink">{t.pageTitle}</h1>

        <div className="mt-8 flex flex-col gap-3">
          {savedSearches.map((search) => {
            const params = new URLSearchParams();
            if (search.query) params.set("q", search.query);
            if (search.category) params.set("categorie", search.category);
            if (search.wilaya) params.set("wilaya", search.wilaya);
            if (search.commune) params.set("commune", search.commune);
            const href = `/produits?${params.toString()}`;

            const location = search.commune
              ? `${search.commune}, ${search.wilaya}`
              : search.wilaya;

            return (
              <div
                key={search.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-paper p-5"
              >
                <div>
                  <p className="font-semibold text-ink">
                    {search.query || search.category}
                  </p>
                  {search.query && search.category !== "Toutes catégories" && (
                    <p className="text-sm text-ink-soft">{search.category}</p>
                  )}
                  {location && (
                    <p className="text-sm text-ink-soft">📍 {location}</p>
                  )}
                  <p className="mt-1 text-xs text-ink-soft/70">
                    {t.savedOn}{" "}
                    {new Date(search.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={href}
                    className="rounded-full border border-line px-4 py-2 text-sm font-semibold transition-colors hover:border-ink"
                  >
                    {t.viewButton}
                  </Link>
                  <form action={deleteSavedSearchAction}>
                    <input type="hidden" name="id" value={search.id} />
                    <button
                      type="submit"
                      className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-ink"
                    >
                      {t.deleteButton}
                    </button>
                  </form>
                </div>
              </div>
            );
          })}

          {savedSearches.length === 0 && (
            <div className="rounded-2xl border border-line bg-paper p-8 text-center">
              <p className="text-sm text-ink-soft">{t.empty}</p>
              <p className="mt-2 text-sm text-ink-soft">{t.emptyHint}</p>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
