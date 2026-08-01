import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const metadata = {
  title: "Mentions légales — Souk El Business",
};

export default async function MentionsLegalesPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const t = dict.mentionsLegales;

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-bold text-ink">{t.pageTitle}</h1>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-ink">{t.editorTitle}</h2>
          <p className="mt-2 text-ink-soft">{t.editorBody}</p>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-ink">
            {t.directorTitle}
          </h2>
          <p className="mt-2 text-ink-soft">{t.directorBody}</p>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-ink">{t.contactTitle}</h2>
          <p className="mt-2 text-ink-soft">
            {t.contactBody}{" "}
            <a
              href="mailto:contact@one-concept.fr"
              className="text-accent hover:underline"
            >
              contact@one-concept.fr
            </a>{" "}
            {t.contactOr}{" "}
            <a href="/contact" className="text-accent hover:underline">
              {t.contactPageLink}
            </a>
            .
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-ink">{t.hostingTitle}</h2>
          <p className="mt-2 text-ink-soft">{t.hostingBody}</p>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-ink">{t.ipTitle}</h2>
          <p className="mt-2 text-ink-soft">{t.ipBody}</p>
        </section>

        <section className="mt-8 flex gap-4 text-sm">
          <a href="/cgu" className="text-accent hover:underline">
            {t.cguLink}
          </a>
          <a href="/confidentialite" className="text-accent hover:underline">
            {t.privacyLink}
          </a>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
