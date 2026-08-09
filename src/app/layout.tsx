import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import { getLocale } from "@/lib/i18n/locale";
import BackToTopButton from "@/components/BackToTopButton";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const title =
  "Souk El Business : le talent algérien, entre artisanat et bonnes affaires";
const description =
  "Artisanat, bonnes affaires, gestes de générosité : la référence pour tout ce qui vient d'Algérie. Talent et savoir-faire algériens, de France et d'Algérie, ouverts à tous.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: "%s : Souk El Business",
  },
  description,
  openGraph: {
    title,
    description,
    url: SITE_URL,
    siteName: "Souk El Business",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Souk El Business",
      url: SITE_URL,
      description,
    },
    {
      "@type": "WebSite",
      name: "Souk El Business",
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/produits?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${fraunces.variable} ${inter.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-(--bg) text-(--ink) font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <BackToTopButton />
      </body>
    </html>
  );
}
