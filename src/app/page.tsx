const categories = [
  { name: "Artisanat", emoji: "🏺" },
  { name: "Mode & Textile", emoji: "🧵" },
  { name: "Épicerie fine", emoji: "🌶️" },
  { name: "Maison & Déco", emoji: "🕌" },
  { name: "Bijoux", emoji: "💍" },
  { name: "Beauté", emoji: "🧴" },
];

const products = [
  { name: "Théière en cuivre gravée", vendor: "Atelier Nour", price: "45 €" },
  { name: "Tapis berbère fait main", vendor: "Maison Zayn", price: "180 €" },
  { name: "Coffret d'épices du souk", vendor: "Épices Amir", price: "22 €" },
  { name: "Babouches brodées", vendor: "Cuir & Fil", price: "38 €" },
];

const features = [
  {
    title: "Vendeurs vérifiés",
    description: "Chaque boutique est contrôlée avant d'être mise en ligne.",
    emoji: "✅",
  },
  {
    title: "Paiement sécurisé",
    description: "Vos transactions sont protégées de bout en bout.",
    emoji: "🔒",
  },
  {
    title: "Livraison rapide",
    description: "Une logistique pensée pour livrer partout, sans attendre.",
    emoji: "🚚",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-orange-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-bold tracking-tight text-orange-700">
            Souk El Business
          </span>
          <nav className="hidden gap-8 text-sm font-medium text-stone-600 sm:flex">
            <a href="#categories" className="hover:text-orange-700">
              Catégories
            </a>
            <a href="/produits" className="hover:text-orange-700">
              Produits
            </a>
            <a href="#vendre" className="hover:text-orange-700">
              Devenir vendeur
            </a>
          </nav>
          <a
            href="#vendre"
            className="rounded-full bg-orange-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
          >
            Vendre sur Souk
          </a>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-600 text-white">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-24 text-center">
            <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Le marché en ligne qui connecte artisans et acheteurs
            </h1>
            <p className="max-w-xl text-lg text-amber-50">
              Découvrez des milliers de produits uniques, faits main par des
              vendeurs passionnés partout dans le pays.
            </p>
            <form className="flex w-full max-w-lg overflow-hidden rounded-full bg-white shadow-lg">
              <input
                type="search"
                placeholder="Rechercher un produit, une boutique..."
                className="flex-1 px-5 py-3 text-stone-900 outline-none placeholder:text-stone-400"
              />
              <button
                type="submit"
                className="bg-stone-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-stone-800"
              >
                Rechercher
              </button>
            </form>
          </div>
        </section>

        <section id="categories" className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-bold text-stone-900">
            Explorer par catégorie
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <a
                key={category.name}
                href="#produits"
                className="flex flex-col items-center gap-3 rounded-2xl border border-orange-100 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="text-3xl">{category.emoji}</span>
                <span className="text-sm font-medium text-stone-700">
                  {category.name}
                </span>
              </a>
            ))}
          </div>
        </section>

        <section id="produits" className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-2xl font-bold text-stone-900">
              Sélection du souk
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <div
                  key={product.name}
                  className="flex flex-col overflow-hidden rounded-2xl border border-orange-100 bg-stone-50 shadow-sm"
                >
                  <div className="flex h-36 items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 text-4xl">
                    🛍️
                  </div>
                  <div className="flex flex-1 flex-col gap-1 p-4">
                    <h3 className="font-semibold text-stone-900">
                      {product.name}
                    </h3>
                    <p className="text-sm text-stone-500">{product.vendor}</p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <span className="font-bold text-orange-700">
                        {product.price}
                      </span>
                      <button className="rounded-full bg-orange-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-orange-700">
                        Ajouter
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <a
                href="/produits"
                className="inline-block rounded-full border border-orange-600 px-6 py-2 text-sm font-semibold text-orange-700 transition-colors hover:bg-orange-50"
              >
                Voir toutes les annonces
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <span className="text-3xl">{feature.emoji}</span>
                <h3 className="mt-3 font-semibold text-stone-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-stone-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="vendre"
          className="bg-gradient-to-r from-amber-500 to-orange-600 py-16 text-white"
        >
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center">
            <h2 className="text-3xl font-bold">
              Vous vendez des produits artisanaux ?
            </h2>
            <p className="max-w-xl text-amber-50">
              Rejoignez Souk El Business et présentez votre boutique à des
              milliers d&apos;acheteurs.
            </p>
            <a
              href="#"
              className="mt-2 rounded-full bg-white px-6 py-3 font-semibold text-orange-700 transition-colors hover:bg-amber-50"
            >
              Ouvrir ma boutique
            </a>
          </div>
        </section>
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
