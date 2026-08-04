import Link from "next/link";
import { formatEUR, getListingPhotoUrl, type Listing } from "@/lib/queries";

export default function ListingsPreviewGrid({
  listings,
  emptyLabel,
  donLabel,
}: {
  listings: Listing[];
  emptyLabel: string;
  donLabel: string;
}) {
  if (listings.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-line bg-paper px-4 py-6 text-center text-sm text-ink-soft">
        {emptyLabel}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {listings.map((listing) => (
        <Link
          key={listing.id}
          href={`/produits/${listing.id}`}
          className="flex flex-col overflow-hidden rounded-xl border border-line bg-paper transition-shadow hover:shadow-lg"
        >
          <div className="flex h-28 items-center justify-center overflow-hidden bg-bg-alt text-3xl">
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
          <div className="flex flex-col gap-1 p-4">
            <h3 className="font-semibold text-ink">{listing.title}</h3>
            {listing.is_don ? (
              <span className="w-fit rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary-dark">
                {donLabel}
              </span>
            ) : (
              <span className="font-mono font-bold text-accent-dark">
                {formatEUR(listing.price)}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
