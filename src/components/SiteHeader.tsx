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
      <div className="border-b border-line text-[13px] text-ink-soft">
        <div className="mx-auto flex h-[34px] max-w-6xl items-center justify-between px-6">
          <div className="flex gap-5">
            <span className="text-ink">{locationLabel}</span>
            <Link
              href="/contact"
              className="hidden hover:text-ink sm:inline"
            >
              {t.assistance}
            </Link>
            <Link href="/pro" className="hidden hover:text-ink sm:inline">
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
                      ? "font-semibold text-ink"
                      : "hidden sm:inline"
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
        <div className="border-b border-line">
          <div className="mx-auto flex h-[78px] max-w-6xl items-center gap-7 px-6">
            <Link href="/" className="group flex shrink-0 items-center gap-2.5">
              <svg
                viewBox="0 0 100 100"
                className="h-11 w-11 shrink-0"
                aria-hidden="true"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="var(--ink)"
                  strokeWidth="1.2"
                />
                <text
                  x="50"
                  y="63"
                  textAnchor="middle"
                  fontFamily="var(--font-serif)"
                  fontSize="46"
                  fontWeight="500"
                  fill="none"
                  stroke="var(--ink)"
                  strokeWidth="1.4"
                >
                  SB
                </text>
              </svg>
              <span className="font-serif text-xl font-semibold tracking-tight">
                <span className="text-accent italic">Souk</span> El Business
              </span>
            </Link>

            <nav className="hidden shrink-0 gap-6 font-mono text-[12px] font-medium tracking-[0.08em] uppercase lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="border-b border-transparent py-1.5 hover:border-accent hover:text-accent"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="ml-auto hidden shrink-0 items-center gap-5 lg:flex">
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
                    className="hidden text-sm text-ink-soft underline decoration-line underline-offset-4 hover:text-ink xl:inline"
                  >
                    {t.connexion}
                  </Link>
                  <Link
                    href="/inscription"
                    className="text-sm text-ink underline decoration-line underline-offset-4 hover:text-accent"
                  >
                    {t.inscription}
                  </Link>
                </>
              )}
              <Link
                href="/publier"
                className="bg-ink px-5 py-2.5 font-mono text-[12px] font-semibold tracking-[0.08em] whitespace-nowrap text-white uppercase transition-colors hover:bg-accent"
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
