import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import InscriptionForm from "@/components/InscriptionForm";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function InscriptionPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-md flex-1 px-6 py-16">
        <h1 className="text-2xl font-bold text-ink">
          {dict.inscription.pageTitle}
        </h1>
        <InscriptionForm dict={dict.inscription} />
      </main>

      <SiteFooter />
    </div>
  );
}
