import Link from "next/link";
import {
  BadgeCheck,
  CheckCircle2,
  Compass,
  MessageCircle,
  Send,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import OffersSection from "@/components/home/OffersSection";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const t = dict.home;

  const categories = [
    { key: "creation" as const, title: t.categoryCreationTitle, cta: t.categoryDiscover },
    { key: "mode" as const, title: t.categoryModeTitle, cta: t.categoryDiscover },
    { key: "maison" as const, title: t.categoryMaisonTitle, cta: t.categoryDiscover },
    { key: "beaute" as const, title: t.categoryBeauteTitle, cta: t.categoryDiscover },
    { key: "photo" as const, title: t.categoryPhotoTitle, cta: t.categoryDiscover },
    { key: "services" as const, title: t.categoryServicesTitle, cta: t.categoryDiscover },
  ];

  const offersLabels = {
    categoriesEyebrow: t.categoriesEyebrow,
    categoriesTitle: t.categoriesTitle,
    offersEyebrow: t.offersEyebrow,
    offersTitle: t.offersTitle,
    filterAll: t.offersFilterAll,
    verifiedLabel: t.offersVerified,
    reviewsLabel: t.offersVerified,
    fromLabel: t.offersFrom,
    favoriteLabel: t.offersFavoriteAdd,
    unfavoriteLabel: t.offersFavoriteRemove,
    negotiateLabel: t.offersNegotiate,
    demoNotice: t.offersDemoNotice,
  };

  const modalLabels = {
    title: t.modalTitle,
    displayedPrice: t.modalDisplayedPrice,
    yourPrice: t.modalYourPricePlaceholder,
    yourPriceLabel: t.modalYourPriceLabel,
    message: t.modalMessageLabel,
    messagePlaceholder: t.modalMessagePlaceholder,
    submit: t.modalSubmit,
    hint: t.modalHint,
    close: t.modalClose,
    sentTitle: t.modalSentTitle,
    sentText: t.modalSentText,
  };

  const advantages = [
    t.creatorsPoint1,
    t.creatorsPoint2,
    t.creatorsPoint3,
    t.creatorsPoint4,
    t.creatorsPoint5,
  ];

  const steps = [
    { icon: Compass, title: t.howStep1Title, text: t.howStep1Text },
    { icon: MessageCircle, title: t.howStep2Title, text: t.howStep2Text },
    { icon: Send, title: t.howStep3Title, text: t.howStep3Text },
  ];

  return (
    <>
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="border-b border-line bg-bg py-14 sm:py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <span className="mb-4 block font-mono text-[11px] font-medium tracking-wide text-primary uppercase">
                {t.heroEyebrow}
              </span>
              <h1 className="font-serif text-4xl leading-[1.1] font-semibold text-ink sm:text-5xl">
                {t.heroTitle}
                <br />
                <span className="text-primary">{t.heroTitleEmphasis}</span>
              </h1>
              <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-ink-soft">
                {t.heroSubtitle}
              </p>

              <form
                action="/produits"
                method="GET"
                className="mt-8 flex flex-col gap-3 rounded-2xl border border-line bg-paper p-3 shadow-sm sm:flex-row sm:items-end"
              >
                <div className="flex-1">
                  <label
                    htmlFor="hero-search-q"
                    className="block px-2 pt-1 text-xs font-medium text-ink-soft"
                  >
                    {t.searchWhatLabel}
                  </label>
                  <input
                    id="hero-search-q"
                    name="q"
                    type="text"
                    placeholder={t.searchWhatPlaceholder}
                    className="w-full rounded-xl px-2 py-1.5 text-sm text-ink outline-none placeholder:text-ink-soft/60"
                  />
                </div>
                <div className="flex-1 border-line sm:border-l sm:pl-3">
                  <label
                    htmlFor="hero-search-wilaya"
                    className="block px-2 pt-1 text-xs font-medium text-ink-soft"
                  >
                    {t.searchWhereLabel}
                  </label>
                  <input
                    id="hero-search-wilaya"
                    name="wilaya"
                    type="text"
                    placeholder={t.searchWherePlaceholder}
                    className="w-full rounded-xl px-2 py-1.5 text-sm text-ink outline-none placeholder:text-ink-soft/60"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                >
                  {t.searchButton}
                </button>
              </form>
            </div>

            <div className="relative hidden aspect-[4/3.2] lg:block">
              <div className="absolute top-0 right-4 w-64 rotate-[3deg] rounded-2xl border border-line bg-paper p-3 shadow-md">
                <div className="aspect-[4/3] rounded-xl bg-[#F5E9E3]" />
                <span className="absolute -top-2.5 -left-2.5 rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm">
                  {t.heroCardBadge}
                </span>
                <p className="mt-2 text-sm font-semibold text-ink">
                  {t.heroCard1Title}
                </p>
                <p className="text-xs text-ink-soft">
                  {t.heroCard1Vendor} · {t.heroCard1Meta}
                </p>
              </div>
              <div className="absolute bottom-0 left-2 w-60 -rotate-[4deg] rounded-2xl border border-line bg-paper p-3 shadow-md">
                <div className="aspect-[4/3] rounded-xl bg-[#EDEEE3]" />
                <p className="mt-2 text-sm font-semibold text-ink">
                  {t.heroCard2Title}
                </p>
                <p className="text-xs text-ink-soft">
                  {t.heroCard2Vendor} · {t.heroCard2Meta}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories + Offres (avec négociation) */}
        <OffersSection
          categories={categories}
          labels={offersLabels}
          modalLabels={modalLabels}
        />

        {/* Mise en avant des créateurs */}
        <section className="py-16">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-2">
            <div>
              <span className="mb-1.5 block font-mono text-[11px] font-medium tracking-wide text-primary uppercase">
                {t.creatorsEyebrow}
              </span>
              <h2 className="font-serif text-3xl font-semibold text-ink">
                {t.creatorsTitle}
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
                {t.creatorsText}
              </p>
            </div>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {advantages.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2.5 rounded-xl border border-line bg-paper p-4"
                >
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span className="text-sm text-ink">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Comment ça marche */}
        <section
          id="comment-ca-marche"
          className="scroll-mt-[6rem] border-y border-line bg-bg-alt py-16"
        >
          <div className="mx-auto max-w-6xl px-6">
            <span className="mb-1.5 block font-mono text-[11px] font-medium tracking-wide text-primary uppercase">
              {t.howLabel}
            </span>
            <h2 className="font-serif text-3xl font-semibold text-ink">
              {t.howTitle}
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {steps.map((step, i) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-line bg-paper p-6"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary-dark">
                    {i + 1}
                  </span>
                  <step.icon
                    size={20}
                    strokeWidth={1.6}
                    className="mt-4 text-primary"
                    aria-hidden="true"
                  />
                  <h3 className="mt-2 text-[15px] font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA vendeurs */}
        <section className="bg-primary py-16">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-6 text-center">
            <BadgeCheck
              size={28}
              strokeWidth={1.5}
              className="text-white/80"
              aria-hidden="true"
            />
            <h2 className="font-serif text-3xl font-semibold text-white">
              {t.sellerCtaTitle}
            </h2>
            <p className="max-w-md text-[15px] leading-relaxed text-white/85">
              {t.sellerCtaText}
            </p>
            <Link
              href="/pro"
              className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-primary-dark shadow-sm transition-colors hover:bg-white/90"
            >
              {t.sellerCtaButton}
            </Link>
            <p className="text-xs text-white/70">{t.sellerCtaHint}</p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
