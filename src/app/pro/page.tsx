import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SiretForm from "@/components/SiretForm";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { SiretStatus } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Souk El Business Pro",
  description:
    "Vendez comme un professionnel sur Souk El Business : badge vérifié, portfolio de réalisations et visibilité renforcée.",
};

const benefitIcons = [
  <path key="0" d="M12 3 5 6v5c0 5 3 8.5 7 10 4-1.5 7-5 7-10V6l-7-3Z M9 12l2 2 4-4" />,
  <g key="1"><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M3 9h18M8 4v5" /></g>,
  <g key="2"><path d="M20 6 9 17l-5-5" /><rect x="3" y="3" width="18" height="18" rx="4" /></g>,
  <g key="3"><path d="M12 17.3 6.2 21l1.6-6.6L2.5 9.7l6.7-.6L12 3l2.8 6.1 6.7.6-5.3 4.7 1.6 6.6Z" /></g>,
];

export default async function ProPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const t = dict.pro;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let sellerType: "particulier" | "pro" | null = null;
  let siretStatus: SiretStatus = "aucun";
  if (user) {
    const { data: seller } = await supabase
      .from("sellers")
      .select("type, siret_status")
      .eq("id", user.id)
      .maybeSingle();
    sellerType = seller?.type ?? null;
    siretStatus = seller?.siret_status ?? "aucun";
  }

  const siretFormLabels = {
    sectionTitle: t.siretSectionTitle,
    sectionText: t.siretSectionText,
    siretLabel: t.siretLabel,
    siretPlaceholder: t.siretPlaceholder,
    submit: t.siretSubmit,
    submitting: t.siretSubmitting,
    hint: t.siretHint,
  };

  const benefits = [
    { title: t.benefit1Title, text: t.benefit1Text },
    { title: t.benefit2Title, text: t.benefit2Text },
    { title: t.benefit3Title, text: t.benefit3Text },
    { title: t.benefit4Title, text: t.benefit4Text },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section id="ouvrir-boutique" className="scroll-mt-[6rem] bg-bg-alt py-16">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h1 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
              {t.heroTitle}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
              {t.heroSubtitle}
            </p>

            <div className="mt-8">
              {!user && (
                <Link
                  href="/inscription?type=pro"
                  className="inline-block rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
                >
                  {t.ctaButtonSignup}
                </Link>
              )}
              {user && sellerType === "pro" && siretStatus === "verifie" && (
                <div className="flex flex-col items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary-dark">
                    {t.siretVerifiedBadge}
                  </span>
                  <Link
                    href="/profil"
                    className="inline-block rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
                  >
                    {t.ctaButtonManage}
                  </Link>
                </div>
              )}
              {user && sellerType === "pro" && siretStatus === "en_attente" && (
                <div className="mx-auto max-w-md rounded-xl border border-line bg-paper px-5 py-4 text-sm text-ink-soft">
                  <p className="font-semibold text-ink">
                    {t.siretPendingTitle}
                  </p>
                  <p className="mt-1">{t.siretPendingText}</p>
                </div>
              )}
              {user &&
                sellerType === "pro" &&
                siretStatus === "rejete" && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="mx-auto max-w-md rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                      <p className="font-semibold">{t.siretRejectedTitle}</p>
                      <p className="mt-1">{t.siretRejectedText}</p>
                    </div>
                    <SiretForm labels={siretFormLabels} />
                  </div>
                )}
              {user &&
                ((sellerType === "particulier") ||
                  (sellerType === "pro" && siretStatus === "aucun")) && (
                  <SiretForm labels={siretFormLabels} />
                )}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {benefits.map((benefit, i) => (
              <div
                key={benefit.title}
                className="rounded-xl border border-line bg-paper p-[26px]"
              >
                <div className="mb-3.5 flex h-11 w-11 items-center justify-center rounded-full bg-bg-alt">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="h-5 w-5 text-accent"
                  >
                    {benefitIcons[i]}
                  </svg>
                </div>
                <h3 className="mb-2 text-[16.5px] font-semibold">
                  {benefit.title}
                </h3>
                <p className="text-[13.5px] leading-relaxed text-ink-soft">
                  {benefit.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-ink px-[30px] py-[26px]">
            <h3 className="font-serif text-[19px] font-semibold text-bg">
              {t.ctaTitle}
            </h3>
            {!user ? (
              <Link
                href="/inscription?type=pro"
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-accent-dark"
              >
                {t.ctaButtonSignup}
              </Link>
            ) : sellerType === "pro" ? (
              <Link
                href="/profil"
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-accent-dark"
              >
                {t.ctaButtonManage}
              </Link>
            ) : (
              <Link
                href="#ouvrir-boutique"
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-accent-dark"
              >
                {t.siretSectionTitle}
              </Link>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
