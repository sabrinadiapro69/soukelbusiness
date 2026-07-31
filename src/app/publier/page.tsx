import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PublierForm from "@/components/PublierForm";

export default async function PublierPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-xl flex-1 px-6 py-16">
        <h1 className="text-2xl font-bold text-stone-900">
          Publier une annonce
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Elle apparaîtra immédiatement dans le catalogue et sur votre profil.
        </p>
        <PublierForm />
      </main>

      <SiteFooter />
    </div>
  );
}
