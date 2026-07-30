import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "Mentions légales — Souk El Business",
};

export default function MentionsLegalesPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-bold text-stone-900">Mentions légales</h1>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-stone-900">Éditeur du site</h2>
          <p className="mt-2 text-stone-600">
            Le site Souk El Business est édité par la société <strong>One Concept</strong>,
            immatriculée sous le numéro SIRET <strong>919 951 848 00028</strong>, dont le
            siège social est situé à Vaulx-en-Velin (France).
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-stone-900">
            Directrice de la publication
          </h2>
          <p className="mt-2 text-stone-600">Madame B.</p>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-stone-900">Contact</h2>
          <p className="mt-2 text-stone-600">
            Pour toute question relative au site, vous pouvez nous écrire à{" "}
            <a
              href="mailto:contact@one-concept.fr"
              className="text-orange-700 hover:underline"
            >
              contact@one-concept.fr
            </a>{" "}
            ou via notre{" "}
            <a href="/contact" className="text-orange-700 hover:underline">
              page de contact
            </a>
            .
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-stone-900">Hébergement</h2>
          <p className="mt-2 text-stone-600">
            Ce site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut,
            CA 91789, États-Unis.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-stone-900">
            Propriété intellectuelle
          </h2>
          <p className="mt-2 text-stone-600">
            L&apos;ensemble des éléments du site (textes, mises en page,
            visuels) est protégé par le droit d&apos;auteur. Toute
            reproduction sans autorisation préalable est interdite.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
