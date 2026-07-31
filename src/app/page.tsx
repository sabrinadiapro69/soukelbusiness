import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DressingScroll from "@/components/DressingScroll";
import AnnoncesFilter from "@/components/AnnoncesFilter";

const rayons = [
  {
    title: "Véhicules",
    desc: "Voitures, motos, pièces",
    icon: (
      <path d="M5 17h14M5 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm14 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM3 17V9l2-5h10l3 5h1a2 2 0 0 1 2 2v6" />
    ),
  },
  {
    title: "Immobilier",
    desc: "Location, vente, terrains",
    icon: <path d="M3 11 12 3l9 8M5 10v10h14V10" />,
  },
  {
    title: "Multimédia",
    desc: "Téléphones, PC, TV",
    icon: <><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M11 18h2" /></>,
  },
  {
    title: "Dressing",
    desc: "Mode, vêtements, accessoires",
    icon: <path d="M16 4v2a4 4 0 0 1-8 0V4M8 4H5l-2 4 3 2v10h12V10l3-2-2-4h-3" />,
  },
  {
    title: "Maison & Jardin",
    desc: "Meubles, électroménager",
    icon: <path d="M4 20V10l8-6 8 6v10M9 20v-6h6v6" />,
  },
  {
    title: "Emploi",
    desc: "Offres, CV, freelance",
    icon: <><path d="M20 6 9 17l-5-5" /><rect x="3" y="3" width="18" height="18" rx="4" /></>,
  },
  {
    title: "Services",
    desc: "Cours, artisanat, événements",
    icon: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>,
  },
  {
    title: "Animaux",
    desc: "Chiens, chats, volaille",
    icon: (
      <path d="M11 4c1 2-1 3-1 5a2 2 0 0 0 4 0M8 9C5 9 3 12 3 15c0 3 2 6 9 6s9-3 9-6c0-3-2-6-5-6" />
    ),
  },
];

const metiers = [
  {
    title: "Couture & Retouches",
    desc: "Sur mesure, retouches, tenues traditionnelles",
    count: "240+ artisans",
    icon: <path d="M6 3h12l-2 6H8L6 3Zm2 6-3 12h14L16 9M12 9v12" />,
  },
  {
    title: "Bâtiment & Travaux",
    desc: "Maçonnerie, peinture, carrelage, rénovation",
    count: "410+ artisans",
    icon: <path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6" />,
  },
  {
    title: "Plomberie",
    desc: "Installation, fuite, dépannage rapide",
    count: "180+ artisans",
    icon: <path d="M14 7a4 4 0 1 0-6 3.5V21h4v-6h2v6h4V10.5A4 4 0 0 0 14 7Z" />,
  },
  {
    title: "Électricité",
    desc: "Installation, mise aux normes, dépannage",
    count: "205+ artisans",
    icon: <path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z" />,
  },
  {
    title: "Menuiserie",
    desc: "Meubles, portes, agencement sur mesure",
    count: "150+ artisans",
    icon: <><path d="M4 20 20 4M4 20 8 8l4 4-4 8Z" /><circle cx="17" cy="7" r="2" /></>,
  },
  {
    title: "Mécanique auto",
    desc: "Réparation, entretien, diagnostic",
    count: "320+ artisans",
    icon: <><circle cx="7" cy="17" r="3" /><circle cx="17" cy="17" r="3" /><path d="M10 17h4l3-6h-8l-2 4" /></>,
  },
  {
    title: "Coiffure & Beauté",
    desc: "À domicile ou en salon, hommes et femmes",
    count: "290+ artisans",
    icon: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>,
  },
  {
    title: "Traiteur & Pâtisserie",
    desc: "Événements, plats traditionnels, gâteaux",
    count: "175+ artisans",
    icon: <path d="M6 8h12l-1 12H7L6 8Zm2-4h8l1 4H7l1-4Z" />,
  },
];

