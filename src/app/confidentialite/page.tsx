import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const metadata = {
  title: "Politique de confidentialité",
};

export default async function ConfidentialitePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const t = dict.confidentialite;

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-bold text-ink">{t.pageTitle}</h1>
        <p className="mt-2 text-sm text-ink-soft">
          {t.lastUpdated} {new Date().toLocaleDateString("fr-FR")}
        </p>

        {t.sections.map((section) => (
          <section key={section.title} className="mt-8">
            <h2 className="text-lg font-semibold text-ink">
              {section.title}
            </h2>
            <p className="mt-2 text-ink-soft">{section.body}</p>
          </section>
        ))}

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-ink">
            {t.rightsSectionTitle}
          </h2>
          <p className="mt-2 text-ink-soft">
            {t.rightsSectionPrefix}{" "}
            <a href="/contact" className="text-accent hover:underline">
              {t.contactPageLink}
            </a>
            .
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-ink">
            {t.cookiesSectionTitle}
          </h2>
          <p className="mt-2 text-ink-soft">{t.cookiesSectionBody}</p>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-ink">
            {t.securitySectionTitle}
          </h2>
          <p className="mt-2 text-ink-soft">{t.securitySectionBody}</p>
        </section>

        <section className="mt-8 flex gap-4 text-sm">
          <a href="/mentions-legales" className="text-accent hover:underline">
            {t.mentionsLink}
          </a>
          <a href="/cgu" className="text-accent hover:underline">
            {t.cguLink}
          </a>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
