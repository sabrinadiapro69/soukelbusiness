import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { setLocaleAction } from "@/app/actions";
import { getLocale, type Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getUserCity } from "@/lib/geolocation";
import MobileMenu from "@/components/MobileMenu";
import ProfileMenu from "@/components/ProfileMenu";

const languageLabels: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
  ar: "العربية",
};

export default async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const t = dict.header;

  const userCity = await getUserCity();
  const locationLabel = `📍 ${userCity ?? t.location}`;

  const displayName =
    (user?.user_metadata?.name as string | undefined) ?? user?.email;

  let isAdmin = false;
  if (user) {
    const { data: seller } = await supabase
      .from("sellers")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    isAdmin = seller?.role === "admin";
  }

  const navLinks = [
    { href: "/#rayons", label: t.rayons },
    { href: "/#artisanat", label: t.artisanat },
    { href: "/#dressing", label: t.dressing },
    { href: "/produits", label: t.annonces },
    { href: "/#confiance", label: t.confiance },
  ];

  const accountLinks = [
    ...(user
      ? [
          { href: "/mes-annonces", label: t.mesAnnonces },
          { href: "/mes-offres", label: t.offresEnvoyees },
          { href: "/offres", label: t.offresRecues },
          { href: "/mes-recherches", label: t.mesRecherches },
        ]
      : []),
    ...(isAdmin ? [{ href: "/admin/dashboard", label: t.moderation }] : []),
  ];

  return (
    <>
      <div className="bg-ink text-[13px] text-[#EFE9DA]">
        <div className="mx-auto flex h-[34px] max-w-6xl items-center justify-between px-6">
          <div className="flex gap-5">
            <span className="opacity-100">{locationLabel}</span>
            <Link
              href="/contact"
              className="hidden opacity-85 hover:opacity-100 sm:inline"
            >
              {t.assistance}
            </Link>
            <Link
              href="/pro"
              className="hidden opacity-85 hover:opacity-100 sm:inline"
            >
              {t.pro}
            </Link>
          </div>
          <div className="flex gap-5">
            {(Object.keys(languageLabels) as Locale[]).map((code) => (
              <form key={code} action={setLocaleAction}>
                <input type="hidden" name="locale" value={code} />
                <button
                  type="submit"
                  className={`cursor-pointer ${
                    locale === code
                      ? "font-semibold opacity-100"
                      : "hidden opacity-55 sm:inline"
                  }`}
                >
                  {languageLabels[code]}
                </button>
              </form>
            ))}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-20 bg-paper">
        <div
          className="h-[3px]"
          style={{
            background:
              "linear-gradient(90deg, var(--primary) 0%, var(--primary) 38%, var(--bg) 38%, var(--bg) 62%, var(--accent) 62%, var(--accent) 100%)",
          }}
        />
        <div className="border-b border-line">
          <div className="mx-auto flex h-[78px] max-w-6xl items-center gap-7 px-6">
            <Link href="/" className="flex shrink-0 items-center gap-2.5">
              <svg
                viewBox="0 0 200 200"
                className="h-16 w-16 shrink-0"
                aria-hidden="true"
              >
                <path
                  d="M 192.0,100.0 Q 197.8,115.5 187.5,128.4 Q 188.2,144.9 174.4,154.1 Q 170.0,170.0 154.1,174.4 Q 144.9,188.2 128.4,187.5 Q 115.5,197.8 100.0,192.0 Q 84.5,197.8 71.6,187.5 Q 55.1,188.2 45.9,174.4 Q 30.0,170.0 25.6,154.1 Q 11.8,144.9 12.5,128.4 Q 2.2,115.5 8.0,100.0 Q 2.2,84.5 12.5,71.6 Q 11.8,55.1 25.6,45.9 Q 30.0,30.0 45.9,25.6 Q 55.1,11.8 71.6,12.5 Q 84.5,2.2 100.0,8.0 Q 115.5,2.2 128.4,12.5 Q 144.9,11.8 154.1,25.6 Q 170.0,30.0 174.4,45.9 Q 188.2,55.1 187.5,71.6 Q 197.8,84.5 192.0,100.0 Z"
                  fill="var(--accent)"
                />
                <circle cx="100" cy="100" r="78" fill="var(--bg)" />
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="1.2"
                />

                <path
                  d="M85 40.5A11 11 0 1 1 71.6 22 8.6 8.6 0 0 0 85 40.5z"
                  fill="var(--primary-dark)"
                />
                <polygon
                  points="105,44 106.7,48.9 111.8,49 107.7,52 109.2,57 105,54.1 100.8,57 102.3,52 98.2,49 103.3,48.9"
                  fill="var(--primary-dark)"
                />

                <text
                  x="100"
                  y="128"
                  textAnchor="middle"
                  fontFamily="var(--font-fraunces), ui-serif, Georgia, serif"
                  fontWeight="700"
                  fontStyle="italic"
                  fontSize="58"
                  fill="var(--accent)"
                >
                  SB
                </text>

                <path id="headerLogoArc" d="M 164,100 A 64,64 0 0 1 36,100" fill="none" />
                <text
                  fontFamily="var(--font-ibm-plex-mono), ui-monospace, monospace"
                  fontWeight="700"
                  fontSize="12"
                  letterSpacing="3"
                  fill="var(--ink)"
                >
                  <textPath href="#headerLogoArc" startOffset="50%" textAnchor="middle">
                    MADE BY A DZ
                  </textPath>
                </text>
              </svg>
              <span className="font-serif text-xl font-bold tracking-tight">
                <span className="text-accent">Souk</span> El Business
              </span>
            </Link>

            <nav className="hidden shrink-0 gap-6 text-[14.5px] font-medium lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="border-b-2 border-transparent py-1.5 hover:border-accent"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="ml-auto hidden shrink-0 items-center gap-3.5 lg:flex">
              {user ? (
                <ProfileMenu
                  displayName={displayName}
                  accountLinks={accountLinks}
                  profilLabel={t.profil}
                  bonjourLabel={t.bonjour}
                  deconnexionLabel={t.deconnexion}
                />
              ) : (
                <>
                  <Link
                    href="/connexion"
                    className="hidden text-sm font-medium text-ink-soft hover:text-ink xl:inline"
                  >
                    {t.connexion}
                  </Link>
                  <Link
                    href="/inscription"
                    className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold transition-colors hover:border-ink"
                  >
                    {t.inscription}
                  </Link>
                </>
              )}
              <Link
                href="/publier"
                className="rounded-full border border-accent bg-accent px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-accent-dark hover:border-accent-dark"
              >
                {t.deposer}
              </Link>
            </div>

            <div className="ml-auto lg:hidden">
              <MobileMenu
                navLinks={[...navLinks, ...accountLinks]}
                isLoggedIn={Boolean(user)}
                displayName={displayName}
                bonjourLabel={t.bonjour}
                deconnexionLabel={t.deconnexion}
                connexionLabel={t.connexion}
                inscriptionLabel={t.inscription}
                deposerLabel={t.deposer}
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
