import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { setLocaleAction, setWilayaAction } from "@/app/actions";
import { getLocale, type Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getWilayaPref } from "@/lib/wilaya-pref";
import { wilayas } from "@/lib/wilayas";
import MobileMenu from "@/components/MobileMenu";
import ProfileMenu from "@/components/ProfileMenu";
import WilayaSwitcher from "@/components/WilayaSwitcher";

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

  const wilayaPref = await getWilayaPref();
  const locationLabel = wilayaPref ? `📍 ${wilayaPref}` : t.location;

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
            <span className="opacity-100">
              {locationLabel}{" "}
              <WilayaSwitcher
                wilayas={wilayas}
                changeLabel={t.change}
                action={setWilayaAction}
              />
            </span>
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
