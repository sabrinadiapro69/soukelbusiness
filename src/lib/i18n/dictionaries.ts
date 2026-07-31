import "server-only";
import type { Locale } from "./locale";
import fr from "./dictionaries/fr";
import en from "./dictionaries/en";
import ar from "./dictionaries/ar";

const dictionaries = { fr, en, ar };

export async function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
