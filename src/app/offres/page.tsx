import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDA } from "@/lib/queries";
import { sellerRespondOfferAction } from "@/app/actions";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const dynamic = "force-dynamic";

export default async function OffresPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const t = dict.offresRecues;

  const statusLabels: Record<string, { label: string; className: string }> = {
    en_attente: {
      label: t.statusPending,
      className: "bg-primary/10 text-primary-dark",
    },
    contre_offre: {
      label: t.statusCounter,
      className: "bg-dawn-soft text-accent-dark",
    },
    acceptee: { label: t.statusAccepted, className: "bg-green-100 text-green-700" },
    refusee: { label: t.statusRefused, className: "bg-bg-alt text-ink-soft" },
  };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const { data: offers } = await supabase
    .from("offers")
    .select("*, listings!inner(*), buyer:sellers(*)")
    .eq("listings.seller_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
        <h1 className="text-2xl font-bold text-ink">{t.pageTitle}</h1>
        <p className="mt-1 text-sm text-ink-soft">{t.pageSubtitle}</p>

        <div className="mt-8 flex flex-col gap-4">
          {offers?.map((offer) => {
            const status = statusLabels[offer.statut] ?? statusLabels.en_attente;
            return (
              <div
                key={offer.id}
                className="rounded-2xl border border-line bg-paper p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/produits/${offer.listings.id}`}
                      className="font-semibold text-ink hover:text-accent"
                    >
                      {offer.listings.title}
                    </Link>
                    <p className="text-sm text-ink-soft">
                      {t.by} {offer.buyer?.name} · {t.displayedPrice}{" "}
                      {formatDA(offer.listings.price)}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                  >
                    {status.label}
                  </span>
                </div>

                <p className="mt-3 font-mono text-lg font-bold text-accent-dark">
                  {t.offer} {formatDA(Number(offer.montant_propose))}
                </p>

                {offer.statut === "en_attente" && (
                  <div className="mt-4 flex flex-wrap items-end gap-2">
                    <form action={sellerRespondOfferAction}>
                      <input type="hidden" name="offerId" value={offer.id} />
                      <input
                        type="hidden"
                        name="listingId"
                        value={offer.listings.id}
                      />
                      <input type="hidden" name="decision" value="accepter" />
                      <button
                        type="submit"
                        className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
                      >
                        {t.accept}
                      </button>
                    </form>
                    <form action={sellerRespondOfferAction}>
                      <input type="hidden" name="offerId" value={offer.id} />
                      <input
                        type="hidden"
                        name="listingId"
                        value={offer.listings.id}
                      />
                      <input type="hidden" name="decision" value="refuser" />
                      <button
                        type="submit"
                        className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink-soft transition-colors hover:border-ink"
                      >
                        {t.refuse}
                      </button>
                    </form>
                    <form
                      action={sellerRespondOfferAction}
                      className="flex items-end gap-2"
                    >
                      <input type="hidden" name="offerId" value={offer.id} />
                      <input
                        type="hidden"
                        name="listingId"
                        value={offer.listings.id}
                      />
                      <input
                        type="hidden"
                        name="decision"
                        value="contre_offre"
                      />
                      <div>
                        <label className="text-xs font-medium text-ink-soft">
                          {t.counterOfferLabel}
                        </label>
                        <input
                          type="number"
                          name="montant"
                          min={1}
                          defaultValue={Number(offer.montant_propose)}
                          className="mt-1 w-32 rounded-xl border border-line px-3 py-2 text-sm text-ink outline-none focus:border-accent"
                        />
                      </div>
                      <button
                        type="submit"
                        className="rounded-full border border-accent px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-dawn-soft"
                      >
                        {t.send}
                      </button>
                    </form>
                  </div>
                )}

                {offer.statut === "acceptee" && offer.conclue_par_acheteur && (
                  <p className="mt-3 text-sm font-medium text-green-700">
                    {t.buyerConfirmed}
                  </p>
                )}
              </div>
            );
          })}

          {(!offers || offers.length === 0) && (
            <p className="text-sm text-ink-soft">{t.noOffers}</p>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
