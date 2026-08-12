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

type Thumb = { type: "emoji" | "photo"; value: string };

const talentColors = ["bg-primary", "bg-accent", "bg-primary-dark", "bg-accent-dark"];

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

      {/* Bandeau de bienvenue */}
      <div className="border-b border-line bg-dawn-soft px-6 py-2.5 text-center text-[13px] text-dawn-dark">
        {t.welcomeBanner}
      </div>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-line bg-bg py-16">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <span className="mb-5 inline-flex items-center gap-2 border border-line px-3.5 py-1.5 font-mono text-[11.5px] font-medium tracking-wide text-ink uppercase">
              <span className="h-1.5 w-1.5 shrink-0 bg-accent" />
              {t.badge}
            </span>
            <h1 className="font-serif text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
              {t.heroTitle}{" "}
              <em className="text-accent font-medium italic">
                {t.heroTitleEmphasis}
              </em>
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-ink-soft">
              {t.heroSubtitle}
            </p>

            <form
              action="/produits"
              method="GET"
              className="mx-auto mt-8 flex w-full max-w-2xl flex-col border border-ink bg-paper sm:flex-row"
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
                className="flex items-center justify-center gap-2 bg-ink px-7 py-4 font-mono text-[13px] font-semibold tracking-[0.06em] text-white uppercase transition-colors hover:bg-accent"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                {t.searchButton}
              </button>
            </form>

            <p className="mt-[18px] text-[13px] text-ink-soft">
              {t.popularSearches}{" "}
              {t.popularChips.map((chip, i) => (
                <span key={chip}>
                  <Link
                    href={`/produits?q=${encodeURIComponent(chip)}`}
                    className="text-ink underline decoration-line underline-offset-4 hover:text-accent"
                  >
                    {chip}
                  </Link>
                  {i < t.popularChips.length - 1 ? " / " : ""}
                </span>
              ))}
            </p>
          </div>
        </section>

        {/* Talentueux de la semaine */}
        <section id="talentueux" className="scroll-mt-[7.5rem] border-b border-line bg-bg-alt py-12">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="mb-1.5 block font-mono text-[11.5px] tracking-wide text-dawn-dark uppercase">
                  {t.talentsWeekLabel}
                </span>
                <h2 className="font-serif text-2xl font-semibold">
                  {t.talentsTitle}
                </h2>
              </div>
              {talents.length > 0 && (
                <Link
                  href="/produits"
                  className="border-b border-ink pb-0.5 text-[13.5px] font-medium text-ink hover:border-accent hover:text-accent"
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
                    className="relative w-[240px] shrink-0 border border-line bg-paper p-[18px]"
                  >
                    <span className="absolute top-3.5 right-3.5 border border-accent px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-accent uppercase">
                      {t.talentsBadge}
                    </span>
                    <div className="mb-3.5 flex items-center gap-2.5">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center font-serif text-base font-semibold text-white ${talent.color}`}
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
                    <div className="mb-3 font-mono text-[12.5px] font-semibold text-accent">
                      {talent.rating} ★{" "}
                      <span className="font-sans font-normal text-ink-soft">
                        ({talent.reviews} {t.talentsReviews})
                      </span>
                    </div>
                    <div className="mb-3.5 grid grid-cols-3 gap-1.5">
                      {talent.thumbs.map((thumb, i) => (
                        <div
                          key={i}
                          className="flex aspect-square items-center justify-center overflow-hidden border border-line text-lg"
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
                      className="block w-full border border-line py-2.5 text-center text-[13px] font-medium transition-colors hover:border-ink"
                    >
                      {t.talentsSeeProfile}
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mb-7 border border-dashed border-line bg-paper px-4 py-6 text-center text-sm text-ink-soft">
                {t.talentsEmpty}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-6 border-t border-ink pt-6">
              <div>
                <h3 className="mb-1 font-serif text-[19px] font-semibold">
                  {t.talentsCtaTitle}
                </h3>
                <p className="text-[13px] text-ink-soft">
                  {t.talentsCtaText}
                </p>
              </div>
              <Link
                href="/publier"
                className="border-b border-ink pb-0.5 text-sm font-medium whitespace-nowrap text-ink hover:border-accent hover:text-accent"
              >
                {t.talentsCtaButton}
              </Link>
            </div>
          </div>
        </section>

        {/* Nos univers : Evenements, Decoration, Creation, Petites annonces */}
        <section id="artisanat" className="scroll-mt-[7.5rem] py-12">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8 max-w-lg">
              <span className="mb-1.5 block font-mono text-[11.5px] tracking-wide text-ink uppercase">
                {t.universLabel}
              </span>
              <h2 className="font-serif text-2xl font-semibold">
                {t.universTitle}
              </h2>
            </div>

            <div className="border-t border-ink">
              {[
                {
                  title: t.universEvenementsTitle,
                  text: t.universEvenementsText,
                  href: "#talentueux",
                },
                {
                  title: t.universDecorationTitle,
                  text: t.universDecorationText,
                  href: "#talentueux",
                },
                {
                  title: t.universCreationTitle,
                  text: t.universCreationText,
                  href: "#talentueux",
                },
                {
                  title: t.universAnnoncesTitle,
                  text: t.universAnnoncesText,
                  href: "/produits",
                },
              ].map((univers, i) => (
                <div
                  key={univers.title}
                  className={`flex flex-col gap-3 border-b border-line py-7 sm:flex-row sm:items-center sm:gap-10 ${
                    i % 2 === 1 ? "sm:flex-row-reverse sm:text-right" : ""
                  }`}
                >
                  <h3 className="font-serif text-xl font-semibold sm:w-64 sm:shrink-0">
                    {univers.title}
                  </h3>
                  <p className="flex-1 text-sm leading-relaxed text-ink-soft">
                    {univers.text}
                  </p>
                  <Link
                    href={univers.href}
                    className="shrink-0 border-b border-ink pb-0.5 text-[13px] font-medium whitespace-nowrap text-ink hover:border-accent hover:text-accent"
                  >
                    {t.universLinkLabel} →
                  </Link>
                </div>
              ))}
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
                  className="flex cursor-pointer flex-col gap-2.5 border border-line bg-paper p-5 transition-colors hover:border-ink"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="h-9 w-9 text-ink"
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
                className="shrink-0 border-b border-ink pb-0.5 text-[13.5px] font-medium text-ink hover:border-accent hover:text-accent"
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
              <div className="border border-line bg-paper p-[26px]">
                <div className="mb-3.5 flex h-11 w-11 items-center justify-center border border-line">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="h-5 w-5 text-primary"
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
              <div className="border border-line bg-paper p-[26px]">
                <div className="mb-3.5 flex h-11 w-11 items-center justify-center border border-line">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="h-5 w-5 text-primary"
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
              <div className="border border-line bg-paper p-[26px]">
                <div className="mb-3.5 flex h-11 w-11 items-center justify-center border border-line">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="h-5 w-5 text-primary"
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
            <div className="flex flex-wrap items-center justify-between gap-6 border-t-2 border-b-2 border-ink py-8">
              <h2 className="max-w-md font-serif text-2xl leading-snug font-semibold">
                {t.ctaTitle}
              </h2>
              <Link
                href="/publier"
                className="bg-ink px-[26px] py-3.5 font-mono text-[13px] font-semibold tracking-[0.06em] whitespace-nowrap text-white uppercase transition-colors hover:bg-accent"
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
