"use client";

import { useState } from "react";

type Listing = {
  cat: string;
  catLabel: string;
  price: string;
  title: string;
  wilaya: string;
  time: string;
  icon: React.ReactNode;
};

const listings: Listing[] = [
  {
    cat: "vehicules",
    catLabel: "Véhicules",
    price: "1 850 000 DA",
    title: "Renault Clio 4, 2017, essence",
    wilaya: "Alger",
    time: "Il y a 2h",
    icon: (
      <path d="M5 17h14M5 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm14 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM3 17V9l2-5h10l3 5h1a2 2 0 0 1 2 2v6" />
    ),
  },
  {
    cat: "immobilier",
    catLabel: "Immobilier",
    price: "45 000 DA/mois",
    title: "Appartement F3, résidence calme",
    wilaya: "Oran",
    time: "Il y a 5h",
    icon: <path d="M3 11 12 3l9 8M5 10v10h14V10" />,
  },
  {
    cat: "multimedia",
    catLabel: "Multimédia",
    price: "95 000 DA",
    title: "iPhone 13, 128 Go, débloqué",
    wilaya: "Constantine",
    time: "Hier",
    icon: <><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M11 18h2" /></>,
  },
  {
    cat: "maison",
    catLabel: "Maison",
    price: "35 000 DA",
    title: "Canapé d'angle, tissu gris",
    wilaya: "Béjaïa",
    time: "Il y a 3h",
    icon: <path d="M4 20V10l8-6 8 6v10M9 20v-6h6v6" />,
  },
  {
    cat: "emploi",
    catLabel: "Emploi",
    price: "À négocier",
    title: "Développeur web full-stack",
    wilaya: "Alger",
    time: "Il y a 6h",
    icon: <><path d="M20 6 9 17l-5-5" /><rect x="3" y="3" width="18" height="18" rx="4" /></>,
  },
  {
    cat: "animaux",
    catLabel: "Animaux",
    price: "25 000 DA",
    title: "Chiot Berger Allemand, vacciné",
    wilaya: "Blida",
    time: "Hier",
    icon: (
      <path d="M11 4c1 2-1 3-1 5a2 2 0 0 0 4 0M8 9C5 9 3 12 3 15c0 3 2 6 9 6s9-3 9-6c0-3-2-6-5-6" />
    ),
  },
  {
    cat: "multimedia",
    catLabel: "Multimédia",
    price: "145 000 DA",
    title: "MacBook Air M1, 8Go/256Go",
    wilaya: "Annaba",
    time: "Il y a 8h",
    icon: <><rect x="4" y="5" width="16" height="10" rx="1" /><path d="M2 19h20" /></>,
  },
  {
    cat: "vehicules",
    catLabel: "Véhicules",
    price: "980 000 DA",
    title: "Moto Honda CBR 500, 2020",
    wilaya: "Sétif",
    time: "Il y a 4h",
    icon: <><circle cx="6" cy="17" r="3" /><circle cx="17" cy="17" r="3" /><path d="M9 17h5l3-6h-8l-2 4" /></>,
  },
];

const filters = [
  { value: "all", label: "Tout" },
  { value: "vehicules", label: "Véhicules" },
  { value: "immobilier", label: "Immobilier" },
  { value: "multimedia", label: "Multimédia" },
  { value: "maison", label: "Maison & Jardin" },
  { value: "emploi", label: "Emploi" },
  { value: "animaux", label: "Animaux" },
];

export default function AnnoncesFilter() {
  const [active, setActive] = useState("all");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const toggleFav = (index: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const visible = listings.filter((l) => active === "all" || l.cat === active);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2.5">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActive(f.value)}
            className={`rounded-full border px-4 py-2 text-[13.5px] font-medium transition-colors ${
              active === f.value
                ? "border-ink bg-ink text-bg"
                : "border-line bg-paper text-ink-soft hover:border-ink"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-[18px] sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((listing, index) => (
          <div
            key={`${listing.title}-${index}`}
            className="overflow-hidden rounded-xl border border-line bg-paper transition-shadow hover:shadow-lg"
          >
            <div className="relative flex aspect-[4/3] items-center justify-center bg-bg-alt">
              <span className="absolute top-2.5 left-2.5 z-10 rounded-full border border-line bg-paper px-2.5 py-1 text-[10.5px] font-semibold text-ink-soft">
                {listing.catLabel}
              </span>
              <button
                onClick={() => toggleFav(index)}
                aria-label="Favoris"
                className={`absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(250,246,238,0.92)] ${
                  favorites.has(index) ? "text-accent" : "text-ink-soft"
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={favorites.has(index) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.6z" />
                </svg>
              </button>
              <span
                className="absolute bottom-2.5 left-2.5 z-10 rotate-[-2deg] bg-accent px-3 py-1.5 pl-[18px] font-mono text-[13px] font-semibold text-white shadow-[2px_3px_0_rgba(28,38,32,0.18)]"
                style={{
                  clipPath:
                    "polygon(12px 0,100% 0,100% 100%,12px 100%,0 50%)",
                }}
              >
                {listing.price}
              </span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1C2620"
                strokeWidth="1.3"
                className="w-[46%] opacity-35"
              >
                {listing.icon}
              </svg>
            </div>
            <div className="p-3.5">
              <h4 className="mb-1.5 text-[14.5px] leading-tight font-semibold">
                {listing.title}
              </h4>
              <div className="flex items-center justify-between text-xs text-ink-soft">
                <span className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                  {listing.wilaya}
                </span>
                <span>{listing.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
