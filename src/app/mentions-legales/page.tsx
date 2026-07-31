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
        <h1 className="text-3xl font-bold text-ink">Mentions légales</h1>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-ink">Éditeur du site</h2>
          <p className="mt-2 text-ink-soft">
            Le site Souk El Business est édité par la société <strong>One Concept</strong>,
            immatriculée sous le numéro SIRET <strong>919 951 848 00028</strong>, dont le
            siège social est situé à Vaulx-en-Velin (France).
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-ink">
            Directrice de la publication
          </h2>
          <p className="mt-2 text-ink-soft">Madame B.</p>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-ink">Contact</h2>
          <p className="mt-2 text-ink-soft">
            Pour toute question relative au site, vous pouvez nous écrire à{" "}
            <a
              href="mailto:contact@one-concept.fr"
              className="text-accent hover:underline"
            >
              contact@one-concept.fr
            </a>{" "}
            ou via notre{" "}
            <a href="/contact" className="text-accent hover:underline">
              page de contact
            </a>
            .
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-ink">Hébergement</h2>
          <p className="mt-2 text-ink-soft">
            Ce site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut,
            CA 91789, États-Unis.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-ink">
            Propriété intellectuelle
          </h2>
          <p className="mt-2 text-ink-soft">
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
