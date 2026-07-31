import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getListings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/produits`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.3 },
    {
      url: `${SITE_URL}/mentions-legales`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    { url: `${SITE_URL}/connexion`, changeFrequency: "yearly", priority: 0.2 },
    {
      url: `${SITE_URL}/inscription`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const listings = await getListings().catch(() => []);

  const listingPages: MetadataRoute.Sitemap = listings.map((listing) => ({
    url: `${SITE_URL}/produits/${listing.id}`,
    lastModified: listing.created_at,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const sellerIds = Array.from(new Set(listings.map((l) => l.seller_id)));
  const sellerPages: MetadataRoute.Sitemap = sellerIds.map((id) => ({
    url: `${SITE_URL}/vendeurs/${id}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticPages, ...listingPages, ...sellerPages];
}
