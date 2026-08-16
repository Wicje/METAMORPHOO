export type TierType = 'EDIT' | 'ORIGINALS' | 'ATELIER';

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
  pinLocation: {
    x: number; // Percentage 0 - 100 from left
    y: number; // Percentage 0 - 100 from top
  };
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
  season: string;
  oneRuleBroken: string;
  heroImage: string;
  galleryImages: {
    url: string;
    caption: string;
    type: 'full' | 'texture' | 'accessory' | 'second_angle';
  }[];
  items: Item[];
}

export interface CartItem {
  id: string;
  item: Item;
  lookId: string;
  lookName: string;
  selectedSize: string;
  quantity: number;
}
