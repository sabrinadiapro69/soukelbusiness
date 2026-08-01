import type { Locale } from "./locale";

// Fonctions de formatage utilisées par des Client Components : une
// fonction ne peut pas être passée en prop depuis un Server Component
// (elle n'est pas sérialisable), donc ces helpers sont importés
// directement côté client plutôt que stockés dans le dictionnaire.

export function formatResultsCount(locale: Locale, n: number): string {
  if (locale === "en") return `${n} listing${n > 1 ? "s" : ""} found`;
  if (locale === "ar") return `تم العثور على ${n} إعلان`;
  return `${n} annonce${n > 1 ? "s" : ""} trouvée${n > 1 ? "s" : ""}`;
}

export function formatConfirmationSent(locale: Locale, email: string): string {
  if (locale === "en") return `A confirmation email was sent to ${email}.`;
  if (locale === "ar") return `تم إرسال بريد تأكيد إلى ${email}.`;
  return `Un email de confirmation vous a été envoyé à ${email}.`;
}
