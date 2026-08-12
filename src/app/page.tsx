import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DonsScroll from "@/components/DonsScroll";
import {
  getDonListings,
  getPortfolioPhotoUrl,
  getTopTalents,
} from "@/lib/queries";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const dynamic = "force-dynamic";

type Thumb = { type: "emoji" | "photo"; value: string };

// Photo a deposer par la cliente dans /public/univers/ (voir README ou
// message de livraison). Le fond de couleur reste visible tant que le
// fichier n'existe pas encore, et sert de fond pendant le chargement.
const universTiles = [
  {
    key: "evenements",
    className: "bg-[#7C3AED] text-white",
    area: "md:col-span-2 md:row-span-2",
    image: "/univers/evenements.webp",
  },
  {
    key: "decoration",
    className: "bg-[#1F4E8C] text-white",
    area: "",
    image: "/univers/decoration.webp",
  },
  {
    key: "mode",
    className: "bg-[#111111] text-white",
    area: "",
    image: "/univers/mode.webp",
  },
  {
    key: "creation",
    className: "bg-[#E2611A] text-white",
    area: "md:col-span-2",
    image: "/univers/creation.webp",
  },
] as const;

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
            <h1 className="font-serif text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
              {t.heroTitle}{" "}
              <em className="text-accent font-medium italic">
                {t.heroTitleEmphasis}
              </em>
            </h1>
            <p className="sr-only">{t.heroSubtitle}</p>

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
                      {talent.thumbs[0]?.type === "photo" ? (
                        <img
                          src={talent.thumbs[0].value}
                          alt=""
                          className="rounded-avatar h-11 w-11 shrink-0 object-cover"
                        />
                      ) : (
                        <div
                          className={`rounded-avatar flex h-11 w-11 shrink-0 items-center justify-center font-serif text-base font-semibold text-white ${talent.color}`}
                        >
                          {talent.name[0]}
                        </div>
                      )}
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
                          className="rounded-photo flex aspect-square items-center justify-center overflow-hidden border border-line text-lg"
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

        {/* Nos univers : Evenements, Decoration, Mode, Creation */}
        <section id="artisanat" className="scroll-mt-[7.5rem] py-12">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="sr-only">{t.universTitle}</h2>

            <div className="grid grid-cols-2 gap-3 md:auto-rows-[200px] md:grid-cols-4">
              {(
                [
                  {
                    key: "evenements",
                    title: t.universEvenementsTitle,
                    text: t.universEvenementsText,
                  },
                  {
                    key: "decoration",
                    title: t.universDecorationTitle,
                    text: t.universDecorationText,
                  },
                  {
                    key: "mode",
                    title: t.universModeTitle,
                    text: t.universModeText,
                  },
                  {
                    key: "creation",
                    title: t.universCreationTitle,
                    text: t.universCreationText,
                  },
                ] as const
              ).map((univers) => {
                const tile = universTiles.find((u) => u.key === univers.key)!;
                return (
                  <Link
                    key={univers.key}
                    href="#talentueux"
                    role="img"
                    aria-label={univers.text}
                    className={`group relative flex aspect-[3/4] items-end overflow-hidden bg-cover bg-center p-5 md:aspect-auto ${tile.className} ${tile.area}`}
                    style={{ backgroundImage: `url(${tile.image})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent" />
                    <span className="relative font-serif text-2xl font-semibold italic transition-opacity group-hover:opacity-70 sm:text-3xl">
                      {univers.title}
                    </span>
                  </Link>
                );
              })}
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
                <p className="sr-only">{t.trust1Text}</p>
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
                <p className="sr-only">{t.trust2Text}</p>
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
                <p className="sr-only">{t.trust3Text}</p>
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
