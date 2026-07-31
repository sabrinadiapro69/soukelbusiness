"use client";

import { useRef } from "react";

const items = [
  {
    badge: "Neuf avec étiquette",
    badgeClass: "bg-gold text-[#3A2C05]",
    brand: "Nike · Taille 42",
    title: "Sneakers Air Force 1",
    price: "12 000 DA",
    seller: "karim_dz",
    sellerInitial: "K",
    icon: (
      <path d="M8 4 6 8v11h12V8l-2-4M8 4c0 2 1.8 3 4 3s4-1 4-3M8 4h8" />
    ),
  },
  {
    badge: "Très bon état",
    badgeClass: "bg-[#DCE7D9] text-[#1E3A24]",
    brand: "Zara · Taille M",
    title: "Robe de soirée bleu nuit",
    price: "3 500 DA",
    seller: "lina_oran",
    sellerInitial: "L",
    icon: <path d="M7 8V5a5 5 0 0 1 10 0v3M4 8h16l-1 13H5L4 8Z" />,
  },
  {
    badge: "Bon état",
    badgeClass: "bg-[#DCE7D9] text-[#1E3A24]",
    brand: "Guess · Taille unique",
    title: "Sac à main bandoulière",
    price: "6 000 DA",
    seller: "sarah.mode",
    sellerInitial: "S",
    icon: <path d="M4 10h16v9H4z M8 10V7a4 4 0 0 1 8 0v3" />,
  },
  {
    badge: "Très bon état",
    badgeClass: "bg-[#DCE7D9] text-[#1E3A24]",
    brand: "Homme · Taille L",
    title: "Veste en cuir marron",
    price: "8 500 DA",
    seller: "yacine_style",
    sellerInitial: "Y",
    icon: (
      <path d="M6 8 3 6l3-4h12l3 4-3 2M6 8v13h12V8M6 8l3-2M18 8l-3-2" />
    ),
  },
  {
    badge: "Neuf",
    badgeClass: "bg-gold text-[#3A2C05]",
    brand: "Traditionnel · Taille S",
    title: "Ensemble Karakou brodé",
    price: "22 000 DA",
    seller: "amel.couture",
    sellerInitial: "A",
    icon: <path d="M12 3c3 2 6 2 6 6s-3 4-3 8H9c0-4-3-4-3-8s3-4 6-6Z" />,
  },
];

export default function DressingScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 460, behavior: "smooth" });
  };

  return (
    <div>
      <div className="mb-2 flex justify-end gap-2">
        <button
          onClick={() => scroll(-1)}
          aria-label="Précédent"
          className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-line bg-paper"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={() => scroll(1)}
          aria-label="Suivant"
          className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-line bg-paper"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {items.map((item) => (
          <div
            key={item.title}
            className="w-[220px] shrink-0 overflow-hidden rounded-xl border border-line bg-paper"
            style={{ scrollSnapAlign: "start" }}
          >
            <div className="relative flex aspect-[3/4] items-center justify-center bg-bg-alt">
              <span
                className={`absolute top-2.5 left-2.5 rounded px-2.5 py-1 text-[10px] font-bold tracking-wide ${item.badgeClass}`}
              >
                {item.badge}
              </span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                className="w-[42%] opacity-30"
              >
                {item.icon}
              </svg>
            </div>
            <div className="p-3.5">
              <div className="text-xs font-semibold tracking-wide text-ink-soft uppercase">
                {item.brand}
              </div>
              <div className="mt-0.5 mb-2 text-sm font-semibold">
                {item.title}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[15px] font-semibold text-accent-dark">
                  {item.price}
                </span>
                <span className="flex items-center gap-1.5 text-[11.5px] text-ink-soft">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[9.5px] font-bold text-white">
                    {item.sellerInitial}
                  </span>
                  {item.seller}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
