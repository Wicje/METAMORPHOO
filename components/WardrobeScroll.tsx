'use client';

import React, { useState, useEffect } from 'react';
import EditorialImage from './EditorialImage';
import { motion } from 'motion/react';
import { ChevronDown, ArrowRight, Eye, Lock, Clock } from 'lucide-react';
import { Look, Item } from '../lib/types';
import { useCurrentTime } from '../lib/time';

interface WardrobeScrollProps {
  looks: Look[];
  onSelectLook: (look: Look) => void;
  onSelectItem: (item: Item, look: Look) => void;
  onShopFullLook: (look: Look) => void;
}

function formatCountdown(targetMs: number) {
  const diff = targetMs - Date.now();
  if (diff <= 0) return 'AVAILABLE NOW';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${days.toString().padStart(2, '0')}D : ${hours.toString().padStart(2, '0')}H : ${mins.toString().padStart(2, '0')}M`;
}

export default function WardrobeScroll({
  looks,
  onSelectLook,
  onSelectItem,
  onShopFullLook,
}: WardrobeScrollProps) {
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const currentTime = useCurrentTime();

  const scrollToLook = (index: number) => {
    const el = document.getElementById(`look-section-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main id="wardrobe-scroll-container" className="relative w-full bg-[#1A1611]">
      {/* Side Look Indicator (Desktop) */}
      <aside
        id="wardrobe-nav-indicator"
        className="fixed right-6 lg:right-10 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center space-y-4"
      >
        <span className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-[#E8E0D5]/40 rotate-90 mb-4 origin-center">
          WARDROBE
        </span>
        {looks.map((look, idx) => (
          <button
            key={look.id}
            id={`look-indicator-${idx}`}
            onClick={() => scrollToLook(idx)}
            title={look.name}
            className="group relative flex items-center p-1 focus:outline-none"
          >
            <span
              className={`block transition-all duration-300 ${
                activeLookIndex === idx
                  ? 'w-6 h-[2px] bg-[#E8E0D5]'
                  : 'w-2 h-[1px] bg-[#E8E0D5]/30 group-hover:bg-[#E8E0D5]/70'
              }`}
            />
            {/* Tooltip on hover */}
            <span className="absolute right-8 font-montserrat text-[10px] tracking-[0.2em] uppercase text-[#E8E0D5] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-[#1A1611]/80 px-2 py-0.5 pointer-events-none">
              {look.name}
            </span>
          </button>
        ))}
      </aside>

      {/* Looks Full Bleed Viewports */}
      {looks.map((look, index) => {
        const isFutureDrop = Boolean(look.dropTimestamp && look.dropTimestamp > currentTime);
        return (
          <section
            key={look.id}
            id={`look-section-${index}`}
            className="relative w-full h-screen min-h-[640px] flex items-center justify-center overflow-hidden snap-start"
            onMouseEnter={() => setActiveLookIndex(index)}
          >
            {/* Background Full-Bleed Editorial Image */}
            <div className="absolute inset-0 z-0">
              <EditorialImage
                src={look.heroImage}
                alt={look.name}
                fill
                priority={index === 0}
                className="object-cover object-center transform scale-100 transition-transform duration-1000 ease-out"
              />
              {/* Cinematic Vignette / Deep Anchor ground gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1611]/90 via-[#1A1611]/45 to-[#1A1611]/50" />
              <div className="absolute inset-0 bg-radial from-transparent via-[#1A1611]/20 to-[#1A1611]/70" />
            </div>

            {/* Look Tier Mark & Season Tag (Top corners) */}
            <div className="absolute top-24 left-6 sm:left-12 z-10 flex items-center space-x-3">
              <span className="font-montserrat text-[9px] sm:text-[10px] tracking-[0.25em] text-[#C9B89A] uppercase">
                {look.tier}
              </span>
              <span className="text-[#E8E0D5]/30 text-xs">·</span>
              <span className="font-montserrat text-[9px] sm:text-[10px] tracking-[0.2em] text-[#E8E0D5]/60 uppercase">
                {look.subName || `Look 0${index + 1}`}
              </span>
              {isFutureDrop && (
                <span className="hidden sm:inline-flex items-center space-x-1.5 font-montserrat text-[8px] uppercase tracking-[0.25em] text-[#F5EFE4] bg-[#C4623A] px-2 py-0.5">
                  <Clock className="w-2.5 h-2.5" />
                  <span>DROPPING IN {formatCountdown(look.dropTimestamp!)}</span>
                </span>
              )}
              {look.vipPassword && (
                <span className="hidden sm:inline-flex items-center space-x-1 font-montserrat text-[8px] uppercase tracking-[0.2em] text-[#C9B89A] bg-[#1A1611]/80 px-2 py-0.5 border border-[#C9B89A]/30">
                  <Lock className="w-2.5 h-2.5" />
                  <span>VIP ALLOCATION</span>
                </span>
              )}
            </div>

            {/* MΦ Monogram at bottom right */}
            <div className="absolute bottom-8 right-6 sm:right-12 z-10 hidden sm:block">
              <span className="font-serif-luxury text-sm tracking-[0.3em] text-[#E8E0D5]/30 select-none">
                MΦ
              </span>
            </div>

            {/* Center Editorial Composition */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center justify-center mt-12 sm:mt-8">
              {/* Statement Quote */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-cormorant italic text-sm sm:text-base md:text-lg text-[#E8E0D5]/80 mb-3 sm:mb-4 tracking-wide max-w-lg"
              >
                &ldquo;{look.statementQuote}&rdquo;
              </motion.p>

              {/* Look Name: Cormorant Light, 80-120px (48-64px mobile), Bone on Deep Anchor */}
              <motion.h1
                id={`look-title-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.3 }}
                onClick={() => onSelectLook(look)}
                className="cursor-pointer group font-cormorant font-light text-4xl sm:text-6xl md:text-7xl lg:text-[90px] xl:text-[100px] text-[#E8E0D5] uppercase tracking-[0.18em] leading-tight select-none transition-all duration-300 hover:text-[#F5EFE4]"
              >
                {look.name}
              </motion.h1>

              {/* Item List: Montserrat Regular, 11-12px, lowercase, generous line height */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.45 }}
                className="mt-6 sm:mt-8 flex flex-col items-center space-y-1.5 text-center"
              >
                <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[#E8E0D5]/80 font-montserrat text-[11px] sm:text-[12px] font-normal leading-relaxed lowercase">
                  {look.items.map((item, itemIdx) => (
                    <React.Fragment key={item.id}>
                      <button
                        id={`item-link-${item.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectItem(item, look);
                        }}
                        className="group/item inline-flex items-center hover:text-[#F5EFE4] transition-colors"
                      >
                        <span className="relative">
                          {item.name}
                          <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-transparent group-hover/item:bg-[#C9B89A] transition-colors" />
                        </span>
                      </button>
                      {itemIdx < look.items.length - 1 && (
                        <span className="text-[#E8E0D5]/30">/</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </motion.div>

              {/* SHOP THE LOOK CTA: Montserrat caps, tracked out, NO filled button — type only, thin underline on hover, Burnt Sienna on hover exclusively */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-6"
              >
                <button
                  id={`shop-look-cta-${index}`}
                  onClick={() => onSelectLook(look)}
                  className="group relative font-montserrat text-[11px] sm:text-[12px] uppercase tracking-[0.28em] text-[#E8E0D5] transition-colors duration-300 py-1.5 focus:outline-none inline-flex items-center space-x-2"
                >
                  <span className="group-hover:text-[#C4623A] transition-colors">
                    SHOP THE LOOK
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E8E0D5] group-hover:text-[#C4623A] transform transition-transform group-hover:translate-x-1" />
                  <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-transparent group-hover:bg-[#C4623A] transition-colors duration-300" />
                </button>

                <span className="hidden sm:inline-block text-[#E8E0D5]/30 text-xs">|</span>

                <button
                  id={`inspect-look-btn-${index}`}
                  onClick={() => onSelectLook(look)}
                  className="group font-montserrat text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#E8E0D5]/60 hover:text-[#E8E0D5] transition-colors py-1 inline-flex items-center space-x-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>VIEW EDITORIAL</span>
                </button>
              </motion.div>
            </div>

            {/* Scroll down hint for next look */}
            {index < looks.length - 1 && (
              <button
                id={`scroll-down-hint-${index}`}
                onClick={() => scrollToLook(index + 1)}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center space-y-1 text-[#E8E0D5]/40 hover:text-[#E8E0D5] transition-colors focus:outline-none"
                aria-label="Scroll to next look"
              >
                <span className="font-montserrat text-[9px] uppercase tracking-[0.25em]">
                  NEXT
                </span>
                <ChevronDown className="w-4 h-4 animate-bounce" />
              </button>
            )}
          </section>
        );
      })}
    </main>
  );
}
