'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ArrowRight, Filter, Sparkles, Check } from 'lucide-react';
import { Look, Item } from '../lib/types';

interface EditDirectoryViewProps {
  looks: Look[];
  onSelectItem: (item: Item, look: Look) => void;
  onSelectLook: (look: Look) => void;
}

export default function EditDirectoryView({
  looks,
  onSelectItem,
  onSelectLook,
}: EditDirectoryViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Extract all items from looks
  const allItemsWithLook: { item: Item; look: Look }[] = [];
  looks.forEach((look) => {
    look.items.forEach((item) => {
      if (item.tier === 'EDIT') {
        allItemsWithLook.push({ item, look });
      }
    });
  });

  const categories = ['ALL', 'Shirt', 'Trousers', 'Shoes', 'Watch', 'Fragrance', 'Accessory', 'Knitwear', 'Jacket', 'Eyewear'];

  const filteredItems = selectedCategory === 'ALL'
    ? allItemsWithLook
    : allItemsWithLook.filter((entry) => entry.item.category === selectedCategory);

  return (
    <div id="edit-directory-page" className="w-full min-h-screen bg-[#1A1611] text-[#E8E0D5] pt-28 pb-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-16">
        {/* Header Title & Curation Thesis */}
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center space-x-3">
            <span className="font-montserrat text-[10px] uppercase tracking-[0.3em] text-[#C9B89A]">
              CURATED EXTERNAL PIECES
            </span>
            <span className="text-[#E8E0D5]/30">·</span>
            <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[#E8E0D5]/60">
              METAMORPHOO STANDARD
            </span>
          </div>

          <h1 className="font-cormorant font-light text-5xl sm:text-7xl uppercase tracking-[0.18em] text-[#E8E0D5] leading-none">
            THE EDIT
          </h1>

          <p className="font-montserrat text-xs sm:text-sm text-[#E8E0D5]/80 font-light leading-relaxed">
            Every piece carrying the <span className="text-[#C9B89A] font-medium">EDIT</span> mark has been audited against uncompromised criteria: natural fibre purity, architectural drape, unbranded quiet prestige, and authentic craftsmanship. This is not an aggregation; it is a seal of taste.
          </p>
        </div>

        {/* Five Curation Pillars Banner */}
        <div className="bg-[#14110E] p-6 sm:p-8 border border-[#E8E0D5]/10 grid grid-cols-1 md:grid-cols-5 gap-6 text-center md:text-left">
          <div className="space-y-1 border-b md:border-b-0 md:border-r border-[#E8E0D5]/10 pb-4 md:pb-0 md:pr-4">
            <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#C9B89A] block">
              01 · FABRIC
            </span>
            <p className="font-montserrat text-[11px] text-[#E8E0D5]/70">
              Strictly natural fibres (silk, linen, virgin wool, cashmere). Zero synthetic sheen.
            </p>
          </div>
          <div className="space-y-1 border-b md:border-b-0 md:border-r border-[#E8E0D5]/10 pb-4 md:pb-0 md:pr-4">
            <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#C9B89A] block">
              02 · SILHOUETTE
            </span>
            <p className="font-montserrat text-[11px] text-[#E8E0D5]/70">
              Relaxed through body, precise through shoulder. Deliberately baggy trousers.
            </p>
          </div>
          <div className="space-y-1 border-b md:border-b-0 md:border-r border-[#E8E0D5]/10 pb-4 md:pb-0 md:pr-4">
            <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#C9B89A] block">
              03 · COLOUR
            </span>
            <p className="font-montserrat text-[11px] text-[#E8E0D5]/70">
              Anchored in Bone, Sand, Near-Black, Midnight Navy, and Burnt Sienna accents.
            </p>
          </div>
          <div className="space-y-1 border-b md:border-b-0 md:border-r border-[#E8E0D5]/10 pb-4 md:pb-0 md:pr-4">
            <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#C9B89A] block">
              04 · ARBITRAGE
            </span>
            <p className="font-montserrat text-[11px] text-[#E8E0D5]/70">
              Perceived textile and tailoring value exceeds retail price significantly.
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#C9B89A] block">
              05 · PROVENANCE
            </span>
            <p className="font-montserrat text-[11px] text-[#E8E0D5]/70">
              Ethical workshops in Portugal, Italy, Spain, England, Japan, and West Africa.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`filter-cat-${cat.toLowerCase()}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-[10px] sm:text-[11px] font-montserrat tracking-[0.22em] uppercase transition-all duration-200 border ${
                selectedCategory === cat
                  ? 'border-[#E8E0D5] bg-[#E8E0D5] text-[#1A1611] font-medium'
                  : 'border-[#E8E0D5]/15 text-[#E8E0D5]/60 hover:border-[#E8E0D5]/40 hover:text-[#E8E0D5]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Editorial Item Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {filteredItems.map(({ item, look }) => (
            <div
              key={item.id}
              id={`edit-item-card-${item.id}`}
              onClick={() => onSelectItem(item, look)}
              className="group cursor-pointer bg-[#14110E] border border-[#E8E0D5]/10 hover:border-[#E8E0D5]/30 transition-all duration-500 flex flex-col"
            >
              {/* Product Editorial Image with EDIT label */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#1A1611]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />

                {/* EDIT Label (Montserrat Regular 9-10px, Mediterranean Sand, Top-Left) */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#C9B89A] bg-[#1A1611]/80 px-2 py-0.5">
                    EDIT
                  </span>
                </div>

                {/* Originating Look Tag */}
                <div className="absolute bottom-3 left-3 right-3 z-10 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLook(look);
                    }}
                    className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[#E8E0D5] bg-[#1A1611]/90 px-2 py-1 hover:text-[#C4623A] transition-colors"
                  >
                    FROM {look.name} →
                  </button>
                </div>
              </div>

              {/* Garment Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[#E8E0D5]/50">
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[#C9B89A]">
                      {item.category}
                    </span>
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.15em]">
                      {item.origin}
                    </span>
                  </div>

                  <h3 className="font-cormorant font-light text-xl text-[#E8E0D5] group-hover:text-[#F5EFE4] transition-colors leading-snug">
                    {item.name}
                  </h3>

                  <p className="font-montserrat text-[11px] text-[#E8E0D5]/60 line-clamp-2 font-light">
                    {item.composition}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8E0D5]/10 flex justify-between items-baseline">
                  <span className="font-montserrat text-xs text-[#E8E0D5] tracking-wider font-medium">
                    ${item.price} USD
                  </span>
                  <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#E8E0D5]/40 group-hover:text-[#C4623A] transition-colors">
                    INSPECT PIECE →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
