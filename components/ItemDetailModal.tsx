'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeft, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { Item, Look } from '../lib/types';

interface ItemDetailModalProps {
  item: Item | null;
  originatingLook: Look | null;
  onClose: () => void;
  onReturnToLook: (look: Look) => void;
  onAddToWardrobe: (item: Item, lookName: string, selectedSize: string) => void;
}

export default function ItemDetailModal({
  item,
  originatingLook,
  onClose,
  onReturnToLook,
  onAddToWardrobe,
}: ItemDetailModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>(item?.sizes[0] || 'Standard');
  const [added, setAdded] = useState(false);

  if (!item) return null;

  const handleAdd = () => {
    onAddToWardrobe(item, originatingLook?.name || 'Metamorphoo Edit', selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1A1611]/95 backdrop-blur-xl">
        {/* Top Control Bar */}
        <div className="sticky top-0 left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-12 py-5 bg-gradient-to-b from-[#1A1611] to-transparent">
          {originatingLook ? (
            <button
              id="back-to-originating-look-btn"
              onClick={() => onReturnToLook(originatingLook)}
              className="group flex items-center space-x-2 text-[#E8E0D5]/70 hover:text-[#E8E0D5] transition-colors focus:outline-none"
            >
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              <span className="font-montserrat text-[10px] uppercase tracking-[0.25em]">
                BACK TO {originatingLook.name}
              </span>
            </button>
          ) : (
            <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[#C9B89A]">
              METAMORPHOO PIECE
            </span>
          )}

          <button
            id="close-item-modal-btn"
            onClick={onClose}
            className="group flex items-center space-x-2 text-[#E8E0D5]/70 hover:text-[#E8E0D5] p-2 focus:outline-none transition-colors"
          >
            <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] hidden sm:inline-block">
              CLOSE
            </span>
            <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
          </button>
        </div>

        {/* Garment Showcase (Minimal, Spacious, Garment Breathes) */}
        <div className="max-w-6xl mx-auto px-6 sm:px-12 py-6 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
            {/* Left: Clean Editorial Image */}
            <div className="md:col-span-6 relative aspect-[3/4] bg-[#14110E] overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                priority
                className="object-cover object-center"
                referrerPolicy="no-referrer"
              />

              {/* EDIT Label (Top-Left, Montserrat 9-10px, Mediterranean Sand) */}
              {item.tier === 'EDIT' ? (
                <div className="absolute top-4 left-4 z-10">
                  <span className="font-montserrat text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#C9B89A] bg-[#1A1611]/80 px-2.5 py-1">
                    EDIT
                  </span>
                </div>
              ) : (
                /* ORIGINALS Monogram (Bottom-Right, MΦ Hairline Bone) */
                <div className="absolute bottom-4 right-4 z-10">
                  <span className="font-cormorant text-base tracking-[0.3em] text-[#E8E0D5]/80 bg-[#1A1611]/80 px-2 py-0.5">
                    MΦ ORIGINALS
                  </span>
                </div>
              )}
            </div>

            {/* Right: Garment Typography & Addition */}
            <div className="md:col-span-6 space-y-7">
              {/* Category & Tier */}
              <div className="flex items-center space-x-3">
                <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[#C9B89A]">
                  {item.category}
                </span>
                <span className="text-[#E8E0D5]/30">·</span>
                <span className="font-montserrat text-[10px] uppercase tracking-[0.2em] text-[#E8E0D5]/60">
                  {item.origin}
                </span>
              </div>

              {/* Name: Cormorant Light */}
              <h1 className="font-cormorant font-light text-3xl sm:text-4xl lg:text-5xl text-[#E8E0D5] uppercase tracking-[0.14em] leading-tight">
                {item.name}
              </h1>

              {/* Price */}
              <div className="font-montserrat text-lg text-[#E8E0D5] tracking-widest">
                ${item.price} <span className="text-xs text-[#E8E0D5]/60">{item.currency}</span>
              </div>

              {/* Description */}
              <p className="font-montserrat text-xs text-[#E8E0D5]/80 font-light leading-relaxed">
                {item.description}
              </p>

              {/* Silhouette / Fit Structure */}
              <div className="space-y-1.5 pt-2">
                <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#E8E0D5]/50 block">
                  SILHOUETTE & PROPORTION
                </span>
                <p className="font-montserrat text-xs text-[#E8E0D5]/70">
                  {item.silhouette}
                </p>
              </div>

              {/* Material Composition: Montserrat, small, muted */}
              <div className="space-y-1.5 pt-2 border-t border-[#E8E0D5]/10">
                <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#E8E0D5]/50 block">
                  MATERIAL COMPOSITION
                </span>
                <p className="font-montserrat text-xs text-[#E8E0D5]/90 tracking-wide font-normal">
                  {item.composition}
                </p>
              </div>

              {/* Size Selection */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[#E8E0D5]/60">
                    SELECT SIZE
                  </span>
                  <span className="font-montserrat text-[9px] text-[#C9B89A] uppercase tracking-[0.2em]">
                    TAILORED CUT
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.sizes.map((size) => (
                    <button
                      key={size}
                      id={`size-btn-${size}`}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-xs font-montserrat tracking-widest uppercase transition-all duration-200 border ${
                        selectedSize === size
                          ? 'border-[#E8E0D5] bg-[#E8E0D5] text-[#1A1611] font-medium'
                          : 'border-[#E8E0D5]/20 text-[#E8E0D5]/70 hover:border-[#E8E0D5]/60'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to Wardrobe (not "Add to Cart" — language matters) */}
              <div className="pt-4 space-y-4">
                <button
                  id="add-to-wardrobe-btn"
                  onClick={handleAdd}
                  className="w-full group py-4 px-6 border border-[#E8E0D5] hover:border-[#C4623A] bg-[#1A1611] hover:bg-[#C4623A] text-[#E8E0D5] hover:text-[#F5EFE4] transition-all duration-300 flex items-center justify-center space-x-3 focus:outline-none"
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 text-[#F5EFE4]" />
                      <span className="font-montserrat text-xs uppercase tracking-[0.28em] font-medium">
                        ADDED TO WARDROBE
                      </span>
                    </>
                  ) : (
                    <span className="font-montserrat text-xs uppercase tracking-[0.28em] font-medium">
                      ADD TO WARDROBE
                    </span>
                  )}
                </button>

                {/* Complete the Look link back to originating look */}
                {originatingLook && (
                  <button
                    id="complete-the-look-btn"
                    onClick={() => onReturnToLook(originatingLook)}
                    className="w-full text-center font-montserrat text-[10px] uppercase tracking-[0.25em] text-[#C9B89A] hover:text-[#E8E0D5] transition-colors py-2"
                  >
                    ← COMPLETE THE LOOK WITH {originatingLook.name}
                  </button>
                )}
              </div>

              {/* Footer Curation Note: Selected by METAMORPHOO. Curated to standard. */}
              <div className="pt-4 border-t border-[#E8E0D5]/10 flex items-center space-x-2 text-[#E8E0D5]/50">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9B89A]" />
                <p className="font-montserrat text-[10px] italic">
                  {item.curationNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
