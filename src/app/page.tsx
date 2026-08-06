import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ListingsPreviewGrid from "@/components/ListingsPreviewGrid";
import DonsScroll from "@/components/DonsScroll";
import {
  getDonListings,
  getListings,
  getPortfolioPhotoUrl,
  getTopTalents,
} from "@/lib/queries";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const dynamic = "force-dynamic";

const rayonIcons = [
  <path key="0" d="M5 17h14M5 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm14 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM3 17V9l2-5h10l3 5h1a2 2 0 0 1 2 2v6" />,
  <path key="1" d="M3 11 12 3l9 8M5 10v10h14V10" />,
  <g key="2"><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M11 18h2" /></g>,
  <path key="3" d="M16 4v2a4 4 0 0 1-8 0V4M8 4H5l-2 4 3 2v10h12V10l3-2-2-4h-3" />,
  <g key="4"><path d="M9 3h4l1 4-3 10h-2L6 7l3-4Z" /><path d="M10 3V1h2v2" /></g>,
  <path key="5" d="M4 20V10l8-6 8 6v10M9 20v-6h6v6" />,
  <g key="6"><path d="M20 6 9 17l-5-5" /><rect x="3" y="3" width="18" height="18" rx="4" /></g>,
  <g key="7"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></g>,
  <path key="8" d="M11 4c1 2-1 3-1 5a2 2 0 0 0 4 0M8 9C5 9 3 12 3 15c0 3 2 6 9 6s9-3 9-6c0-3-2-6-5-6" />,
];

const metierIcons = [
  <path key="0" d="M6 3h12l-2 6H8L6 3Zm2 6-3 12h14L16 9M12 9v12" />,
  <path key="1" d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6" />,
  <path key="2" d="M14 7a4 4 0 1 0-6 3.5V21h4v-6h2v6h4V10.5A4 4 0 0 0 14 7Z" />,
  <path key="3" d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z" />,
  <g key="4"><path d="M4 20 20 4M4 20 8 8l4 4-4 8Z" /><circle cx="17" cy="7" r="2" /></g>,
  <g key="5"><circle cx="7" cy="17" r="3" /><circle cx="17" cy="17" r="3" /><path d="M10 17h4l3-6h-8l-2 4" /></g>,
  <g key="6"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></g>,
  <path key="7" d="M6 8h12l-1 12H7L6 8Zm2-4h8l1 4H7l1-4Z" />,
];

type Thumb = { type: "emoji" | "photo"; value: string };

const talentColors = ["bg-primary", "bg-accent", "bg-gold", "bg-primary-dark"];

