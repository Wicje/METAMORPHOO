'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ArrowRight,
  Check,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  Share2,
  Archive,
} from 'lucide-react';
import { Look, Item } from '../lib/types';
import { CURRENCIES, useCurrency } from '../lib/currency';
import { ledgerStore, useLedger } from '../lib/ledger-store';

interface LookDetailModalProps {
  look: Look | null;
  onClose: () => void;
  onSelectItem: (item: Item, look: Look) => void;
  onShopFullLook: (look: Look) => void;
}

export default function LookDetailModal({
  look,
  onClose,
  onSelectItem,
  onShopFullLook,
}: LookDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [fullLookAdded, setFullLookAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const currency = useCurrency();
  const ledger = useLedger();
  const isSaved = look ? ledger.savedLooks.some((l) => l.lookId === look.id) : false;

  if (!look) return null;

  const currentCurrencyConfig = CURRENCIES[currency] || CURRENCIES.USD;
  const totalLookPriceUSD = look.items.reduce((sum, it) => sum + it.price, 0);
  const formattedTotalPrice = currentCurrencyConfig.format(totalLookPriceUSD);

  const isVaulted = look.status === 'vaulted';

  const handleAddFullLook = () => {
    if (isVaulted) return;
    onShopFullLook(look);
    setFullLookAdded(true);
    setTimeout(() => setFullLookAdded(false), 3000);
  };

  const handleToggleSaveLook = () => {
    ledgerStore.toggleSaveLook(look.id);
  };

  const handleShareLook = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/?look=${look.slug}`;
      navigator.clipboard?.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const images = [
    { url: look.heroImage, caption: 'Hero Look Silhouette', type: 'full' },
    ...look.galleryImages,
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1A1611]/95 backdrop-blur-xl">
        {/* Top Floating Control Bar */}
        <div className="sticky top-0 left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-12 py-5 bg-gradient-to-b from-[#1A1611] to-transparent">
          <div className="flex items-center space-x-3">
            <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[#C9B89A]">
              {look.season}
            </span>
            <span className="text-[#E8E0D5]/30">/</span>
            <span className="font-montserrat text-[10px] uppercase tracking-[0.2em] text-[#E8E0D5]">
              {look.name}
            </span>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Share / Copy Deep Link */}
            <button
              id="share-look-link-btn"
              onClick={handleShareLook}
              className="flex items-center space-x-1.5 px-3 py-1.5 border border-[#E8E0D5]/20 text-[#E8E0D5]/70 hover:border-[#E8E0D5]/60 hover:text-[#E8E0D5] transition-all text-[10px] uppercase tracking-[0.2em] font-montserrat"
              title="Copy editorial deep-link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline-block">{copiedLink ? 'LINK COPIED' : 'SHARE LOOK'}</span>
            </button>

            {/* Save to Private Ledger */}
            <button
              id="save-look-to-ledger-btn"
              onClick={handleToggleSaveLook}
              className={`flex items-center space-x-1.5 px-3 py-1.5 border transition-all text-[10px] uppercase tracking-[0.2em] font-montserrat ${
                isSaved
                  ? 'border-[#C4623A] bg-[#C4623A]/10 text-[#F5EFE4]'
                  : 'border-[#E8E0D5]/20 text-[#E8E0D5]/70 hover:border-[#E8E0D5]/60'
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-[#C4623A]" />
                  <span className="hidden sm:inline-block">SAVED TO LEDGER</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline-block">SAVE TO LEDGER</span>
                </>
              )}
            </button>

            <button
              id="close-look-detail-btn"
              onClick={onClose}
              className="group flex items-center space-x-2 text-[#E8E0D5]/70 hover:text-[#E8E0D5] p-2 focus:outline-none transition-colors"
            >
              <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] hidden sm:inline-block">
                CLOSE
              </span>
              <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="max-w-7xl mx-auto px-6 sm:px-12 pb-24 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left: Multi-Image Editorial Gallery with Interactive Pins */}
            <div className="lg:col-span-7 space-y-6">
              {/* Main Display Stage */}
              <div className="relative aspect-[3/4] w-full bg-[#14110E] overflow-hidden">
                <Image
                  src={images[activeImageIndex]?.url || look.heroImage}
                  alt={look.name}
                  fill
                  priority
                  className="object-cover object-center transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1611]/60 via-transparent to-[#1A1611]/20 pointer-events-none" />

                {/* EDIT or VAULTED mark */}
                <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
                  <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#C9B89A] bg-[#1A1611]/80 px-2.5 py-1 backdrop-blur-sm">
                    {look.tier}
                  </span>
                  {isVaulted && (
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#E8E0D5] bg-[#C4623A]/90 px-2.5 py-1 flex items-center space-x-1">
                      <Archive className="w-3 h-3" />
                      <span>VAULTED EDITION</span>
                    </span>
                  )}
                  {look.status === 'low_stock' && (
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#C4623A] bg-[#1A1611]/90 px-2 py-0.5 border border-[#C4623A]/30">
                      FINAL ALLOCATIONS
                    </span>
                  )}
                </div>

                {/* Interactive Item Pins (Only on Hero image) */}
                {activeImageIndex === 0 && (
                  <div className="absolute inset-0 pointer-events-none">
                    {look.items.map((item) => {
                      const isHovered = hoveredItemId === item.id;
                      return (
                        <div
                          key={item.id}
                          style={{
                            left: `${item.pinLocation.x}%`,
                            top: `${item.pinLocation.y}%`,
                          }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                        >
                          <button
                            id={`pin-item-${item.id}`}
                            onClick={() => onSelectItem(item, look)}
                            onMouseEnter={() => setHoveredItemId(item.id)}
                            onMouseLeave={() => setHoveredItemId(null)}
                            aria-label={`Inspect ${item.name}`}
                            className="group relative flex items-center justify-center p-2 focus:outline-none"
                          >
                            <span className="relative flex h-4 w-4">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8E0D5] opacity-40"></span>
                              <span className="relative inline-flex rounded-full h-4 w-4 bg-[#1A1611] border border-[#E8E0D5] group-hover:bg-[#C4623A] group-hover:border-[#C4623A] transition-colors items-center justify-center">
                                <span className="w-1.5 h-1.5 bg-[#E8E0D5] rounded-full group-hover:bg-[#F5EFE4]" />
                              </span>
                            </span>

                            {/* Floating Pin Label Tooltip */}
                            <div
                              className={`absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#1A1611]/95 backdrop-blur-md border border-[#E8E0D5]/20 px-3 py-1.5 pointer-events-none transition-all duration-200 z-30 ${
                                isHovered
                                  ? 'opacity-100 translate-x-0'
                                  : 'opacity-0 -translate-x-2'
                              }`}
                            >
                              <span className="font-montserrat text-[8px] uppercase tracking-[0.25em] text-[#C9B89A] block">
                                {item.category}
                              </span>
                              <span className="font-cormorant text-xs text-[#E8E0D5] tracking-wider uppercase">
                                {item.name}
                              </span>
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Multi-Angle Gallery Thumbnails (3-5 required images) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#E8E0D5]/50">
                    EDITORIAL ANGLES & TEXTURES ({images.length} FRAMES)
                  </span>
                  <span className="font-montserrat text-[9px] text-[#C9B89A]">
                    {images[activeImageIndex]?.caption}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      id={`gallery-thumb-${idx}`}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative aspect-[3/4] overflow-hidden transition-all duration-300 border ${
                        activeImageIndex === idx
                          ? 'border-[#E8E0D5] opacity-100 ring-1 ring-[#E8E0D5]'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={img.caption}
                        fill
                        className="object-cover object-center"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-[#1A1611]/20" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Look Hierarchy & Complete The Ensemble */}
            <div className="lg:col-span-5 space-y-8">
              {/* Season & Look Designation */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-montserrat text-[10px] uppercase tracking-[0.28em] text-[#C9B89A]">
                    {look.subName || look.tier}
                  </span>
                  <span className="text-[#E8E0D5]/30">·</span>
                  <span className="font-montserrat text-[10px] text-[#E8E0D5]/60 uppercase tracking-[0.2em]">
                    {look.occasion.split(',')[0]}
                  </span>
                </div>

                <h1 className="font-cormorant font-light text-4xl sm:text-5xl text-[#E8E0D5] tracking-[0.16em] uppercase leading-none">
                  {look.name}
                </h1>
              </div>

              {/* Statement Quote & Long Thesis */}
              <div className="space-y-4 border-l border-[#E8E0D5]/20 pl-5">
                <p className="font-cormorant italic text-xl sm:text-2xl text-[#E8E0D5]/90 font-light leading-relaxed">
                  &ldquo;{look.statementQuote}&rdquo;
                </p>
                <p className="font-montserrat text-xs text-[#E8E0D5]/70 font-light leading-relaxed">
                  {look.longThesis}
                </p>
              </div>

              {/* Allocation & Availability Notice */}
              {look.allocationNotes && (
                <div className="p-3.5 bg-[#14110E] border border-[#E8E0D5]/15 text-[10px] font-montserrat tracking-wider text-[#E8E0D5]/80">
                  <span className="text-[#C9B89A] uppercase tracking-[0.2em] block mb-1">
                    ALLOCATION REGISTRY
                  </span>
                  {look.allocationNotes}
                </div>
              )}

              {/* The One Rule Broken (Signature Metamorphoo Principle) */}
              <div className="bg-[#14110E] p-5 border border-[#E8E0D5]/15 space-y-2">
                <span className="font-montserrat text-[9px] uppercase tracking-[0.28em] text-[#C4623A] font-medium block">
                  THE RULE BROKEN
                </span>
                <p className="font-montserrat text-xs text-[#E8E0D5]/90 font-light leading-relaxed">
                  {look.oneRuleBroken}
                </p>
              </div>

              {/* Wardrobe Ensemble Items Breakdown */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8E0D5]/15">
                  <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[#E8E0D5]/70">
                    ENSEMBLE PIECES ({look.items.length})
                  </span>
                  <span className="font-montserrat text-[10px] uppercase tracking-[0.2em] text-[#C9B89A]">
                    TAP PIECE TO INSPECT
                  </span>
                </div>

                <div className="space-y-2">
                  {look.items.map((item) => (
                    <button
                      key={item.id}
                      id={`inspect-item-row-${item.id}`}
                      onClick={() => onSelectItem(item, look)}
                      onMouseEnter={() => setHoveredItemId(item.id)}
                      onMouseLeave={() => setHoveredItemId(null)}
                      className={`w-full text-left p-3.5 transition-all duration-300 flex items-center justify-between border ${
                        hoveredItemId === item.id
                          ? 'border-[#E8E0D5] bg-[#14110E]'
                          : 'border-[#E8E0D5]/10 bg-[#1A1611] hover:border-[#E8E0D5]/30'
                      }`}
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="relative w-11 h-14 bg-[#14110E] flex-shrink-0 overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <span className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[#C9B89A] block">
                            {item.category} · {item.origin.split('/')[0]}
                          </span>
                          <span className="font-cormorant text-base text-[#E8E0D5] uppercase tracking-wide">
                            {item.name}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="font-montserrat text-xs text-[#E8E0D5] tracking-wider">
                          {currentCurrencyConfig.format(item.price)}
                        </span>
                        <ChevronRight className="w-4 h-4 text-[#E8E0D5]/40" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Ensemble & Shop Full Look CTA */}
              <div className="pt-4 space-y-4 border-t border-[#E8E0D5]/15">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#E8E0D5]/50 block">
                      TOTAL ENSEMBLE PRICE ({look.items.length} PIECES)
                    </span>
                    <span className="font-montserrat text-xl text-[#E8E0D5] tracking-widest font-light">
                      {formattedTotalPrice}
                    </span>
                  </div>
                  <span className="font-montserrat text-[9px] text-[#C9B89A] uppercase tracking-[0.2em]">
                    ALL-INCLUSIVE CURATION
                  </span>
                </div>

                {isVaulted ? (
                  <div className="p-4 bg-[#14110E] border border-[#C4623A]/40 text-center space-y-2">
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.28em] text-[#C4623A] font-medium block">
                      ARCHIVAL VAULT RECORD
                    </span>
                    <p className="font-montserrat text-xs text-[#E8E0D5]/80 font-light">
                      This complete look has completed its official season. Inquiries for private recreation are directed to the Atelier.
                    </p>
                  </div>
                ) : (
                  <button
                    id="shop-full-look-btn"
                    onClick={handleAddFullLook}
                    className="w-full group py-5 px-6 border border-[#E8E0D5] hover:border-[#C4623A] bg-[#1A1611] hover:bg-[#C4623A] text-[#E8E0D5] hover:text-[#F5EFE4] transition-all duration-300 flex items-center justify-center space-x-3 focus:outline-none"
                  >
                    {fullLookAdded ? (
                      <>
                        <Check className="w-4 h-4 text-[#F5EFE4]" />
                        <span className="font-montserrat text-xs uppercase tracking-[0.28em] font-medium">
                          FULL LOOK ADDED TO WARDROBE
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="font-montserrat text-xs uppercase tracking-[0.28em] font-medium">
                          SHOP THE FULL LOOK
                        </span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
