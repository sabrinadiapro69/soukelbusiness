import Link from "next/link";
import { notFound } from "next/navigation";
import { listings } from "@/data/listings";

export async function generateStaticParams() {
  return listings.map((listing) => ({ id: String(listing.id) }));
}

export default async function ProduitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = listings.find((item) => item.id === Number(id));

  if (!listing) {
    notFound();
  }

  const similarListings = listings
    .filter(
      (item) => item.category === listing.category && item.id !== listing.id
    )
    .slice(0, 3);

  return (
    <div className="flex flex-1 flex-col">
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
            <Link href="/produits" className="text-orange-700">
              Produits
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

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <Link
          href="/produits"
          className="text-sm font-medium text-stone-500 hover:text-orange-700"
        >
          ← Retour aux annonces
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="flex h-80 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 text-8xl">
            {listing.emoji}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl font-bold text-stone-900">
                {listing.title}
              </h1>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                  listing.sellerType === "pro"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-stone-100 text-stone-600"
                }`}
              >
                {listing.sellerType === "pro" ? "Pro" : "Particulier"}
              </span>
            </div>

            <span className="text-3xl font-bold text-orange-700">
              {listing.price} €
            </span>

            <p className="leading-relaxed text-stone-600">
              {listing.description}
            </p>

            <div className="flex items-center gap-4 text-sm text-stone-500">
              <span>{listing.category}</span>
              <span>•</span>
              <span>{listing.location}</span>
              <span>•</span>
              <span>{listing.postedAt}</span>
            </div>

            <div className="mt-4 rounded-2xl border border-orange-100 bg-white p-5">
              <p className="text-sm text-stone-500">Vendu par</p>
              <p className="mt-1 font-semibold text-stone-900">
                {listing.sellerName}
              </p>
              <p className="text-sm text-stone-500">{listing.location}</p>
              <button className="mt-4 w-full rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700">
                Contacter le vendeur
              </button>
            </div>
          </div>
        </div>

        {similarListings.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold text-stone-900">
              Annonces similaires
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {similarListings.map((item) => (
                <Link
                  key={item.id}
                  href={`/produits/${item.id}`}
                  className="flex flex-col overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex h-28 items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 text-3xl">
                    {item.emoji}
                  </div>
                  <div className="flex flex-col gap-1 p-4">
                    <h3 className="font-semibold text-stone-900">
                      {item.title}
                    </h3>
                    <span className="font-bold text-orange-700">
                      {item.price} €
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-orange-100 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-stone-500 sm:flex-row">
          <span>© {new Date().getFullYear()} Souk El Business</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-orange-700">
              Mentions légales
            </a>
            <a href="#" className="hover:text-orange-700">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
