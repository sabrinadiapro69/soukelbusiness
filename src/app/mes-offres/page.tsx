import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatEUR } from "@/lib/queries";
import { acceptCounterAction, concludeTransactionAction } from "@/app/actions";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ReviewForm from "@/components/ReviewForm";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const dynamic = "force-dynamic";

export default async function MesOffresPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const t = dict.offresEnvoyees;

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
    .select("*, listings(*), review:reviews(id)")
    .eq("buyer_id", user.id)
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
            const montant = Number(offer.montant_propose);
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
                      {t.displayedPrice} {formatEUR(Number(offer.listings.price))}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                  >
                    {status.label}
                  </span>
                </div>

                <p className="mt-3 font-mono text-lg font-bold text-accent-dark">
                  {t.yourOffer} {formatEUR(montant)}
                </p>

                {offer.statut === "contre_offre" && (
                  <form action={acceptCounterAction} className="mt-4">
                    <input type="hidden" name="offerId" value={offer.id} />
                    <input
                      type="hidden"
                      name="listingId"
                      value={offer.listings.id}
                    />
                    <button
                      type="submit"
                      className="rounded-full border border-accent px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-dawn-soft"
                    >
                      {t.acceptAt(formatEUR(montant))}
                    </button>
                  </form>
                )}

                {offer.statut === "acceptee" && (
                  <div className="mt-4">
                    {offer.conclue_par_acheteur ? (
                      <>
                        <p className="text-sm font-medium text-green-700">
                          {t.concluded}
                        </p>
                        {(Array.isArray(offer.review)
                          ? offer.review.length === 0
                          : !offer.review) && (
                          <ReviewForm
                            offerId={offer.id}
                            dict={dict.reviewForm}
                          />
                        )}
                      </>
                    ) : (
                      <form action={concludeTransactionAction}>
                        <input type="hidden" name="offerId" value={offer.id} />
                        <input
                          type="hidden"
                          name="listingId"
                          value={offer.listings.id}
                        />
                        <button
                          type="submit"
                          className="rounded-full bg-green-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-green-800"
                        >
                          {t.markConcluded}
                        </button>
                      </form>
                    )}
                  </div>
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
