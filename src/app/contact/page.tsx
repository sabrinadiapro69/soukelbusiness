import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-bold text-ink">Contactez-nous</h1>
        <p className="mt-2 max-w-xl text-ink-soft">
          Une question, une suggestion, un problème avec une annonce ?
          Écrivez-nous, nous vous répondons rapidement.
        </p>

        <ContactForm />
      </main>

      <SiteFooter />
    </div>
  );
}
