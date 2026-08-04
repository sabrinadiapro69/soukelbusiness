import Link from "next/link";
import { getListingPhotoUrl, type Listing } from "@/lib/queries";

export default function DonsScroll({
  listings,
  donLabel,
  emptyLabel,
}: {
  listings: Listing[];
  donLabel: string;
  emptyLabel: string;
}) {
  if (listings.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-line bg-paper px-4 py-6 text-center text-sm text-ink-soft">
        {emptyLabel}
      </p>
    );
  }

  // On duplique la liste pour un défilement en boucle sans coupure visible.
  const looped = [...listings, ...listings];

  return (
    <div className="overflow-hidden">
      <div className="animate-marquee flex w-max gap-4">
        {looped.map((listing, i) => (
          <Link
            key={`${listing.id}-${i}`}
            href={`/produits/${listing.id}`}
            className="flex w-[200px] shrink-0 flex-col overflow-hidden rounded-xl border border-line bg-paper transition-shadow hover:shadow-lg"
          >
            <div className="flex h-32 items-center justify-center overflow-hidden bg-bg-alt text-3xl">
              {listing.photos.length > 0 ? (
                <img
                  src={getListingPhotoUrl(listing.photos[0])}
                  alt={listing.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                listing.emoji
              )}
            </div>
            <div className="flex flex-col gap-1.5 p-3.5">
              <span className="w-fit rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary-dark">
                {donLabel}
              </span>
              <span className="text-sm font-semibold text-ink">
                {listing.title}
              </span>
              <span className="text-xs text-ink-soft">📍 {listing.location}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