export default async function Home() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const t = dict.home;

  const realTalents = await getTopTalents(4).catch(() => []);
  const talents = realTalents.map((talent, i) => ({
    key: talent.seller.id,
    href: `/vendeurs/${talent.seller.id}`,
    name: talent.seller.name,
    metier: `${talent.pro_profile.metier || "Professionnel"} · ${talent.seller.city}`,
    rating: talent.seller.rating.toFixed(1),
    reviews: talent.reviewsCount,
    color: talentColors[i % talentColors.length],
    thumbs: (talent.portfolio.length > 0
      ? talent.portfolio
          .slice(0, 3)
          .map((p): Thumb => ({
            type: "photo",
            value: getPortfolioPhotoUrl(p.photos[0]),
          }))
      : [{ type: "emoji", value: "🛠️" } as Thumb]
    ),
  }));

  const allListings = await getListings().catch(() => []);
  const recentListings = allListings.slice(0, 8);
  const dressingListings = allListings
    .filter((l) => l.category === "Dressing")
    .slice(0, 8);
  const donListings = await getDonListings(12).catch(() => []);

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      {/* Bandeau diaspora */}
      <div className="border-b border-line bg-dawn-soft px-6 py-2.5 text-center text-[13px] text-dawn-dark">
        {t.diasporaBanner}
      </div>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-line bg-bg py-16">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-dawn-soft px-3.5 py-1.5 text-[12.5px] font-semibold text-dawn-dark">
              <span className="h-1.5 w-1.5 rounded-full bg-dawn-dark" />
              {t.badge}
            </span>
            <h1 className="font-serif text-4xl leading-tight font-bold tracking-tight sm:text-5xl">
              {t.heroTitle}{" "}
              <em className="text-primary not-italic font-medium italic">
                {t.heroTitleEmphasis}
              </em>
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-ink-soft">
              {t.heroSubtitle}
            </p>

            <form
              action="/produits"
              method="GET"
              className="mx-auto mt-8 flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border-[1.5px] border-ink bg-paper shadow-[4px_4px_0_var(--ink)] sm:flex-row"
            >
              <select
                name="categorie"
                defaultValue={t.searchAllCategories}
                className="w-full border-b border-line px-4 py-4 text-[15px] text-ink-soft outline-none sm:w-auto sm:border-r sm:border-b-0"
              >
                <option>{t.searchAllCategories}</option>
                {t.rayons.slice(0, 4).map((r) => (
                  <option key={r.title}>{r.title}</option>
                ))}
              </select>
              <input
                type="text"
                name="q"
                placeholder={t.searchPlaceholder}
                className="w-full min-w-0 flex-1 px-4 py-4 text-[15px] outline-none placeholder:text-[#9C9587]"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-primary px-7 py-4 font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                {t.searchButton}
              </button>
            </form>

            <div className="mt-[18px] flex flex-wrap items-center justify-center gap-2.5">
              <span className="mr-1 text-[13px] text-ink-soft">
                {t.popularSearches}
              </span>
              {t.popularChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-line bg-paper px-3.5 py-1.5 text-[13px] text-ink-soft"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Artisanat & Les Talentueux */}
        <section id="artisanat" className="scroll-mt-[7.5rem] py-12">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-6">
              <span className="mb-1.5 block font-mono text-[11.5px] tracking-wide text-dawn-dark uppercase">
                {t.artisanatLabel}
              </span>
              <h2 className="font-serif text-2xl font-semibold">
                {t.artisanatTitle}
              </h2>
              <p className="mt-1 max-w-md text-sm text-ink-soft">
                {t.artisanatSubtitle}
              </p>
            </div>

            <div className="mb-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {t.metiers.map((m, i) => (
                <div
                  key={m.title}
                  className="rounded-2xl border border-line bg-paper px-[18px] py-[22px] text-center transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-full bg-bg-alt">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-[26px] w-[26px] text-primary-dark">
                      {metierIcons[i]}
                    </svg>
                  </div>
                  <h4 className="mb-1 text-[14.5px] font-semibold">
                    {m.title}
                  </h4>
                  <p className="text-xs leading-snug text-ink-soft">
                    {m.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-2 mb-[18px] flex items-end justify-between">
              <h3 className="font-serif text-[19px] font-semibold">
                {t.talentsTitle}
              </h3>
              {talents.length > 0 && (
                <Link
                  href="/produits"
                  className="border-b-[1.5px] border-primary pb-0.5 text-[13.5px] font-semibold text-primary"
                >
                  {t.talentsSeeAll}
                </Link>
              )}
            </div>

            {talents.length > 0 ? (
              <div className="mb-7 flex gap-4 overflow-x-auto pb-2.5">
                {talents.map((talent) => (
                  <div
                    key={talent.key}
                    className="relative w-[240px] shrink-0 rounded-2xl border border-line bg-paper p-[18px]"
                  >
                    <span className="absolute top-3.5 right-3.5 flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold text-[#3A2C05]">
                      {t.talentsBadge}
                    </span>
                    <div className="mb-3.5 flex items-center gap-2.5">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-serif text-base font-bold text-white ${talent.color}`}
                      >
                        {talent.name[0]}
                      </div>
                      <div>
                        <h4 className="text-[14.5px] font-semibold">
                          {talent.name}
                        </h4>
                        <span className="text-xs text-ink-soft">
                          {talent.metier}
                        </span>
                      </div>
                    </div>
                    <div className="mb-3 font-mono text-[12.5px] font-semibold text-accent-dark">
                      {talent.rating} ★{" "}
                      <span className="font-sans font-normal text-ink-soft">
                        ({talent.reviews} {t.talentsReviews})
                      </span>
                    </div>
                    <div className="mb-3.5 grid grid-cols-3 gap-1.5">
                      {talent.thumbs.map((thumb, i) => (
                        <div
                          key={i}
                          className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-bg-alt text-lg"
                        >
                          {thumb.type === "photo" ? (
                            <img
                              src={thumb.value}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            thumb.value
                          )}
                        </div>
                      ))}
                    </div>
                    <Link
                      href={talent.href}
                      className="block w-full rounded-full border border-line py-2.5 text-center text-[13px] font-semibold transition-colors hover:border-ink"
                    >
                      {t.talentsSeeProfile}
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mb-7 rounded-xl border border-dashed border-line bg-paper px-4 py-6 text-center text-sm text-ink-soft">
                {t.talentsEmpty}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-ink px-[30px] py-[26px]">
              <div>
                <h3 className="mb-1 font-serif text-[19px] font-semibold text-bg">
                  {t.talentsCtaTitle}
                </h3>
                <p className="text-[13px] text-[#C6CDC6]">
                  {t.talentsCtaText}
                </p>
              </div>
              <Link
                href="/publier"
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-accent-dark"
              >
                {t.talentsCtaButton}
              </Link>
            </div>
          </div>
        </section>

        {/* Dons */}
        <section className="border-b border-line bg-bg-alt py-10">
          <div className="mx-auto max-w-6xl px-6">
            <span className="mb-1.5 flex items-center gap-1.5 font-mono text-[11.5px] tracking-wide text-dawn-dark uppercase">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-4 w-4 shrink-0"
              >
                <rect x="4" y="8" width="16" height="4" rx="1" />
                <rect x="5" y="12" width="14" height="8" rx="1" />
                <path d="M12 8v12" />
                <path d="M12 8c-1.7 0-3-1.1-3-2.5S10.3 3 12 4c1.7-1 3 .1 3 1.5S13.7 8 12 8Z" />
              </svg>
              {t.donsLabel}
            </span>
            <h2 className="mb-4 font-serif text-2xl font-semibold">
              {t.donsTitle}
            </h2>
            <DonsScroll
              listings={donListings}
              donLabel={dict.produit.don}
              emptyLabel={t.donsEmpty}
            />
          </div>
        </section>

        {/* Rayons */}
        <section id="rayons" className="scroll-mt-[7.5rem] py-12">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-6">
              <span className="mb-1.5 block font-mono text-[11.5px] tracking-wide text-dawn-dark uppercase">
                {t.rayonsLabel}
              </span>
              <h2 className="font-serif text-2xl font-semibold">
                {t.rayonsTitle}
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
              {t.rayons.map((r, i) => (
                <div
                  key={r.title}
                  className="flex cursor-pointer flex-col gap-2.5 rounded-xl border border-line bg-paper p-5 transition-transform hover:-translate-y-1 hover:border-ink"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="h-9 w-9 text-primary"
                  >
                    {rayonIcons[i]}
                  </svg>
                  <h3 className="text-[15px] font-semibold">{r.title}</h3>
                  <span className="text-xs text-ink-soft">{r.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dressing */}
        <section id="dressing" className="scroll-mt-[7.5rem] bg-bg-alt py-12">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <span className="mb-1.5 block font-mono text-[11.5px] tracking-wide text-dawn-dark uppercase">
                  {t.dressingLabel}
                </span>
                <h2 className="font-serif text-2xl font-semibold">
                  {t.dressingTitle}
                </h2>
                <p className="mt-1 max-w-md text-sm text-ink-soft">
                  {t.dressingSubtitle}
                </p>
              </div>
            </div>
            <ListingsPreviewGrid
              listings={dressingListings}
              emptyLabel={t.dressingEmpty}
              donLabel={dict.produit.don}
            />
          </div>
        </section>

        {/* Annonces récentes */}
        <section id="annonces" className="scroll-mt-[7.5rem] py-12">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <span className="mb-1.5 block font-mono text-[11.5px] tracking-wide text-dawn-dark uppercase">
                  {t.annoncesLabel}
                </span>
                <h2 className="font-serif text-2xl font-semibold">
                  {t.annoncesTitle}
                </h2>
              </div>
              <Link
                href="/produits"
                className="shrink-0 border-b-[1.5px] border-primary pb-0.5 text-[13.5px] font-semibold text-primary"
              >
                {t.annoncesSeeAll}
              </Link>
            </div>
            <ListingsPreviewGrid
              listings={recentListings}
              emptyLabel={t.annoncesEmpty}
              donLabel={dict.produit.don}
            />
          </div>
        </section>

        {/* Confiance */}
        <section id="confiance" className="scroll-mt-[7.5rem] bg-bg-alt py-12">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-6">
              <span className="mb-1.5 block font-mono text-[11.5px] tracking-wide text-dawn-dark uppercase">
                {t.confianceLabel}
              </span>
              <h2 className="font-serif text-2xl font-semibold">
                {t.confianceTitle}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-3">
              <div className="rounded-xl border border-line bg-paper p-[26px]">
                <div className="mb-3.5 flex h-11 w-11 items-center justify-center rounded-full bg-bg-alt">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="h-5 w-5 text-accent"
                  >
                    <path d="M12 3 5 6v5c0 5 3 8.5 7 10 4-1.5 7-5 7-10V6l-7-3Z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="mb-2 text-[16.5px] font-semibold">
                  {t.trust1Title}
                </h3>
                <p className="text-[13.5px] leading-relaxed text-ink-soft">
                  {t.trust1Text}
                </p>
              </div>
              <div className="rounded-xl border border-line bg-paper p-[26px]">
                <div className="mb-3.5 flex h-11 w-11 items-center justify-center rounded-full bg-bg-alt">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="h-5 w-5 text-accent"
                  >
                    <path d="M12 21s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13Z" />
                    <path d="M9.5 8.5l2 2 3-3" />
                  </svg>
                </div>
                <h3 className="mb-2 text-[16.5px] font-semibold">
                  {t.trust2Title}
                </h3>
                <p className="text-[13.5px] leading-relaxed text-ink-soft">
                  {t.trust2Text}
                </p>
              </div>
              <div className="rounded-xl border border-line bg-paper p-[26px]">
                <div className="mb-3.5 flex h-11 w-11 items-center justify-center rounded-full bg-bg-alt">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="h-5 w-5 text-accent"
                  >
                    <path d="M4 5h16v11H9l-4 4V5Z" />
                    <path d="M8 9.5h8M8 12.5h5" />
                  </svg>
                </div>
                <h3 className="mb-2 text-[16.5px] font-semibold">
                  {t.trust3Title}
                </h3>
                <p className="text-[13.5px] leading-relaxed text-ink-soft">
                  {t.trust3Text}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA vendeur */}
        <section className="py-12">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-wrap items-center justify-between gap-6 rounded-[20px] bg-ink px-[46px] py-11">
              <div>
                <h2 className="max-w-md font-serif text-2xl leading-snug font-semibold text-bg">
                  {t.ctaTitle}
                </h2>
                <p className="mt-2.5 text-sm text-[#C6CDC6]">{t.ctaText}</p>
              </div>
              <Link
                href="/publier"
                className="rounded-full bg-accent px-[26px] py-3.5 text-[14.5px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-accent-dark"
              >
                {t.ctaButton}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
