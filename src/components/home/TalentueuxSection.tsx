import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import {
  getPortfolioPhotoUrl,
  getSellerDisplayName,
  type Talent,
} from "@/lib/queries";

export default function TalentueuxSection({
  talents,
  eyebrow,
  title,
  text,
  emptyLabel,
  verifiedLabel,
}: {
  talents: Talent[];
  eyebrow: string;
  title: string;
  text: string;
  emptyLabel: string;
  verifiedLabel: string;
}) {
  return (
    <section className="border-y border-line bg-bg-alt py-16">
      <div className="mx-auto max-w-6xl px-6">
        <span className="mb-1.5 block font-mono text-xs font-medium tracking-wide text-primary uppercase">
          {eyebrow}
        </span>
        <h2 className="font-serif text-3xl font-semibold text-ink">
          {title}
        </h2>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
          {text}
        </p>

        {talents.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {talents.map(({ seller, pro_profile, portfolio }) => {
              const photo = portfolio[0]?.photos?.[0];
              return (
                <Link
                  key={seller.id}
                  href={`/vendeurs/${seller.id}`}
                  className="flex flex-col overflow-hidden rounded-2xl border border-line bg-paper transition-shadow hover:shadow-lg"
                >
                  <div className="flex h-36 items-center justify-center overflow-hidden bg-bg-alt text-4xl">
                    {photo ? (
                      <img
                        src={getPortfolioPhotoUrl(photo)}
                        alt={getSellerDisplayName(seller)}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      seller.avatar_emoji
                    )}
                  </div>
                  <div className="flex flex-col gap-1 p-4">
                    <span className="text-sm font-semibold text-ink">
                      {getSellerDisplayName(seller)}
                    </span>
                    {pro_profile.metier && (
                      <span className="text-xs text-ink-soft">
                        {pro_profile.metier}
                      </span>
                    )}
                    <span className="mt-1 flex w-fit items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-white">
                      <BadgeCheck size={12} strokeWidth={2.2} aria-hidden="true" />
                      {verifiedLabel}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="mt-8 rounded-xl border border-dashed border-line bg-paper px-4 py-6 text-center text-sm text-ink-soft">
            {emptyLabel}
          </p>
        )}
      </div>
    </section>
  );
}
