// Le site est pour l'instant limité à la France (voir wilayas.ts) : pas de
// niveau "commune" pour l'instant, chaque ville suffit. Conservé vide plutôt
// que supprimé pour ne pas casser les composants qui l'utilisent déjà — voir
// communes-algerie.ts pour les données d'origine (réactivation future).
export const communesByWilaya: Record<string, string[]> = {};
