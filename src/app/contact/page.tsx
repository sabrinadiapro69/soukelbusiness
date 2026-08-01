import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ContactForm from "@/components/ContactForm";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function ContactPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-bold text-ink">
          {dict.contact.pageTitle}
        </h1>
        <p className="mt-2 max-w-xl text-ink-soft">{dict.contact.pageSubtitle}</p>

        <ContactForm dict={dict.contact} />
      </main>

      <SiteFooter />
    </div>
  );
}
