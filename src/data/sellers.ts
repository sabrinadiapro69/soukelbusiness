import type { SellerType } from "./listings";

export type Review = {
  author: string;
  rating: number;
  comment: string;
  date: string;
};

export type Seller = {
  id: string;
  name: string;
  type: SellerType;
  avatarEmoji: string;
  description: string;
  city: string;
  memberSince: string;
  transactionsCount: number;
  rating: number;
  reviews: Review[];
};

export const sellers: Seller[] = [
  {
    id: "atelier-nour",
    name: "Atelier Nour",
    type: "pro",
    avatarEmoji: "🫖",
    description:
      "Atelier familial spécialisé dans le cuivre martelé depuis trois générations. Chaque pièce est façonnée et gravée à la main dans notre atelier de Marseille.",
    city: "Marseille",
    memberSince: "mars 2022",
    transactionsCount: 214,
    rating: 4.8,
    reviews: [
      {
        author: "Camille D.",
        rating: 5,
        comment: "Théière magnifique, exactement comme sur les photos.",
        date: "il y a 1 semaine",
      },
      {
        author: "Farid B.",
        rating: 4,
        comment: "Très bon échange, négociation facile et rapide.",
        date: "il y a 3 semaines",
      },
    ],
  },
  {
    id: "maison-zayn",
    name: "Maison Zayn",
    type: "pro",
    avatarEmoji: "🧶",
    description:
      "Sélection de tapis et textiles berbères tissés par des coopératives de femmes artisanes. Chaque achat soutient directement les productrices.",
    city: "Lyon",
    memberSince: "juin 2021",
    transactionsCount: 132,
    rating: 4.9,
    reviews: [
      {
        author: "Julien P.",
        rating: 5,
        comment: "Tapis sublime, vendeur de confiance.",
        date: "il y a 2 semaines",
      },
    ],
  },
  {
    id: "epices-amir",
    name: "Épices Amir",
    type: "pro",
    avatarEmoji: "🌶️",
    description:
      "Grossiste en épices originaires du Maghreb et du Moyen-Orient. Produits sourcés directement auprès de petits producteurs.",
    city: "Paris",
    memberSince: "janvier 2020",
    transactionsCount: 587,
    rating: 4.7,
    reviews: [
      {
        author: "Nora H.",
        rating: 5,
        comment: "Épices très parfumées, envoi rapide.",
        date: "il y a 4 jours",
      },
      {
        author: "Marc L.",
        rating: 4,
        comment: "Bon rapport qualité-prix.",
        date: "il y a 1 mois",
      },
    ],
  },
  {
    id: "sarah-m",
    name: "Sarah M.",
    type: "particulier",
    avatarEmoji: "👡",
    description:
      "Je revends de temps en temps des vêtements et accessoires ramenés de voyage, toujours en très bon état.",
    city: "Toulouse",
    memberSince: "septembre 2023",
    transactionsCount: 9,
    rating: 4.5,
    reviews: [
      {
        author: "Inès T.",
        rating: 4,
        comment: "Vendeuse sympa, prix négocié facilement.",
        date: "il y a 2 semaines",
      },
    ],
  },
  {
    id: "yasmine-b",
    name: "Yasmine B.",
    type: "particulier",
    avatarEmoji: "💍",
    description: "Passionnée de bijoux anciens, je vends quelques pièces de ma collection personnelle.",
    city: "Nice",
    memberSince: "mai 2023",
    transactionsCount: 5,
    rating: 5,
    reviews: [
      {
        author: "Paul V.",
        rating: 5,
        comment: "Bijou conforme, super négociation, vendeuse au top.",
        date: "il y a 1 semaine",
      },
    ],
  },
  {
    id: "amine-k",
    name: "Amine K.",
    type: "particulier",
    avatarEmoji: "🧵",
    description: "Je vends des vêtements traditionnels portés une ou deux fois seulement.",
    city: "Lille",
    memberSince: "novembre 2023",
    transactionsCount: 3,
    rating: 4.3,
    reviews: [],
  },
  {
    id: "hammam-beaute",
    name: "Hammam Beauté",
    type: "pro",
    avatarEmoji: "🧴",
    description:
      "Boutique en ligne dédiée aux cosmétiques traditionnels : savon noir, gommage, huiles essentielles.",
    city: "Paris",
    memberSince: "février 2021",
    transactionsCount: 341,
    rating: 4.6,
    reviews: [
      {
        author: "Sophie M.",
        rating: 5,
        comment: "Produits authentiques, livraison soignée.",
        date: "il y a 5 jours",
      },
    ],
  },
  {
    id: "karim-t",
    name: "Karim T.",
    type: "particulier",
    avatarEmoji: "🏺",
    description: "Amateur d'artisanat marocain, je revends quelques pièces ramenées de mes voyages.",
    city: "Bordeaux",
    memberSince: "juillet 2023",
    transactionsCount: 7,
    rating: 4.7,
    reviews: [
      {
        author: "Élodie R.",
        rating: 5,
        comment: "Plateau magnifique, très bonne négociation sur le prix.",
        date: "il y a 3 jours",
      },
    ],
  },
  {
    id: "nadia-f",
    name: "Nadia F.",
    type: "particulier",
    avatarEmoji: "🏮",
    description: "Je décore ma maison à l'orientale et je revends parfois quelques objets en double.",
    city: "Strasbourg",
    memberSince: "avril 2023",
    transactionsCount: 4,
    rating: 4.5,
    reviews: [],
  },
  {
    id: "bijoux-layla",
    name: "Bijoux Layla",
    type: "pro",
    avatarEmoji: "💎",
    description:
      "Créatrice de bijoux fantaisie inspirés de l'artisanat oriental, fabriqués en petites séries.",
    city: "Marseille",
    memberSince: "octobre 2022",
    transactionsCount: 168,
    rating: 4.8,
    reviews: [
      {
        author: "Chloé F.",
        rating: 5,
        comment: "Bijoux magnifiques, très réactive aux messages.",
        date: "il y a 1 semaine",
      },
    ],
  },
  {
    id: "leila-r",
    name: "Leïla R.",
    type: "particulier",
    avatarEmoji: "🌿",
    description: "Je revends des produits de beauté ramenés de voyage que je n'utilise pas assez vite.",
    city: "Nantes",
    memberSince: "décembre 2023",
    transactionsCount: 2,
    rating: 4,
    reviews: [],
  },
  {
    id: "cuir-fil",
    name: "Cuir & Fil",
    type: "pro",
    avatarEmoji: "👜",
    description:
      "Maroquinerie artisanale en cuir véritable, cousue main selon les techniques traditionnelles marocaines.",
    city: "Lyon",
    memberSince: "août 2020",
    transactionsCount: 402,
    rating: 4.9,
    reviews: [
      {
        author: "Antoine G.",
        rating: 5,
        comment: "Sac superbe, qualité irréprochable.",
        date: "il y a 6 jours",
      },
      {
        author: "Manon S.",
        rating: 5,
        comment: "Deuxième achat chez eux, toujours parfait.",
        date: "il y a 2 mois",
      },
    ],
  },
];
