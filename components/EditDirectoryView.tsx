'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Filter } from 'lucide-react';
import { Look, Item } from '../lib/types';
import { CURRENCIES, useCurrency } from '../lib/currency';

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
  const currency = useCurrency();
  const currentCurrencyConfig = CURRENCIES[currency] || CURRENCIES.USD;

  // Flatten all items across looks while retaining originating look context
  const allEditItems = looks.flatMap((look) =>
    look.items.map((item) => ({ item, look }))
  );

  const categories = [
    'ALL',
    'Shirt',
    'Trousers',
    'Jacket',
    'Knitwear',
    'Shoes',
    'Accessory',
    'Fragrance',
    'Eyewear',
    'Watch',
  ];

  const filteredItems =
    selectedCategory === 'ALL'
      ? allEditItems
      : allEditItems.filter(({ item }) => item.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 sm:py-20 space-y-16">
      {/* Header Context */}
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center space-x-2">
          <span className="font-montserrat text-[10px] uppercase tracking-[0.28em] text-[#C9B89A]">
            METAMORPHOO CURATORIAL STANDARD
          </span>
        </div>

        <h1 className="font-cormorant font-light text-4xl sm:text-6xl text-[#E8E0D5] uppercase tracking-[0.14em] leading-tight">
          THE EDIT DIRECTORY
        </h1>

        <p className="font-montserrat text-xs sm:text-sm text-[#E8E0D5]/70 font-light leading-relaxed">
          Curated external pieces, filtered by the METAMORPHOO standard. Each garment is sourced from independent heritage mills across Porto, Biella, Kojima, and Lagos. Never assembled into random outfits — every piece belongs to a resolved ensemble.
        </p>

        {/* 5 Curation Standard Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs font-montserrat">
          <div className="p-4 bg-[#14110E] border border-[#E8E0D5]/10 space-y-1.5">
            <span className="text-[#C9B89A] uppercase tracking-[0.2em] text-[9px] block">
              PILLAR 01 · NATURAL FIBRES
            </span>
            <p className="text-[#E8E0D5]/80 font-light">
              Muga silk, raw flax linen, tropical virgin wool. Zero polyester tension.
            </p>
          </div>

          <div className="p-4 bg-[#14110E] border border-[#E8E0D5]/10 space-y-1.5">
            <span className="text-[#C9B89A] uppercase tracking-[0.2em] text-[9px] block">
              PILLAR 02 · UNBRANDED QUIET
            </span>
            <p className="text-[#E8E0D5]/80 font-light">
              No exterior logos, monograms, or overt branding. Form speaks first.
            </p>
          </div>

          <div className="p-4 bg-[#14110E] border border-[#E8E0D5]/10 space-y-1.5">
            <span className="text-[#C9B89A] uppercase tracking-[0.2em] text-[9px] block">
              PILLAR 03 · PROVENANCE
            </span>
            <p className="text-[#E8E0D5]/80 font-light">
              Explicit origin transparency: every piece lists mill, city, and composition.
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="space-y-8">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#E8E0D5]/10">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`filter-cat-${cat}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 font-montserrat text-[10px] uppercase tracking-[0.22em] whitespace-nowrap transition-all duration-200 border ${
                selectedCategory === cat
                  ? 'border-[#E8E0D5] bg-[#E8E0D5] text-[#1A1611] font-medium'
                  : 'border-transparent text-[#E8E0D5]/60 hover:text-[#E8E0D5]'
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
                    {currentCurrencyConfig.format(item.price)}
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
