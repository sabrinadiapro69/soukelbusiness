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
    { href: "/produits", label: t.explorer },
    { href: "/#offres", label: t.createurs },
    { href: "/#comment-ca-marche", label: t.commentCaMarche },
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

      <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center gap-8 px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <svg
              viewBox="0 0 100 100"
              className="h-10 w-10 shrink-0"
              aria-hidden="true"
            >
              <circle cx="50" cy="50" r="48" fill="var(--accent)" />
              <text
                x="50"
                y="65"
                textAnchor="middle"
                fontFamily="var(--font-serif)"
                fontSize="44"
                fontWeight="600"
                fill="#ffffff"
              >
                S
              </text>
            </svg>
            <span className="font-serif text-lg font-semibold tracking-tight text-ink">
              Souk El Business
            </span>
          </Link>

          <nav className="hidden shrink-0 items-center gap-7 text-[14.5px] font-medium text-ink-soft lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden shrink-0 items-center gap-4 lg:flex">
            {user ? (
              <ProfileMenu
                displayName={displayName}
                accountLinks={accountLinks}
                profilLabel={t.profil}
                bonjourLabel={t.bonjour}
                deconnexionLabel={t.deconnexion}
              />
            ) : (
              <Link
                href="/connexion"
                className="text-[14.5px] font-medium text-ink-soft transition-colors hover:text-ink"
              >
                {t.connexion}
              </Link>
            )}
            <Link
              href="/pro"
              className="rounded-full bg-primary px-5 py-2.5 text-[14.5px] font-semibold whitespace-nowrap text-white shadow-sm transition-colors hover:bg-primary-dark"
            >
              {t.ouvrirMaBoutique}
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
              deposerLabel={t.ouvrirMaBoutique}
            />
          </div>
        </div>
      </header>
    </>
  );
}
