import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOutAction, setLocaleAction } from "@/app/actions";
import { getLocale, type Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

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

  const displayName =
    (user?.user_metadata?.name as string | undefined) ?? user?.email;

  let isAdmin = false;
  if (user) {
    const { data: seller } = await supabase
      .from("sellers")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();
    isAdmin = seller?.is_admin ?? false;
  }

  return (
    <>
      <div className="bg-ink text-[13px] text-[#EFE9DA]">
        <div className="mx-auto flex h-[34px] max-w-6xl items-center justify-between px-6">
          <div className="flex gap-5">
            <span className="cursor-pointer opacity-100">
              {t.location}{" "}
              <em className="text-xs opacity-60 underline decoration-1 underline-offset-2 not-italic">
                · {t.change}
              </em>
            </span>
            <span className="hidden opacity-85 sm:inline">
              {t.assistance}
            </span>
            <span className="hidden opacity-85 sm:inline">{t.pro}</span>
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

      <header className="sticky top-0 z-10 bg-paper">
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

            <nav className="hidden shrink-0 gap-6 text-[14.5px] font-medium sm:flex">
              <Link
                href="/#rayons"
                className="border-b-2 border-transparent py-1.5 hover:border-accent"
              >
                {t.rayons}
              </Link>
              <Link
                href="/#artisanat"
                className="border-b-2 border-transparent py-1.5 hover:border-accent"
              >
                {t.artisanat}
              </Link>
              <Link
                href="/#dressing"
                className="border-b-2 border-transparent py-1.5 hover:border-accent"
              >
                {t.dressing}
              </Link>
              <Link
                href="/produits"
                className="border-b-2 border-transparent py-1.5 hover:border-accent"
              >
                {t.annonces}
              </Link>
              <Link
                href="/#confiance"
                className="border-b-2 border-transparent py-1.5 hover:border-accent"
              >
                {t.confiance}
              </Link>
              {user && (
                <>
                  <Link
                    href="/mes-offres"
                    className="border-b-2 border-transparent py-1.5 hover:border-accent"
                  >
                    {t.offresEnvoyees}
                  </Link>
                  <Link
                    href="/offres"
                    className="border-b-2 border-transparent py-1.5 hover:border-accent"
                  >
                    {t.offresRecues}
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="border-b-2 border-transparent py-1.5 hover:border-accent"
                >
                  {t.moderation}
                </Link>
              )}
            </nav>

            <div className="ml-auto flex shrink-0 items-center gap-3.5">
              {user ? (
                <>
                  <Link
                    href="/profil"
                    className="hidden text-sm font-medium text-ink-soft hover:text-ink sm:inline"
                  >
                    {t.bonjour} {displayName}
                  </Link>
                  <form action={signOutAction}>
                    <button
                      type="submit"
                      className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold transition-colors hover:border-ink"
                    >
                      {t.deconnexion}
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href="/connexion"
                  className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold transition-colors hover:border-ink"
                >
                  {t.connexion}
                </Link>
              )}
              <Link
                href="/publier"
                className="rounded-full border border-accent bg-accent px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-accent-dark hover:border-accent-dark"
              >
                {t.deposer}
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
