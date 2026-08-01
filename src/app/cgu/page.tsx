import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const metadata = {
  title: "Conditions générales d'utilisation",
};

export default async function CGUPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const t = dict.cgu;

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
            {t.contactSectionTitle}
          </h2>
          <p className="mt-2 text-ink-soft">
            {t.contactSectionPrefix}{" "}
            <a href="/contact" className="text-accent hover:underline">
              {t.contactPageLink}
            </a>
            .
          </p>
        </section>

        <section className="mt-8 flex gap-4 text-sm">
          <a href="/mentions-legales" className="text-accent hover:underline">
            {t.mentionsLink}
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
