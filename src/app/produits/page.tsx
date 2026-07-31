import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ProduitsFilters from "@/components/ProduitsFilters";
import { getListings, getTauxChange } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Toutes les annonces",
  description:
    "Parcourez les annonces de véhicules, immobilier, mode, électronique et services partout en Algérie.",
};

export default async function ProduitsPage() {
  const [listings, taux] = await Promise.all([
    getListings(),
    getTauxChange().catch(() => 260),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <h1 className="text-2xl font-bold text-ink">
          Toutes les annonces
        </h1>
        <ProduitsFilters listings={listings} taux={taux} />
      </main>

      <SiteFooter />
    </div>
  );
}
