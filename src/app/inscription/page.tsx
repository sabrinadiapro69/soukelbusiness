import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import InscriptionForm from "@/components/InscriptionForm";

export default function InscriptionPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-md flex-1 px-6 py-16">
        <h1 className="text-2xl font-bold text-stone-900">Créer un compte</h1>
        <InscriptionForm />
      </main>

      <SiteFooter />
    </div>
  );
}
