export type SellerType = "particulier" | "pro";

export type Listing = {
  id: number;
  title: string;
  price: number;
  category: string;
  sellerType: SellerType;
  sellerName: string;
  location: string;
  postedAt: string;
  emoji: string;
  description: string;
};

export const categories = [
  "Toutes catégories",
  "Artisanat",
  "Mode & Textile",
  "Épicerie fine",
  "Maison & Déco",
  "Bijoux",
  "Beauté",
];

export const listings: Listing[] = [
  {
    id: 1,
    title: "Théière en cuivre gravée",
    price: 45,
    category: "Maison & Déco",
    sellerType: "pro",
    sellerName: "Atelier Nour",
    location: "Marseille",
    postedAt: "il y a 2h",
    emoji: "🫖",
    description:
      "Théière artisanale en cuivre martelé, gravée à la main selon un savoir-faire traditionnel. Contenance 1L, idéale pour le thé à la menthe. Livrée avec son coffret.",
  },
  {
    id: 2,
    title: "Tapis berbère fait main",
    price: 180,
    category: "Maison & Déco",
    sellerType: "pro",
    sellerName: "Maison Zayn",
    location: "Lyon",
    postedAt: "il y a 5h",
    emoji: "🧶",
    description:
      "Tapis berbère tissé main en laine naturelle, motifs authentiques. Dimensions 200x140cm. Pièce unique, chaque tapis diffère légèrement de par sa fabrication artisanale.",
  },
  {
    id: 3,
    title: "Coffret d'épices du souk",
    price: 22,
    category: "Épicerie fine",
    sellerType: "pro",
    sellerName: "Épices Amir",
    location: "Paris",
    postedAt: "hier",
    emoji: "🌶️",
    description:
      "Coffret de 8 épices sélectionnées directement au souk : ras el hanout, cumin, paprika fumé, curcuma et plus encore. Idéal pour découvrir les saveurs orientales.",
  },
  {
    id: 4,
    title: "Babouches brodées, peu portées",
    price: 18,
    category: "Mode & Textile",
    sellerType: "particulier",
    sellerName: "Sarah M.",
    location: "Toulouse",
    postedAt: "il y a 1h",
    emoji: "👡",
    description:
      "Babouches brodées taille 38, portées seulement deux fois. Très bon état, ramenées d'un voyage au Maroc. Vente pour cause de taille non adaptée.",
  },
  {
    id: 5,
    title: "Collier argent ciselé",
    price: 60,
    category: "Bijoux",
    sellerType: "particulier",
    sellerName: "Yasmine B.",
    location: "Nice",
    postedAt: "il y a 3h",
    emoji: "💍",
    description:
      "Collier en argent massif ciselé à la main, motifs berbères traditionnels. Bijou de famille en excellent état, vendu avec son certificat d'authenticité.",
  },
  {
    id: 6,
    title: "Kaftan brodé, taille M",
    price: 35,
    category: "Mode & Textile",
    sellerType: "particulier",
    sellerName: "Amine K.",
    location: "Lille",
    postedAt: "il y a 4h",
    emoji: "🧵",
    description:
      "Kaftan brodé main, taille M, porté une seule fois pour une occasion spéciale. Couleur bordeaux, broderies dorées. Nettoyé à sec, prêt à porter.",
  },
  {
    id: 7,
    title: "Savon noir traditionnel x3",
    price: 12,
    category: "Beauté",
    sellerType: "pro",
    sellerName: "Hammam Beauté",
    location: "Paris",
    postedAt: "il y a 6h",
    emoji: "🧴",
    description:
      "Lot de 3 savons noirs traditionnels à l'huile d'olive, parfaits pour le gommage au hammam. Fabrication artisanale, sans additifs chimiques.",
  },
  {
    id: 8,
    title: "Plateau marocain artisanal",
    price: 55,
    category: "Artisanat",
    sellerType: "particulier",
    sellerName: "Karim T.",
    location: "Bordeaux",
    postedAt: "il y a 30 min",
    emoji: "🏺",
    description:
      "Plateau en laiton ciselé, diamètre 45cm, avec ses pieds pliants en bois. Rapporté du souk de Marrakech, jamais utilisé, toujours dans son emballage d'origine.",
  },
  {
    id: 9,
    title: "Lanterne marocaine en fer forgé",
    price: 40,
    category: "Maison & Déco",
    sellerType: "particulier",
    sellerName: "Nadia F.",
    location: "Strasbourg",
    postedAt: "il y a 8h",
    emoji: "🏮",
    description:
      "Lanterne en fer forgé et verre coloré, hauteur 35cm. Parfaite pour une ambiance orientale à la bougie ou avec une guirlande LED.",
  },
  {
    id: 10,
    title: "Coffret bijoux fantaisie x5",
    price: 28,
    category: "Bijoux",
    sellerType: "pro",
    sellerName: "Bijoux Layla",
    location: "Marseille",
    postedAt: "il y a 1 jour",
    emoji: "💎",
    description:
      "Coffret de 5 bijoux fantaisie assortis (bracelets et boucles d'oreilles), inspiration orientale. Idéal pour compléter une tenue ou offrir en cadeau.",
  },
  {
    id: 11,
    title: "Huile d'argan pure 100ml",
    price: 15,
    category: "Beauté",
    sellerType: "particulier",
    sellerName: "Leïla R.",
    location: "Nantes",
    postedAt: "il y a 2 jours",
    emoji: "🌿",
    description:
      "Flacon d'huile d'argan pure 100ml, rapportée directement du Maroc, pressée à froid. Entamée à environ 10%, vendue car j'en ai reçu deux en double.",
  },
  {
    id: 12,
    title: "Sac en cuir cousu main",
    price: 75,
    category: "Mode & Textile",
    sellerType: "pro",
    sellerName: "Cuir & Fil",
    location: "Lyon",
    postedAt: "il y a 3 jours",
    emoji: "👜",
    description:
      "Sac en cuir véritable, cousu main selon les techniques traditionnelles marocaines. Doublure en coton, fermoir en laiton. Existe en plusieurs coloris sur demande.",
  },
];
