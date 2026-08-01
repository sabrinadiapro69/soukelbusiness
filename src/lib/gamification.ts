export type Level = {
  min: number;
  max: number;
  emoji: string;
  label: string;
};

const LEVEL_DATA: Omit<Level, "label">[] = [
  { min: 0, max: 4, emoji: "🌱" },
  { min: 5, max: 19, emoji: "🌟" },
  { min: 20, max: 49, emoji: "🏆" },
  { min: 50, max: Infinity, emoji: "👑" },
];

export function getLevelProgress(transactionsCount: number, labels: string[]) {
  const index = LEVEL_DATA.findIndex(
    (l) => transactionsCount >= l.min && transactionsCount <= l.max
  );
  const data = LEVEL_DATA[index] ?? LEVEL_DATA[0];
  const level: Level = { ...data, label: labels[index] ?? labels[0] };
  const nextData = LEVEL_DATA[index + 1];
  const next: Level | undefined = nextData
    ? { ...nextData, label: labels[index + 1] }
    : undefined;

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

export function getBadges(
  {
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
  },
  labels: string[]
): Badge[] {
  return [
    {
      emoji: "🎉",
      label: labels[0],
      unlocked: transactionsCount >= 1,
    },
    {
      emoji: "⭐",
      label: labels[1],
      unlocked: rating >= 4.5 && reviewsCount >= 5,
    },
    {
      emoji: "💼",
      label: labels[2],
      unlocked: type === "pro",
    },
    {
      emoji: "📦",
      label: labels[3],
      unlocked: listingsCount >= 3,
    },
    {
      emoji: "🔥",
      label: labels[4],
      unlocked: transactionsCount >= 10,
    },
  ];
}
