import Link from "next/link";

export default function SiteHeader() {
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
          <Link href="/#vendre" className="hover:text-orange-700">
            Devenir vendeur
          </Link>
        </nav>
        <Link
          href="/#vendre"
          className="rounded-full bg-orange-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
        >
          Vendre sur Souk
        </Link>
      </div>
    </header>
  );
}
