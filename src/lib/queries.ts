import { supabase } from "./supabase";

export type SellerType = "particulier" | "pro";

export type Seller = {
  id: string;
  name: string;
  type: SellerType;
  avatar_emoji: string;
  description: string;
  city: string;
  member_since: string;
  transactions_count: number;
  rating: number;
};

export type Listing = {
  id: number;
  seller_id: string;
  title: string;
  price: number;
  category: string;
  location: string;
  emoji: string;
  description: string;
  negociable: boolean;
  created_at: string;
  seller?: Seller;
};

export type Review = {
  id: number;
  seller_id: string;
  author: string;
  rating: number;
  comment: string;
  created_at: string;
};

export type OfferStatus = "en_attente" | "acceptee" | "refusee" | "contre_offre";

export type Offer = {
  id: number;
  listing_id: number;
  buyer_id: string;
  montant_propose: number;
  statut: OfferStatus;
  conclue_par_acheteur: boolean;
  conclue_le: string | null;
  created_at: string;
};

export const categories = [
  "Toutes catégories",
  "Véhicules",
  "Immobilier",
  "Multimédia",
  "Maison & Jardin",
  "Emploi",
  "Services",
  "Animaux",
  "Dressing",
  "Artisanat & Métiers",
];

// Postgres "numeric" columns (price, rating) come back as strings from
// PostgREST to avoid float precision loss — coerce them to numbers here so
// the rest of the app can rely on the TypeScript types above.
function normalizeSeller(seller: Seller): Seller {
  return { ...seller, rating: Number(seller.rating) };
}

function normalizeListing(listing: Listing): Listing {
  return {
    ...listing,
    price: Number(listing.price),
    seller: listing.seller ? normalizeSeller(listing.seller) : listing.seller,
  };
}

export async function getListings(): Promise<Listing[]> {
  const { data, error } = await supabase
    .from("listings")
    .select("*, seller:sellers(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(normalizeListing);
}

export async function getListingById(id: number): Promise<Listing | null> {
  const { data, error } = await supabase
    .from("listings")
    .select("*, seller:sellers(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? normalizeListing(data) : null;
}

export async function getListingsByCategory(
  category: string,
  excludeId: number
): Promise<Listing[]> {
  const { data, error } = await supabase
    .from("listings")
    .select("*, seller:sellers(*)")
    .eq("category", category)
    .neq("id", excludeId)
    .limit(3);

  if (error) throw error;
  return (data ?? []).map(normalizeListing);
}

export async function getSellerById(id: string): Promise<Seller | null> {
  const { data, error } = await supabase
    .from("sellers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? normalizeSeller(data) : null;
}

export async function getListingsBySeller(
  sellerId: string
): Promise<Listing[]> {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(normalizeListing);
}

export async function getReviewsBySeller(
  sellerId: string
): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export function formatDA(price: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(Math.round(price))} DA`;
}

export function formatMemberSince(dateStr: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}

export function formatRelativeTime(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "hier";
  if (days < 30) return `il y a ${days} jours`;
  const months = Math.floor(days / 30);
  return `il y a ${months} mois`;
}
