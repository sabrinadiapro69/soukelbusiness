import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-orange-100 bg-white py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-stone-500 sm:flex-row">
        <span>© {new Date().getFullYear()} Souk El Business</span>
        <div className="flex gap-6">
          <Link href="/mentions-legales" className="hover:text-orange-700">
            Mentions légales
          </Link>
          <Link href="/contact" className="hover:text-orange-700">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
