import Link from "next/link";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function SiteFooter() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const t = dict.footer;

  return (
    <footer className="border-t border-line pt-11 pb-7">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 grid grid-cols-2 gap-6 sm:grid-cols-5">
          <div className="col-span-2 sm:col-span-1">
            <span className="font-serif text-lg font-bold">
              <span className="text-accent">Souk</span> El Business
            </span>
            <p className="mt-2.5 max-w-[230px] text-[13px] leading-relaxed text-ink-soft">
              {t.tagline}
            </p>
          </div>
          <div>
            <h5 className="mb-3.5 text-[12.5px] font-semibold tracking-wide text-ink-soft uppercase">
              {t.categories}
            </h5>
            <Link href="/#rayons" className="mb-2 block text-[13.5px]">
              {t.vehicules}
            </Link>
            <Link href="/#rayons" className="mb-2 block text-[13.5px]">
              {t.immobilier}
            </Link>
            <Link href="/#dressing" className="mb-2 block text-[13.5px]">
              {t.dressing}
            </Link>
            <Link href="/#rayons" className="mb-2 block text-[13.5px]">
              {t.multimedia}
            </Link>
          </div>
          <div>
            <h5 className="mb-3.5 text-[12.5px] font-semibold tracking-wide text-ink-soft uppercase">
              {t.souk}
            </h5>
            <Link href="/contact" className="mb-2 block text-[13.5px]">
              {t.apropos}
            </Link>
            <Link href="/contact" className="mb-2 block text-[13.5px]">
              {t.presse}
            </Link>
            <Link href="/publier" className="mb-2 block text-[13.5px]">
              {t.pro}
            </Link>
          </div>
          <div>
            <h5 className="mb-3.5 text-[12.5px] font-semibold tracking-wide text-ink-soft uppercase">
              {t.assistance}
            </h5>
            <Link href="/contact" className="mb-2 block text-[13.5px]">
              {t.aide}
            </Link>
            <Link href="/contact" className="mb-2 block text-[13.5px]">
              {t.securite}
            </Link>
            <Link href="/contact" className="mb-2 block text-[13.5px]">
              {t.signaler}
            </Link>
          </div>
          <div>
            <h5 className="mb-3.5 text-[12.5px] font-semibold tracking-wide text-ink-soft uppercase">
              {t.legal}
            </h5>
            <Link href="/mentions-legales" className="mb-2 block text-[13.5px]">
              {t.mentions}
            </Link>
            <Link href="/cgu" className="mb-2 block text-[13.5px]">
              {t.cgu}
            </Link>
            <Link href="/confidentialite" className="mb-2 block text-[13.5px]">
              {t.confidentialite}
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-2 border-t border-line pt-5 text-[12.5px] text-ink-soft sm:flex-row">
          <span>© {new Date().getFullYear()} Souk El Business</span>
          <span>{t.fait}</span>
        </div>
      </div>
    </footer>
  );
}
