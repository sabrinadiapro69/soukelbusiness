import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export type SellerType = "particulier" | "pro";

export type SellerRole = "user" | "moderateur" | "admin";
export type SellerStatus = "actif" | "suspendu";
export type SiretStatus = "aucun" | "en_attente" | "verifie" | "rejete";

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
  role?: SellerRole;
  status?: SellerStatus;
  siret?: string | null;
  siret_status?: SiretStatus;
  company_name?: string | null;
  phone?: string | null;
  contact_email?: string | null;
};

export type ListingStatus = "pending" | "approved" | "rejected" | "vendu";

export type Listing = {
  id: number;
  seller_id: string;
  title: string;
  price: number;
  category: string;
  location: string;
  commune?: string | null;
  emoji: string;
  photos: string[];
  description: string;
  negociable: boolean;
  is_don: boolean;
  created_at: string;
  status?: ListingStatus;
  seller?: Seller;
};

export type Review = {
  id: number;
  offer_id: number;
  seller_id: string;
  buyer_id: string;
  rating: number;
  comment: string;
  created_at: string;
  buyer?: { name: string; avatar_emoji: string };
};

export type ProProfile = {
  seller_id: string;
  metier: string;
  categories: string[];
  verified: boolean;
};

export type PortfolioItem = {
  id: number;
  seller_id: string;
  title: string;
  description: string;
  photos: string[];
  created_at: string;
};

const PORTFOLIO_BUCKET = "portfolio-photos";

export function getPortfolioPhotoUrl(path: string): string {
  return supabase.storage.from(PORTFOLIO_BUCKET).getPublicUrl(path).data
    .publicUrl;
}

const LISTING_PHOTOS_BUCKET = "listing-photos";

export function getListingPhotoUrl(path: string): string {
  return supabase.storage.from(LISTING_PHOTOS_BUCKET).getPublicUrl(path).data
    .publicUrl;
}

