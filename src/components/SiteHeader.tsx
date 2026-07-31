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
    <header className="sticky top-0 z-10 border-b border-orange-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-orange-700"
        >
          Souk El Business
        </Link>
        <nav className="hidden gap-8 text-sm font-medium text-stone-600 sm:flex">
          <Link href="/#categories" className="hover:text-orange-700">
            Catégories
          </Link>
          <Link href="/produits" className="hover:text-orange-700">
            Produits
          </Link>
          <Link href="/contact" className="hover:text-orange-700">
            Contact
          </Link>
          {user ? (
            <Link href="/publier" className="hover:text-orange-700">
              Publier une annonce
            </Link>
          ) : (
            <Link href="/#vendre" className="hover:text-orange-700">
              Devenir vendeur
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin" className="hover:text-orange-700">
              Modération
            </Link>
          )}
        </nav>

        {user ? (
          <div className="flex items-center gap-4">
            <Link
              href="/profil"
              className="hidden text-sm text-stone-600 hover:text-orange-700 sm:inline"
            >
              Bonjour {displayName}
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-full border border-orange-600 px-5 py-2 text-sm font-semibold text-orange-700 transition-colors hover:bg-orange-50"
              >
                Se déconnecter
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/connexion"
              className="hidden text-sm font-medium text-stone-600 hover:text-orange-700 sm:inline"
            >
              Connexion
            </Link>
            <Link
              href="/inscription"
              className="rounded-full bg-orange-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
            >
              S&apos;inscrire
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
