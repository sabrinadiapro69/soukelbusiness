import { headers } from "next/headers";

// Vercel ajoute automatiquement ces en-tetes de geolocalisation par IP sur
// les requetes en production. En local (ou hors Vercel), ils sont absents
// et on retombe sur null, gere par l'appelant.
export async function getUserCity(): Promise<string | null> {
  const headersList = await headers();
  const city = headersList.get("x-vercel-ip-city");
  return city ? decodeURIComponent(city) : null;
}