export type Talent = {
  seller: Seller;
  pro_profile: ProProfile;
  portfolio: PortfolioItem[];
  reviewsCount: number;
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

export type SavedSearch = {
  id: number;
  user_id: string;
  query: string;
  category: string;
  wilaya?: string | null;
  commune?: string | null;
  created_at: string;
};

export const categories = [
  "Toutes catégories",
  "Création",
  "Mode",
  "Maison",
  "Beauté",
  "Photo et vidéo",
  "Services",
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
    photos: listing.photos ?? [],
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

export async function getDonListings(limit = 12): Promise<Listing[]> {
  const { data, error } = await supabase
    .from("listings")
    .select("*, seller:sellers(*)")
    .eq("is_don", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map(normalizeListing);
}

export type FeaturedListing = Listing & {
  seller: Seller;
  talentueux: boolean;
  reviewsCount: number;
  reviewsAvg: number;
};

// Annonces réelles des 6 catégories créateurs, affichées sur la page
// d'accueil (section "Créations & services à découvrir") à la place des
// données de démonstration, dès qu'il en existe. Enrichit chaque annonce
// avec le badge Talentueux (pro_profiles.verified) et la moyenne d'avis
// du vendeur, calculées ici plutôt qu'en base pour rester simple.
export async function getFeaturedListings(limit = 9): Promise<FeaturedListing[]> {
  const { data, error } = await supabase
    .from("listings")
    .select("*, seller:sellers(*)")
    .eq("status", "approved")
    .in("category", categories.filter((c) => c !== "Toutes catégories"))
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  const listings = (data ?? []).map(normalizeListing) as (Listing & {
    seller: Seller;
  })[];

  const sellerIds = [...new Set(listings.map((l) => l.seller_id))];
  if (sellerIds.length === 0) return [];

  const [{ data: proProfiles }, { data: reviews }] = await Promise.all([
    supabase.from("pro_profiles").select("seller_id, verified").in("seller_id", sellerIds),
    supabase.from("reviews").select("seller_id, rating").in("seller_id", sellerIds),
  ]);

  const verifiedBySeller = new Map(
    (proProfiles ?? []).map((p) => [p.seller_id, p.verified as boolean])
  );

  const reviewsBySeller = new Map<string, { count: number; total: number }>();
  for (const r of reviews ?? []) {
    const current = reviewsBySeller.get(r.seller_id) ?? { count: 0, total: 0 };
    current.count += 1;
    current.total += r.rating;
    reviewsBySeller.set(r.seller_id, current);
  }

  return listings.map((listing) => {
    const stats = reviewsBySeller.get(listing.seller_id);
    return {
      ...listing,
      talentueux: verifiedBySeller.get(listing.seller_id) ?? false,
      reviewsCount: stats?.count ?? 0,
      reviewsAvg: stats ? stats.total / stats.count : 0,
    };
  });
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

export type SoldOfferInfo = {
  montant_propose: number;
  conclue_le: string | null;
  buyer?: { name: string };
};

export type MyListing = Listing & { sold_offer?: SoldOfferInfo | null };

// Toutes les annonces d'un vendeur, quel que soit leur statut (y compris
// en attente/rejetée/vendue) — nécessite le client de session de
// l'utilisateur connecté (RLS "Sellers read own listings"), jamais le
// singleton anonyme qui ne voit que les annonces approuvées.
export async function getMyListings(
  supabaseClient: SupabaseClient,
  sellerId: string
): Promise<MyListing[]> {
  const { data, error } = await supabaseClient
    .from("listings")
    .select(
      "*, sold_offer:offers!sold_via_offer_id(montant_propose, conclue_le, buyer:sellers(name))"
    )
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => ({
    ...normalizeListing(row),
    sold_offer: row.sold_offer
      ? { ...row.sold_offer, montant_propose: Number(row.sold_offer.montant_propose) }
      : null,
  }));
}

// Une annonce précise appartenant à l'utilisateur connecté, quel que soit
// son statut — nécessite le client de session (RLS "Sellers read own
// listings"), utilisé par la page de modification d'annonce.
export async function getMyListingById(
  supabaseClient: SupabaseClient,
  id: number,
  sellerId: string
): Promise<Listing | null> {
  const { data, error } = await supabaseClient
    .from("listings")
    .select("*")
    .eq("id", id)
    .eq("seller_id", sellerId)
    .maybeSingle();

  if (error) throw error;
  return data ? normalizeListing(data) : null;
}

export async function getSavedSearches(
  supabaseClient: SupabaseClient,
  userId: string
): Promise<SavedSearch[]> {
  const { data, error } = await supabaseClient
    .from("saved_searches")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// --- Panneau d'administration ---
// Ces fonctions attendent un client Supabase déjà autorisé (en pratique
// le client service_role, créé côté serveur uniquement après vérification
// du rôle admin — voir requireAdmin() dans actions.ts).

export type ReportType = "annonce" | "utilisateur";
export type ReportStatus = "en_attente" | "traite" | "rejete";

export type Report = {
  id: number;
  type: ReportType;
  target_id: string;
  reporter_id: string;
  motif: string;
  description: string;
  statut: ReportStatus;
  created_at: string;
  reporter?: Seller;
  // Vendeur concerné par le signalement : le target_id lui-même si
  // type = "utilisateur", ou le seller_id de l'annonce si type = "annonce"
  // (résolu ici pour que les actions "avertir"/"bannir" ciblent la bonne
  // personne).
  sellerId: string | null;
};

export type AuditLogEntry = {
  id: number;
  admin_id: string | null;
  action: string;
  cible_type: string;
  cible_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
  admin?: Seller;
};

export type PendingTalent = {
  seller: Seller;
  pro_profile: ProProfile;
};

export type DashboardCounts = {
  newUsers: number;
  newListings: number;
  pendingReports: number;
  pendingTalents: number;
  pendingSirets: number;
};

export async function getDashboardCounts(
  supabaseClient: SupabaseClient
): Promise<DashboardCounts> {
  const weekAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  const [newUsers, newListings, pendingReports, pendingTalents, pendingSirets] =
    await Promise.all([
      supabaseClient
        .from("sellers")
        .select("id", { count: "exact", head: true })
        .gte("created_at", weekAgo),
      supabaseClient
        .from("listings")
        .select("id", { count: "exact", head: true })
        .gte("created_at", weekAgo),
      supabaseClient
        .from("reports")
        .select("id", { count: "exact", head: true })
        .eq("statut", "en_attente"),
      supabaseClient
        .from("pro_profiles")
        .select("seller_id", { count: "exact", head: true })
        .eq("verified", false)
        .is("reviewed_at", null),
      supabaseClient
        .from("sellers")
        .select("id", { count: "exact", head: true })
        .eq("siret_status", "en_attente"),
    ]);

  return {
    newUsers: newUsers.count ?? 0,
    newListings: newListings.count ?? 0,
    pendingReports: pendingReports.count ?? 0,
    pendingTalents: pendingTalents.count ?? 0,
    pendingSirets: pendingSirets.count ?? 0,
  };
}

export async function getPendingSirets(
  supabaseClient: SupabaseClient
): Promise<Seller[]> {
  const { data, error } = await supabaseClient
    .from("sellers")
    .select("*")
    .eq("siret_status", "en_attente")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(normalizeSeller);
}

export async function getReports(
  supabaseClient: SupabaseClient
): Promise<Report[]> {
  const { data, error } = await supabaseClient
    .from("reports")
    .select("*, reporter:sellers(*)")
    .order("statut", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;

  const listingIds = (data ?? [])
    .filter((r) => r.type === "annonce")
    .map((r) => Number(r.target_id));

  const sellerIdByListingId = new Map<number, string>();
  if (listingIds.length > 0) {
    const { data: listingsData } = await supabaseClient
      .from("listings")
      .select("id, seller_id")
      .in("id", listingIds);
    for (const listing of listingsData ?? []) {
      sellerIdByListingId.set(listing.id, listing.seller_id);
    }
  }

  return (data ?? []).map((r) => ({
    ...r,
    reporter: r.reporter ? normalizeSeller(r.reporter) : undefined,
    sellerId:
      r.type === "utilisateur"
        ? r.target_id
        : (sellerIdByListingId.get(Number(r.target_id)) ?? null),
  }));
}

export async function getPendingTalents(
  supabaseClient: SupabaseClient
): Promise<PendingTalent[]> {
  const { data, error } = await supabaseClient
    .from("pro_profiles")
    .select("*, seller:sellers(*)")
    .eq("verified", false)
    .is("reviewed_at", null);

  if (error) throw error;
  return (data ?? []).map((row) => ({
    seller: normalizeSeller(row.seller),
    pro_profile: {
      seller_id: row.seller_id,
      metier: row.metier,
      categories: row.categories ?? [],
      verified: row.verified,
    },
  }));
}

export async function searchAdminUsers(
  adminClient: SupabaseClient,
  query: string
): Promise<Seller[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    const { data, error } = await adminClient
      .from("sellers")
      .select("*")
      .order("member_since", { ascending: false })
      .limit(50);
    if (error) throw error;
    return (data ?? []).map(normalizeSeller);
  }

  const { data: byName, error: nameError } = await adminClient
    .from("sellers")
    .select("*")
    .ilike("name", `%${trimmed}%`)
    .limit(50);
  if (nameError) throw nameError;

  // L'email vit dans auth.users (jamais recopié dans une table publique
  // pour éviter de l'exposer) : on ne peut le chercher que via l'API
  // Admin, avec le client service_role.
  const matchingIds = new Set((byName ?? []).map((s) => s.id));
  const { data: authUsers } = await adminClient.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  for (const authUser of authUsers?.users ?? []) {
    if (authUser.email?.toLowerCase().includes(trimmed.toLowerCase())) {
      matchingIds.add(authUser.id);
    }
  }

  if (matchingIds.size === 0) return [];

  const { data, error } = await adminClient
    .from("sellers")
    .select("*")
    .in("id", Array.from(matchingIds));
  if (error) throw error;
  return (data ?? []).map(normalizeSeller);
}

export async function getSellerListingsCount(
  supabaseClient: SupabaseClient,
  sellerId: string
): Promise<number> {
  const { count } = await supabaseClient
    .from("listings")
    .select("id", { count: "exact", head: true })
    .eq("seller_id", sellerId);
  return count ?? 0;
}

export async function getSellerReportsCount(
  supabaseClient: SupabaseClient,
  sellerId: string
): Promise<number> {
  const { count } = await supabaseClient
    .from("reports")
    .select("id", { count: "exact", head: true })
    .eq("type", "utilisateur")
    .eq("target_id", sellerId);
  return count ?? 0;
}

export async function searchAdminListings(
  supabaseClient: SupabaseClient,
  filters: {
    query?: string;
    category?: string;
    statut?: string;
    wilaya?: string;
  } = {}
): Promise<Listing[]> {
  let query = supabaseClient
    .from("listings")
    .select("*, seller:sellers(*)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (filters.query) query = query.ilike("title", `%${filters.query}%`);
  if (filters.category) query = query.eq("category", filters.category);
  if (filters.statut) query = query.eq("status", filters.statut);
  if (filters.wilaya) query = query.eq("location", filters.wilaya);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(normalizeListing);
}

export async function getAdmins(
  supabaseClient: SupabaseClient
): Promise<Seller[]> {
  const { data, error } = await supabaseClient
    .from("sellers")
    .select("*")
    .eq("role", "admin");
  if (error) throw error;
  return (data ?? []).map(normalizeSeller);
}

export async function getAuditLog(
  supabaseClient: SupabaseClient,
  filters: { adminId?: string; action?: string } = {}
): Promise<AuditLogEntry[]> {
  let query = supabaseClient
    .from("audit_log")
    .select("*, admin:sellers(*)")
    .order("created_at", { ascending: false })
    .limit(200);

  if (filters.adminId) query = query.eq("admin_id", filters.adminId);
  if (filters.action) query = query.eq("action", filters.action);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((entry) => ({
    ...entry,
    admin: entry.admin ? normalizeSeller(entry.admin) : undefined,
  }));
}

export async function getReviewsBySeller(
  sellerId: string
): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*, buyer:sellers(name, avatar_emoji)")
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getProProfile(
  sellerId: string
): Promise<ProProfile | null> {
  const { data, error } = await supabase
    .from("pro_profiles")
    .select("*")
    .eq("seller_id", sellerId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getPortfolioBySeller(
  sellerId: string
): Promise<PortfolioItem[]> {
  const { data, error } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getTopTalents(
  limit = 4,
  category?: string
): Promise<Talent[]> {
  let query = supabase
    .from("pro_profiles")
    .select("*, seller:sellers!inner(*), portfolio:portfolio_items(*)")
    .eq("verified", true);

  if (category) {
    query = query.contains("categories", [category]);
  }

  const { data, error } = await query
    .order("rating", { ascending: false, referencedTable: "seller" })
    .limit(limit);

  if (error) throw error;

  return Promise.all(
    (data ?? []).map(async (row) => {
      const { count } = await supabase
        .from("reviews")
        .select("*", { count: "exact", head: true })
        .eq("seller_id", row.seller_id);

      return {
        seller: normalizeSeller(row.seller),
        pro_profile: {
          seller_id: row.seller_id,
          metier: row.metier,
          categories: row.categories ?? [],
          verified: row.verified,
        },
        portfolio: (row.portfolio ?? []).slice(0, 3),
        reviewsCount: count ?? 0,
      };
    })
  );
}

export function formatEUR(price: number): string {
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(price)} €`;
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
