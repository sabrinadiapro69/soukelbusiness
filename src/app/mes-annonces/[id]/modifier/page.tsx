import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyListingById } from "@/lib/queries";
import ModifierListingForm from "@/components/ModifierListingForm";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const dynamic = "force-dynamic";

export default async function ModifierAnnoncePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const t = dict.modifier;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const listing = await getMyListingById(supabase, Number(id), user.id);

  if (!listing) {
    notFound();
  }

  if (listing.status === "vendu") {
    redirect("/mes-annonces");
  }

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <Link
          href="/mes-annonces"
          className="text-sm font-medium text-ink-soft hover:text-ink"
        >
          {t.back}
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-ink">{t.pageTitle}</h1>
        <p className="mt-1 text-sm text-ink-soft">{t.pageSubtitle}</p>

        <ModifierListingForm
          listing={listing}
          dict={{ ...dict.publier, ...dict.modifier }}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
