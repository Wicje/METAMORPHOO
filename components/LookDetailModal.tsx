'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Check, Sparkles, ChevronRight, Layers } from 'lucide-react';
import { Look, Item } from '../lib/types';

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

  if (!look) return null;

  const totalLookPrice = look.items.reduce((sum, it) => sum + it.price, 0);

  const handleAddFullLook = () => {
    onShopFullLook(look);
    setFullLookAdded(true);
    setTimeout(() => setFullLookAdded(false), 3000);
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
              LOOK DETAIL
            </span>
            <span className="text-[#E8E0D5]/30">/</span>
            <span className="font-montserrat text-[10px] uppercase tracking-[0.2em] text-[#E8E0D5]">
              {look.name}
            </span>
          </div>

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

        {/* Modal Content Body */}
        <div className="max-w-7xl mx-auto px-6 sm:px-12 pb-24 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left: Multi-Image Editorial Gallery (3-5 Images) with Interactive Pins */}
            <div className="lg:col-span-7 space-y-6">
              {/* Main Display Stage */}
              <div className="relative aspect-[3/4] w-full bg-[#14110E] overflow-hidden">
                <Image
                  src={images[activeImageIndex].url}
                  alt={look.name}
                  fill
                  priority
                  className="object-cover object-center transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1611]/60 via-transparent to-[#1A1611]/20 pointer-events-none" />

                {/* EDIT mark */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#C9B89A] bg-[#1A1611]/80 px-2 py-1">
                    {look.tier}
                  </span>
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
                          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group/pin"
                        >
                          <button
                            id={`pin-${item.id}`}
                            onClick={() => onSelectItem(item, look)}
                            onMouseEnter={() => setHoveredItemId(item.id)}
                            onMouseLeave={() => setHoveredItemId(null)}
                            className={`relative flex items-center justify-center transition-transform ${
                              isHovered ? 'scale-125' : 'scale-100 hover:scale-110'
                            }`}
                            aria-label={`View ${item.name}`}
                          >
                            <span
                              className={`w-3.5 h-3.5 rounded-full border border-[#E8E0D5] flex items-center justify-center transition-all ${
                                isHovered
                                  ? 'bg-[#C4623A] border-[#C4623A]'
                                  : 'bg-[#1A1611]/80 backdrop-blur-sm'
                              }`}
                            >
                              <span className="w-1 h-1 rounded-full bg-[#E8E0D5]" />
                            </span>
                            {/* Ambient ripple when active */}
                            {isHovered && (
                              <span className="absolute inset-0 rounded-full animate-ping bg-[#C4623A]/40" />
                            )}
                          </button>

                          {/* Hover Tooltip Card */}
                          <div
                            className={`absolute left-5 top-1/2 -translate-y-1/2 z-20 whitespace-nowrap bg-[#1A1611]/95 border border-[#E8E0D5]/20 p-2.5 shadow-2xl transition-all duration-300 pointer-events-none ${
                              isHovered
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 -translate-x-2'
                            }`}
                          >
                            <p className="font-cormorant text-sm text-[#E8E0D5] font-light">
                              {item.name}
                            </p>
                            <p className="font-montserrat text-[10px] text-[#C9B89A] uppercase tracking-[0.18em]">
                              ${item.price} USD · {item.category}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Current Image Caption */}
                <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-end pointer-events-none">
                  <p className="font-montserrat text-[10px] uppercase tracking-[0.2em] text-[#E8E0D5]/80 bg-[#1A1611]/70 px-2.5 py-1">
                    {images[activeImageIndex].caption}
                  </p>
                  <span className="font-montserrat text-[9px] tracking-[0.25em] text-[#E8E0D5]/60 bg-[#1A1611]/70 px-2 py-1">
                    0{activeImageIndex + 1} / 0{images.length}
                  </span>
                </div>
              </div>

              {/* Gallery Thumbnail Strip (3-5 Images: full body, texture, accessory, second angle) */}
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    id={`gallery-thumb-${i}`}
                    onClick={() => setActiveImageIndex(i)}
                    className={`relative aspect-[3/4] bg-[#14110E] overflow-hidden focus:outline-none transition-all ${
                      activeImageIndex === i
                        ? 'ring-1 ring-[#E8E0D5] opacity-100'
                        : 'opacity-50 hover:opacity-85'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.caption}
                      fill
                      className="object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-1 left-1 z-10">
                      <span className="font-montserrat text-[8px] uppercase tracking-[0.15em] text-[#E8E0D5] bg-[#1A1611]/80 px-1 py-0.5">
                        {img.type}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Look Thesis, Interactive Item List, and Complete Look Decision */}
            <div className="lg:col-span-5 space-y-8">
              {/* Header Titles */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-[#C9B89A]">
                    {look.season}
                  </span>
                  <span className="text-[#E8E0D5]/30">·</span>
                  <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#E8E0D5]/60">
                    {look.occasion}
                  </span>
                </div>

                <h1 className="font-cormorant font-light text-4xl sm:text-5xl text-[#E8E0D5] uppercase tracking-[0.16em]">
                  {look.name}
                </h1>

                {/* Statement Quote: Cormorant Italic, small */}
                <p className="font-cormorant italic text-lg sm:text-xl text-[#E8E0D5]/90 border-l border-[#C9B89A]/40 pl-4 py-0.5">
                  &ldquo;{look.statementQuote}&rdquo;
                </p>
              </div>

              {/* Thesis Paragraph */}
              <div className="space-y-3">
                <p className="font-montserrat text-xs text-[#E8E0D5]/70 leading-relaxed font-light">
                  {look.longThesis}
                </p>
                {/* One Rule Broken Principle Callout */}
                <div className="bg-[#14110E] p-4 border border-[#E8E0D5]/10 space-y-1">
                  <div className="flex items-center space-x-1.5 text-[#C4623A]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] font-medium">
                      THE ONE-RULE-BROKEN
                    </span>
                  </div>
                  <p className="font-montserrat text-[11px] text-[#E8E0D5]/80 italic">
                    {look.oneRuleBroken}
                  </p>
                </div>
              </div>

              {/* Interactive Item List (Hover spotlights pin on image) */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center pb-2 border-b border-[#E8E0D5]/10">
                  <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[#E8E0D5]/60">
                    COMPONENTS ({look.items.length} PIECES)
                  </span>
                  <span className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[#C9B89A]">
                    HOVER TO LOCATE
                  </span>
                </div>

                <div className="space-y-2">
                  {look.items.map((item) => {
                    const isHovered = hoveredItemId === item.id;
                    return (
                      <div
                        key={item.id}
                        id={`look-detail-item-${item.id}`}
                        onMouseEnter={() => {
                          setHoveredItemId(item.id);
                          if (activeImageIndex !== 0) setActiveImageIndex(0);
                        }}
                        onMouseLeave={() => setHoveredItemId(null)}
                        className={`group p-3 transition-all duration-300 flex items-center justify-between border cursor-pointer ${
                          isHovered
                            ? 'bg-[#14110E] border-[#C9B89A]/50 translate-x-1'
                            : 'bg-transparent border-[#E8E0D5]/10 hover:border-[#E8E0D5]/30'
                        }`}
                        onClick={() => onSelectItem(item, look)}
                      >
                        <div className="space-y-0.5 max-w-[70%]">
                          <div className="flex items-center space-x-2">
                            <span className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[#C9B89A]">
                              {item.category}
                            </span>
                            <span className="text-[#E8E0D5]/30 text-[9px]">·</span>
                            <span className="font-montserrat text-[9px] uppercase tracking-[0.15em] text-[#E8E0D5]/40">
                              {item.tier}
                            </span>
                          </div>
                          <p className="font-cormorant text-base sm:text-lg text-[#E8E0D5] font-light leading-snug group-hover:text-[#F5EFE4]">
                            {item.name}
                          </p>
                          <p className="font-montserrat text-[10px] text-[#E8E0D5]/50 truncate">
                            {item.composition}
                          </p>
                        </div>

                        <div className="text-right space-y-1">
                          <p className="font-montserrat text-xs text-[#E8E0D5] tracking-wider">
                            ${item.price}
                          </p>
                          <div className="flex items-center space-x-1 text-[#E8E0D5]/40 group-hover:text-[#C4623A] transition-colors justify-end">
                            <span className="font-montserrat text-[9px] uppercase tracking-[0.2em]">
                              DETAILS
                            </span>
                            <ChevronRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Purchase Decision Actions */}
              <div className="space-y-4 pt-4 border-t border-[#E8E0D5]/10">
                {/* Primary: Shop the Full Look */}
                <div className="bg-[#14110E] p-5 border border-[#E8E0D5]/15 space-y-4">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[#C9B89A] block">
                        THE COMPLETE DECISION
                      </span>
                      <span className="font-cormorant text-xl text-[#E8E0D5]">
                        Full Wardrobe Ensemble
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-montserrat text-sm sm:text-base text-[#E8E0D5] tracking-wider block font-medium">
                        ${totalLookPrice.toLocaleString()} USD
                      </span>
                      <span className="font-montserrat text-[9px] text-[#E8E0D5]/50 uppercase tracking-[0.15em]">
                        All {look.items.length} items
                      </span>
                    </div>
                  </div>

                  <button
                    id="shop-full-look-btn"
                    onClick={handleAddFullLook}
                    className="w-full relative group py-3.5 px-6 border border-[#E8E0D5] hover:border-[#C4623A] bg-[#1A1611] hover:bg-[#C4623A] text-[#E8E0D5] hover:text-[#F5EFE4] transition-all duration-300 flex items-center justify-center space-x-3 focus:outline-none"
                  >
                    {fullLookAdded ? (
                      <>
                        <Check className="w-4 h-4 text-[#F5EFE4]" />
                        <span className="font-montserrat text-xs uppercase tracking-[0.25em] font-medium">
                          FULL LOOK ADDED TO WARDROBE
                        </span>
                      </>
                    ) : (
                      <>
                        <Layers className="w-4 h-4" />
                        <span className="font-montserrat text-xs uppercase tracking-[0.25em] font-medium">
                          SHOP THE FULL LOOK
                        </span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <p className="font-montserrat text-[10px] text-center text-[#E8E0D5]/50 uppercase tracking-[0.18em]">
                    Includes all {look.items.length} tailored components · Complimentary private courier
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