const talents = [
  {
    name: "Amine K.",
    metier: "Plombier · Alger",
    rating: "4.9",
    reviews: 86,
    badge: true,
    color: "bg-primary",
    icon: <path d="M14 7a4 4 0 1 0-6 3.5V21h4v-6h2v6h4V10.5A4 4 0 0 0 14 7Z" />,
  },
  {
    name: "Lynda B.",
    metier: "Couturière · Oran",
    rating: "5.0",
    reviews: 112,
    badge: true,
    color: "bg-accent",
    icon: <path d="M6 3h12l-2 6H8L6 3Zm2 6-3 12h14L16 9M12 9v12" />,
  },
  {
    name: "Sofiane R.",
    metier: "Maçon · Constantine",
    rating: "4.8",
    reviews: 64,
    badge: true,
    color: "bg-gold",
    icon: <path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6" />,
  },
  {
    name: "Hakim M.",
    metier: "Électricien · Béjaïa",
    rating: "4.6",
    reviews: 29,
    badge: false,
    color: "bg-primary-dark",
    icon: <path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z" />,
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-line bg-bg py-16">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-dawn-soft px-3.5 py-1.5 text-[12.5px] font-semibold text-dawn-dark">
                <span className="h-1.5 w-1.5 rounded-full bg-dawn-dark" />
                Nouveau en Algérie
              </span>
              <h1 className="max-w-xl font-serif text-4xl leading-tight font-bold tracking-tight sm:text-5xl">
                Le souk algérien,{" "}
                <em className="text-primary not-italic font-medium italic">
                  version moderne.
                </em>
              </h1>
              <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">
                Achetez et vendez près de chez vous : véhicules, immobilier,
                mode, électronique. Simple à utiliser, clair à lire, fait
                pour les 58 wilayas.
              </p>

              <form className="mt-8 flex max-w-lg overflow-hidden rounded-2xl border-[1.5px] border-ink bg-paper shadow-[4px_4px_0_var(--ink)]">
                <select className="border-r border-line px-4 py-4 text-[15px] text-ink-soft outline-none">
                  <option>Toutes catégories</option>
                  <option>Véhicules</option>
                  <option>Immobilier</option>
                  <option>Dressing</option>
                  <option>Multimédia</option>
                </select>
                <input
                  type="text"
                  placeholder="Que cherchez-vous ?"
                  className="min-w-0 flex-1 px-4 py-4 text-[15px] outline-none placeholder:text-[#9C9587]"
                />
                <button
                  type="button"
                  className="flex items-center gap-2 bg-primary px-7 font-semibold text-white transition-colors hover:bg-primary-dark"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  Rechercher
                </button>
              </form>

              <div className="mt-[18px] flex flex-wrap items-center gap-2.5">
                <span className="mr-1 text-[13px] text-ink-soft">
                  Recherches populaires :
                </span>
                {["iPhone 13", "Renault Clio 4", "Appartement F3 Alger", "Robe soirée"].map(
                  (chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-line bg-paper px-3.5 py-1.5 text-[13px] text-ink-soft"
                    >
                      {chip}
                    </span>
                  )
                )}
              </div>

              <div className="mt-8 flex flex-wrap gap-8">
                <div className="flex items-center gap-2 text-[12.5px] text-ink-soft">
                  <b className="font-mono text-[13px] text-ink">1,2M</b>
                  annonces actives
                </div>
                <div className="flex items-center gap-2 text-[12.5px] text-ink-soft">
                  <b className="font-mono text-[13px] text-ink">58</b>
                  wilayas couvertes
                </div>
                <div className="flex items-center gap-2 text-[12.5px] text-ink-soft">
                  <b className="font-mono text-[13px] text-ink">340K</b>
                  vendeurs vérifiés
                </div>
              </div>
            </div>

            <div className="relative hidden items-center justify-center lg:flex">
              <div className="absolute -top-3.5 -left-[18px] z-10 flex -rotate-3 items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-lg">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Vendeur vérifié
              </div>
              <div className="w-full max-w-[320px] rotate-[2deg] rounded-[20px] border border-line bg-paper p-[22px] shadow-xl">
                <div className="mb-3.5 flex aspect-[4/3] items-center justify-center rounded-xl bg-gradient-to-br from-bg-alt to-[#EDE0C4]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-[34%] text-primary-dark opacity-40">
                    <path d="M3 11 12 3l9 8M5 10v10h14V10" />
                  </svg>
                </div>
                <h4 className="mb-1.5 text-[14.5px] font-semibold">
                  Appartement F3, vue dégagée
                </h4>
                <span className="font-mono text-[15px] font-semibold text-accent-dark">
                  45 000 DA/mois
                </span>
              </div>
              <div className="absolute -right-3.5 -bottom-4 z-10 flex items-center gap-2 rounded-xl border border-line bg-paper px-3.5 py-2.5 text-xs font-semibold shadow-lg">
                <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                  A
                </span>
                Contacté par 12 personnes
              </div>
            </div>
          </div>
        </section>

        {/* Rayons */}
        <section id="rayons" className="py-12">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-6">
              <span className="mb-1.5 block font-mono text-[11.5px] tracking-wide text-dawn-dark uppercase">
                Explorer
              </span>
              <h2 className="font-serif text-2xl font-semibold">
                Les rayons du souk
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
              {rayons.map((r) => (
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
                    {r.icon}
                  </svg>
                  <h3 className="text-[15px] font-semibold">{r.title}</h3>
                  <span className="text-xs text-ink-soft">{r.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Artisanat & Les Talentueux */}
        <section id="artisanat" className="py-12">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-6">
              <span className="mb-1.5 block font-mono text-[11.5px] tracking-wide text-dawn-dark uppercase">
                Savoir-faire local
              </span>
              <h2 className="font-serif text-2xl font-semibold">
                Artisanat &amp; Métiers
              </h2>
              <p className="mt-1 max-w-md text-sm text-ink-soft">
                Découvrez <strong>Les Talentueux</strong>, des professionnels
                vérifiés avec portfolio et avis clients, près de chez vous.
              </p>
            </div>

            <div className="mb-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {metiers.map((m) => (
                <div
                  key={m.title}
                  className="rounded-2xl border border-line bg-paper px-[18px] py-[22px] text-center transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-full bg-bg-alt">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-[26px] w-[26px] text-primary-dark">
                      {m.icon}
                    </svg>
                  </div>
                  <h4 className="mb-1 text-[14.5px] font-semibold">
                    {m.title}
                  </h4>
                  <p className="mb-2.5 text-xs leading-snug text-ink-soft">
                    {m.desc}
                  </p>
                  <span className="font-mono text-[11px] font-semibold text-accent-dark">
                    {m.count}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-2 mb-[18px] flex items-end justify-between">
              <h3 className="font-serif text-[19px] font-semibold">
                🏅 Les Talentueux du moment
              </h3>
              <Link
                href="#"
                className="border-b-[1.5px] border-primary pb-0.5 text-[13.5px] font-semibold text-primary"
              >
                Tous les profils →
              </Link>
            </div>

            <div className="mb-7 flex gap-4 overflow-x-auto pb-2.5">
              {talents.map((t) => (
                <div
                  key={t.name}
                  className="relative w-[240px] shrink-0 rounded-2xl border border-line bg-paper p-[18px]"
                >
                  {t.badge && (
                    <span className="absolute top-3.5 right-3.5 flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold text-[#3A2C05]">
                      🏅 Talentueux
                    </span>
                  )}
                  <div className="mb-3.5 flex items-center gap-2.5">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-serif text-base font-bold text-white ${t.color}`}
                    >
                      {t.name[0]}
                    </div>
                    <div>
                      <h4 className="text-[14.5px] font-semibold">
                        {t.name}
                      </h4>
                      <span className="text-xs text-ink-soft">
                        {t.metier}
                      </span>
                    </div>
                  </div>
                  <div className="mb-3 font-mono text-[12.5px] font-semibold text-accent-dark">
                    {t.rating} ★{" "}
                    <span className="font-sans font-normal text-ink-soft">
                      ({t.reviews} avis)
                    </span>
                  </div>
                  <div className="mb-3.5 grid grid-cols-3 gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="flex aspect-square items-center justify-center rounded-lg bg-bg-alt"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-[40%] text-primary-dark opacity-35">
                          {t.icon}
                        </svg>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="#"
                    className="block w-full rounded-full border border-line py-2.5 text-center text-[13px] font-semibold transition-colors hover:border-ink"
                  >
                    Voir le profil
                  </Link>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-ink px-[30px] py-[26px]">
              <div>
                <h3 className="mb-1 font-serif text-[19px] font-semibold text-bg">
                  Vous êtes artisan ou professionnel ?
                </h3>
                <p className="text-[13px] text-[#C6CDC6]">
                  Rejoignez Les Talentueux : créez votre profil, montrez
                  votre portfolio, récoltez des avis clients près de chez
                  vous.
                </p>
              </div>
              <Link
                href="/publier"
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-accent-dark"
              >
                Devenir un Talentueux
              </Link>
            </div>
          </div>
        </section>

        {/* Dressing */}
        <section id="dressing" className="bg-bg-alt py-12">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <span className="mb-1.5 block font-mono text-[11.5px] tracking-wide text-dawn-dark uppercase">
                  Nouveau · inspiré du dressing collaboratif
                </span>
                <h2 className="font-serif text-2xl font-semibold">
                  Le Dressing Souk El Business
                </h2>
                <p className="mt-1 max-w-md text-sm text-ink-soft">
                  Vendez et achetez vos vêtements et accessoires entre
                  particuliers : état, taille et marque toujours affichés.
                </p>
              </div>
            </div>
            <DressingScroll />
          </div>
        </section>

        {/* Annonces récentes */}
        <section id="annonces" className="py-12">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <span className="mb-1.5 block font-mono text-[11.5px] tracking-wide text-dawn-dark uppercase">
                  À proximité · Alger
                </span>
                <h2 className="font-serif text-2xl font-semibold">
                  Annonces récentes
                </h2>
              </div>
              <Link
                href="/produits"
                className="shrink-0 border-b-[1.5px] border-primary pb-0.5 text-[13.5px] font-semibold text-primary"
              >
                Voir tout →
              </Link>
            </div>
            <AnnoncesFilter />
          </div>
        </section>

        {/* Confiance */}
        <section id="confiance" className="bg-bg-alt py-12">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-6">
              <span className="mb-1.5 block font-mono text-[11.5px] tracking-wide text-dawn-dark uppercase">
                Pourquoi Souk El Business
              </span>
              <h2 className="font-serif text-2xl font-semibold">
                Fait pour marchander l&apos;esprit tranquille
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-3">
              <div className="rounded-xl border border-line bg-paper p-[26px]">
                <span className="mb-3 block font-mono text-xs font-semibold text-accent">
                  01
                </span>
                <h3 className="mb-2 text-[16.5px] font-semibold">
                  Vendeurs vérifiés
                </h3>
                <p className="text-[13.5px] leading-relaxed text-ink-soft">
                  Chaque profil professionnel passe par une vérification
                  d&apos;identité. Un badge visible sur chaque annonce.
                </p>
              </div>
              <div className="rounded-xl border border-line bg-paper p-[26px]">
                <span className="mb-3 block font-mono text-xs font-semibold text-accent">
                  02
                </span>
                <h3 className="mb-2 text-[16.5px] font-semibold">
                  Rendez-vous encadrés
                </h3>
                <p className="text-[13.5px] leading-relaxed text-ink-soft">
                  Des conseils clairs pour échanger en lieu public et
                  vérifier l&apos;article avant de conclure, à chaque étape.
                </p>
              </div>
              <div className="rounded-xl border border-line bg-paper p-[26px]">
                <span className="mb-3 block font-mono text-xs font-semibold text-accent">
                  03
                </span>
                <h3 className="mb-2 text-[16.5px] font-semibold">
                  Messagerie intégrée
                </h3>
                <p className="text-[13.5px] leading-relaxed text-ink-soft">
                  Discutez et négociez directement dans l&apos;application,
                  en français ou en darija, sans donner votre numéro.
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
                  Un article qui dort chez vous vaut plus qu&apos;un article
                  oublié.
                </h2>
                <p className="mt-2.5 text-sm text-[#C6CDC6]">
                  Déposer une annonce prend moins de deux minutes, sans frais
                  sur les particuliers.
                </p>
              </div>
              <Link
                href="/publier"
                className="rounded-full bg-accent px-[26px] py-3.5 text-[14.5px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-accent-dark"
              >
                Déposer une annonce
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
