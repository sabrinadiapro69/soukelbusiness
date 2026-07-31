export type Level = {
  min: number;
  max: number;
  emoji: string;
  label: string;
};

export const LEVELS: Level[] = [
  { min: 0, max: 4, emoji: "🌱", label: "Nouveau vendeur" },
  { min: 5, max: 19, emoji: "🌟", label: "Vendeur confirmé" },
  { min: 20, max: 49, emoji: "🏆", label: "Vendeur expert" },
  { min: 50, max: Infinity, emoji: "👑", label: "Légende du souk" },
];

export function getLevelProgress(transactionsCount: number) {
  const index = LEVELS.findIndex(
    (l) => transactionsCount >= l.min && transactionsCount <= l.max
  );
  const level = LEVELS[index] ?? LEVELS[0];
  const next = LEVELS[index + 1];

  const progress = next
    ? Math.min(
        100,
        Math.round(
          ((transactionsCount - level.min) / (next.min - level.min)) * 100
        )
      )
    : 100;

  return { level, next, progress };
}

export type Badge = {
  emoji: string;
  label: string;
  unlocked: boolean;
};

export function getBadges({
  transactionsCount,
  rating,
  reviewsCount,
  type,
  listingsCount,
}: {
  transactionsCount: number;
  rating: number;
  reviewsCount: number;
  type: "particulier" | "pro";
  listingsCount: number;
}): Badge[] {
  return [
    {
      emoji: "🎉",
      label: "Première vente",
      unlocked: transactionsCount >= 1,
    },
    {
      emoji: "⭐",
      label: "Client premium",
      unlocked: rating >= 4.5 && reviewsCount >= 5,
    },
    {
      emoji: "💼",
      label: "Professionnel vérifié",
      unlocked: type === "pro",
    },
    {
      emoji: "📦",
      label: "Vendeur actif",
      unlocked: listingsCount >= 3,
    },
    {
      emoji: "🔥",
      label: "Habitué du souk",
      unlocked: transactionsCount >= 10,
    },
  ];
}
