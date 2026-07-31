import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/app/actions";

export default async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
              📍 Alger, Alger-Centre{" "}
              <em className="text-xs opacity-60 underline decoration-1 underline-offset-2 not-italic">
                · changer
              </em>
            </span>
            <span className="hidden opacity-85 sm:inline">Assistance</span>
            <span className="hidden opacity-85 sm:inline">
              Souk El Business Pro
            </span>
          </div>
          <div className="flex gap-5">
            <span className="cursor-pointer font-semibold opacity-100">
              FR
            </span>
            <span className="hidden cursor-pointer opacity-55 sm:inline">
              EN
            </span>
            <span className="hidden cursor-pointer opacity-55 sm:inline">
              العربية
            </span>
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
                Rayons
              </Link>
              <Link
                href="/#artisanat"
                className="border-b-2 border-transparent py-1.5 hover:border-accent"
              >
                Artisanat
              </Link>
              <Link
                href="/#dressing"
                className="border-b-2 border-transparent py-1.5 hover:border-accent"
              >
                Dressing
              </Link>
              <Link
                href="/produits"
                className="border-b-2 border-transparent py-1.5 hover:border-accent"
              >
                Annonces
              </Link>
              <Link
                href="/#confiance"
                className="border-b-2 border-transparent py-1.5 hover:border-accent"
              >
                Confiance
              </Link>
              {user && (
                <Link
                  href="/offres"
                  className="border-b-2 border-transparent py-1.5 hover:border-accent"
                >
                  Mes offres
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="border-b-2 border-transparent py-1.5 hover:border-accent"
                >
                  Modération
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
                    Bonjour {displayName}
                  </Link>
                  <form action={signOutAction}>
                    <button
                      type="submit"
                      className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold transition-colors hover:border-ink"
                    >
                      Se déconnecter
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href="/connexion"
                  className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold transition-colors hover:border-ink"
                >
                  Se connecter
                </Link>
              )}
              <Link
                href="/publier"
                className="rounded-full border border-accent bg-accent px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-accent-dark hover:border-accent-dark"
              >
                + Déposer une annonce
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
