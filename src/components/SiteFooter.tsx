import Link from "next/link";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function SiteFooter() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const t = dict.footer;

  const links = [
    { href: "/produits", label: t.linkExplorer },
    { href: "/pro", label: t.linkVendre },
    { href: "/contact", label: t.linkApropos },
    { href: "/contact", label: t.linkAide },
    { href: "/mentions-legales", label: t.linkMentions },
    { href: "/confidentialite", label: t.linkConfidentialite },
    { href: "/confidentialite", label: t.linkCookies },
  ];

  return (
    <footer className="border-t border-line py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2.5">
          <svg viewBox="0 0 100 100" className="h-8 w-8 shrink-0" aria-hidden="true">
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
          <div>
            <p className="font-serif text-sm font-semibold text-ink">
              Souk El Business
            </p>
            <p className="text-xs text-ink-soft">{t.tagline}</p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-ink-soft">
          {links.map((link, i) => (
            <Link
              key={`${link.href}-${i}`}
              href={link.href}
              className="transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <p className="mt-6 text-center text-[12px] text-ink-soft/70">
        © {new Date().getFullYear()} Souk El Business
      </p>
    </footer>
  );
}
