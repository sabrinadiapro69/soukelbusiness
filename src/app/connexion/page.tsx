import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ConnexionForm from "@/components/ConnexionForm";

export default function ConnexionPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-md flex-1 px-6 py-16">
        <h1 className="text-2xl font-bold text-stone-900">Connexion</h1>
        <ConnexionForm />
      </main>

      <SiteFooter />
    </div>
  );
}
