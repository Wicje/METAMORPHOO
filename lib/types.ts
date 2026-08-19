export type TierType = 'EDIT' | 'ORIGINALS' | 'ATELIER';

export type SeasonCode = 'SEASON_I' | 'ARCHIVE_VAULT';

export interface FitGuidance {
  cut: 'Exaggerated Relaxed' | 'Fluid Architectural' | 'Structured Tailored' | 'Natural Drop';
  modelStats: string; // e.g. "Model is 188cm / 6'2\", wearing Size L for intended fluid stacking"
  drapeWeight: 'Lightweight (180gsm)' | 'Medium Drape (240-300gsm)' | 'Heavyweight Archival (340-420gsm)';
  recommendedSizing: string; // e.g. "True to size for relaxed silhouette. Size down for tailored profile."
  measurementsSummary?: {
    chestOrWaist: string;
    length: string;
    hemOrOpening: string;
  };
}

export interface ProvenanceDetails {
  condition: 'Brand New / Pristine Deadstock' | 'Atelier Curated Standard' | 'Archival Master Piece';
  inspectionBy: 'Ani Chisom & Metamorphoo Curatorial Bureau';
  authenticationStandard: '100% Natural Fibre Integrity · Zero Synthetic Tension';
  packaging: 'Archival Breathable Cotton Travel Garment Case + Cedar Block';
}

export interface Item {
  id: string;
  name: string;
  category: 'Shirt' | 'Trousers' | 'Shoes' | 'Watch' | 'Fragrance' | 'Accessory' | 'Jacket' | 'Knitwear' | 'Eyewear';
  price: number;
  currency: string;
  composition: string;
  tier: 'EDIT' | 'ORIGINALS';
  origin: string;
  silhouette: string;
  image: string;
  detailImages?: string[];
  sizes: string[];
  description: string;
  curationNote: string;
  fitGuidance?: FitGuidance;
  provenance?: ProvenanceDetails;
  isAvailable?: boolean;
  pinLocation: {
    x: number; // Percentage 0 - 100 from left
    y: number; // Percentage 0 - 100 from top
  };
  stockQuantity?: number;
  isSoldOut?: boolean;
}

export interface Look {
  id: string;
  slug: string;
  name: string;
  subName?: string;
  occasion: string;
  paletteDescription: string;
  paletteColors: string[];
  statementQuote: string;
  longThesis: string;
  tier: 'EDIT' | 'ORIGINALS';
  season: string; // e.g. 'Season I: The Inaugural Wardrobe'
  seasonCode: SeasonCode;
  status: 'active' | 'low_stock' | 'vaulted' | 'directory_only';
  allocationNotes?: string;
  oneRuleBroken: string;
  heroImage: string;
  galleryImages: {
    url: string;
    caption: string;
    type: 'full' | 'texture' | 'accessory' | 'second_angle';
  }[];
  items: Item[];
  editionTotal?: number;
  allocatedCount?: number;
  dropTimestamp?: number; // Epoch ms for scheduled drop countdowns
  vipPassword?: string; // Optional password lock for early access drops
}

export interface CartItem {
  id: string;
  item: Item;
  lookId: string;
  lookName: string;
  selectedSize: string;
  quantity: number;
}
