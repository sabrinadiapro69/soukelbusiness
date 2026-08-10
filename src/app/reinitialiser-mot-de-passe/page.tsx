import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ReinitialiserMotDePasseForm from "@/components/ReinitialiserMotDePasseForm";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function ReinitialiserMotDePassePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-md flex-1 px-6 py-16">
        <h1 className="text-2xl font-bold text-ink">
          {dict.reinitialiserMotDePasse.pageTitle}
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          {dict.reinitialiserMotDePasse.pageSubtitle}
        </p>
        <ReinitialiserMotDePasseForm dict={dict.reinitialiserMotDePasse} />
      </main>

      <SiteFooter />
    </div>
  );
}
