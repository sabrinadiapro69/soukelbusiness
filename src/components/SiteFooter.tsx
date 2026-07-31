import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line pt-11 pb-7">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 grid grid-cols-2 gap-6 sm:grid-cols-5">
          <div className="col-span-2 sm:col-span-1">
            <span className="font-serif text-lg font-bold">
              <span className="text-accent">Souk</span> El Business
            </span>
            <p className="mt-2.5 max-w-[230px] text-[13px] leading-relaxed text-ink-soft">
              La marketplace généraliste et de mode entre particuliers,
              pensée pour l&apos;Algérie.
            </p>
          </div>
          <div>
            <h5 className="mb-3.5 text-[12.5px] font-semibold tracking-wide text-ink-soft uppercase">
              Catégories
            </h5>
            <Link href="/#rayons" className="mb-2 block text-[13.5px]">
              Véhicules
            </Link>
            <Link href="/#rayons" className="mb-2 block text-[13.5px]">
              Immobilier
            </Link>
            <Link href="/#dressing" className="mb-2 block text-[13.5px]">
              Dressing
            </Link>
            <Link href="/#rayons" className="mb-2 block text-[13.5px]">
              Multimédia
            </Link>
          </div>
          <div>
            <h5 className="mb-3.5 text-[12.5px] font-semibold tracking-wide text-ink-soft uppercase">
              Souk El Business
            </h5>
            <Link href="/contact" className="mb-2 block text-[13.5px]">
              À propos
            </Link>
            <Link href="/contact" className="mb-2 block text-[13.5px]">
              Presse
            </Link>
            <Link href="/publier" className="mb-2 block text-[13.5px]">
              Souk El Business Pro
            </Link>
          </div>
          <div>
            <h5 className="mb-3.5 text-[12.5px] font-semibold tracking-wide text-ink-soft uppercase">
              Assistance
            </h5>
            <Link href="/contact" className="mb-2 block text-[13.5px]">
              Centre d&apos;aide
            </Link>
            <Link href="/contact" className="mb-2 block text-[13.5px]">
              Sécurité
            </Link>
            <Link href="/contact" className="mb-2 block text-[13.5px]">
              Signaler une annonce
            </Link>
          </div>
          <div>
            <h5 className="mb-3.5 text-[12.5px] font-semibold tracking-wide text-ink-soft uppercase">
              Légal
            </h5>
            <Link href="/mentions-legales" className="mb-2 block text-[13.5px]">
              Mentions légales
            </Link>
            <Link href="/contact" className="mb-2 block text-[13.5px]">
              Confidentialité
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-2 border-t border-line pt-5 text-[12.5px] text-ink-soft sm:flex-row">
          <span>© {new Date().getFullYear()} Souk El Business</span>
          <span>Fait avec 🌿 à Alger</span>
        </div>
      </div>
    </footer>
  );
}
