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
          <span className="font-montserrat text-[10px] uppercase tracking-[0.28em] text-[var(--color-sand)] font-medium">
            METAMORPHOO CURATORIAL STANDARD
          </span>
        </div>

        <h1 className="font-cormorant font-light text-4xl sm:text-6xl text-[var(--text-primary)] uppercase tracking-[0.14em] leading-tight">
          THE EDIT DIRECTORY
        </h1>

        <p className="font-montserrat text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
          Curated external pieces, filtered by the METAMORPHOO standard. Each garment is sourced from independent heritage mills across Porto, Biella, Kojima, and Lagos. Never assembled into random outfits — every piece belongs to a resolved ensemble.
        </p>

        {/* 5 Curation Standard Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs font-montserrat">
          <div className="p-4 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] space-y-1.5">
            <span className="text-[var(--color-sand)] uppercase tracking-[0.2em] text-[9px] block font-medium">
              PILLAR 01 · NATURAL FIBRES
            </span>
            <p className="text-[var(--text-secondary)] font-light">
              Muga silk, raw flax linen, tropical virgin wool. Zero polyester tension.
            </p>
          </div>

          <div className="p-4 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] space-y-1.5">
            <span className="text-[var(--color-sand)] uppercase tracking-[0.2em] text-[9px] block font-medium">
              PILLAR 02 · UNBRANDED QUIET
            </span>
            <p className="text-[var(--text-secondary)] font-light">
              No exterior logos, monograms, or overt branding. Form speaks first.
            </p>
          </div>

          <div className="p-4 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] space-y-1.5">
            <span className="text-[var(--color-sand)] uppercase tracking-[0.2em] text-[9px] block font-medium">
              PILLAR 03 · PROVENANCE
            </span>
            <p className="text-[var(--text-secondary)] font-light">
              Explicit origin transparency: every piece lists mill, city, and composition.
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="space-y-8">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none border-b border-[var(--border-subtle)]">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`filter-cat-${cat}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 font-montserrat text-[10px] uppercase tracking-[0.22em] whitespace-nowrap transition-all duration-200 border ${
                selectedCategory === cat
                  ? 'border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-surface)] font-medium'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
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
              className="group cursor-pointer bg-[var(--bg-canvas)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-all duration-500 flex flex-col"
            >
              {/* Product Editorial Image with EDIT label */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--bg-surface)]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />

                {/* EDIT Label (Montserrat Regular 9-10px, Mediterranean Sand, Top-Left) */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--color-sand)] bg-[var(--bg-surface)]/80 px-2 py-0.5 border border-[var(--border-subtle)] font-medium">
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
                    className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[var(--text-primary)] bg-[var(--bg-surface)]/90 px-2 py-1 hover:text-[var(--color-rust)] transition-colors border border-[var(--border-subtle)]"
                  >
                    FROM {look.name} →
                  </button>
                </div>
              </div>

              {/* Garment Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[var(--text-muted)]">
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[var(--color-sand)] font-medium">
                      {item.category}
                    </span>
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.15em] text-[var(--text-secondary)]">
                      {item.origin}
                    </span>
                  </div>

                  <h3 className="font-cormorant font-light text-xl text-[var(--text-primary)] group-hover:text-[var(--color-rust)] transition-colors leading-snug">
                    {item.name}
                  </h3>

                  <p className="font-montserrat text-[11px] text-[var(--text-secondary)] line-clamp-2 font-light">
                    {item.composition}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--border-subtle)] flex justify-between items-baseline">
                  <span className="font-montserrat text-xs text-[var(--text-primary)] tracking-wider font-medium">
                    {currentCurrencyConfig.format(item.price)}
                  </span>
                  <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--text-muted)] group-hover:text-[var(--color-rust)] transition-colors font-medium">
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
