import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PublierForm from "@/components/PublierForm";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function PublierPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const t = dict.publier;

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-xl flex-1 px-6 py-16">
        <h1 className="text-2xl font-bold text-ink">{t.pageTitle}</h1>
        <p className="mt-1 text-sm text-ink-soft">{t.pageSubtitle}</p>
        <PublierForm dict={t} />
      </main>

      <SiteFooter />
    </div>
  );
}
