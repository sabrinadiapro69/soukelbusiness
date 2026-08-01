import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ProduitsFilters from "@/components/ProduitsFilters";
import { getListings, getTauxChange } from "@/lib/queries";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createClient } from "@/lib/supabase/server";
import { saveSearchAction } from "@/app/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Toutes les annonces",
  description:
    "Parcourez les annonces de véhicules, immobilier, mode, électronique et services partout en Algérie.",
};

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categorie?: string; saved?: string }>;
}) {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const { q, categorie, saved } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [listings, taux] = await Promise.all([
    getListings(),
    getTauxChange().catch(() => 260),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <h1 className="text-2xl font-bold text-ink">
          {dict.produits.pageTitle}
        </h1>
        <ProduitsFilters
          listings={listings}
          taux={taux}
          dict={dict.produits}
          locale={locale}
          initialQuery={q ?? ""}
          initialCategory={categorie ?? "Toutes catégories"}
          justSaved={saved === "1"}
          isLoggedIn={Boolean(user)}
          saveSearchAction={saveSearchAction}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
