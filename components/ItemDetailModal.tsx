'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ArrowLeft,
  Check,
  ShieldCheck,
  Ruler,
  FileBadge,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import { Item, Look } from '../lib/types';
import { CURRENCIES, useCurrency } from '../lib/currency';
import { ledgerStore, useLedger } from '../lib/ledger-store';

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
  const [activeTab, setActiveTab] = useState<'details' | 'fit' | 'provenance'>('details');

  const currency = useCurrency();
  const ledger = useLedger();
  const isSaved = item ? ledger.savedItems.some((i) => i.itemId === item.id) : false;

  if (!item) return null;

  const currentCurrencyConfig = CURRENCIES[currency] || CURRENCIES.USD;
  const formattedPrice = currentCurrencyConfig.format(item.price);

  const handleAdd = () => {
    onAddToWardrobe(item, originatingLook?.name || 'Metamorphoo Edit', selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleToggleSave = () => {
    ledgerStore.toggleSaveItem(item.id, originatingLook?.id || 'general', originatingLook?.name || 'Metamorphoo Edit');
  };

  const isVaulted = originatingLook?.status === 'vaulted';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[var(--bg-canvas)]/95 backdrop-blur-xl text-[var(--text-primary)]">
        {/* Top Control Bar */}
        <div className="sticky top-0 left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-12 py-5 bg-[var(--bg-surface)]/90 border-b border-[var(--border-subtle)]">
          {originatingLook ? (
            <button
              id="back-to-originating-look-btn"
              onClick={() => onReturnToLook(originatingLook)}
              className="group flex items-center space-x-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors focus:outline-none"
            >
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              <span className="font-montserrat text-[10px] uppercase tracking-[0.25em]">
                BACK TO {originatingLook.name}
              </span>
            </button>
          ) : (
            <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[var(--color-sand)] font-medium">
              METAMORPHOO PIECE
            </span>
          )}

          <div className="flex items-center space-x-4">
            {/* Save to Private Ledger */}
            <button
              id="save-item-to-ledger-btn"
              onClick={handleToggleSave}
              className={`flex items-center space-x-1.5 px-3 py-1.5 border transition-all text-[10px] uppercase tracking-[0.2em] font-montserrat ${
                isSaved
                  ? 'border-[var(--color-rust)] bg-[var(--color-rust)]/10 text-[var(--text-primary)]'
                  : 'border-[var(--border-medium)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]'
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-[var(--color-rust)]" />
                  <span>SAVED TO LEDGER</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>RECORD IN LEDGER</span>
                </>
              )}
            </button>

            <button
              id="close-item-modal-btn"
              onClick={onClose}
              className="group flex items-center space-x-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-2 focus:outline-none transition-colors"
            >
              <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] hidden sm:inline-block">
                CLOSE
              </span>
              <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
            </button>
          </div>
        </div>

        {/* Garment Showcase */}
        <div className="max-w-6xl mx-auto px-6 sm:px-12 py-6 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
            {/* Left: Clean Editorial Image */}
            <div className="md:col-span-6 relative aspect-[3/4] bg-[var(--bg-surface)] overflow-hidden sticky top-28 border border-[var(--border-subtle)]">
              <Image
                src={item.image}
                alt={item.name}
                fill
                priority
                className="object-cover object-center"
                referrerPolicy="no-referrer"
              />

              {/* Status or Tier Badge */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                {item.tier === 'EDIT' ? (
                  <span className="font-montserrat text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[var(--color-sand)] bg-[var(--bg-surface)]/90 px-2.5 py-1 backdrop-blur-sm border border-[var(--border-subtle)] font-medium">
                    EDIT
                  </span>
                ) : (
                  <span className="font-cormorant text-base tracking-[0.3em] text-[var(--text-primary)] bg-[var(--bg-surface)]/90 px-2.5 py-1 border border-[var(--border-subtle)]">
                    MΦ ORIGINALS
                  </span>
                )}
                {isVaulted && (
                  <span className="font-montserrat text-[8px] uppercase tracking-[0.25em] text-[#F5EFE4] bg-[var(--color-rust)] px-2 py-0.5">
                    VAULTED EDITION
                  </span>
                )}
              </div>
            </div>

            {/* Right: Garment Architecture & Inspectors */}
            <div className="md:col-span-6 space-y-7">
              {/* Category & Origin */}
              <div className="flex items-center space-x-3">
                <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[var(--color-sand)] font-medium">
                  {item.category}
                </span>
                <span className="text-[var(--text-muted)]">·</span>
                <span className="font-montserrat text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                  {item.origin}
                </span>
              </div>

              {/* Name */}
              <h1 className="font-cormorant font-light text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] uppercase tracking-[0.14em] leading-tight">
                {item.name}
              </h1>

              {/* Price & Currency Note */}
              <div className="space-y-1">
                <div className="font-montserrat text-xl text-[var(--text-primary)] tracking-widest font-light">
                  {formattedPrice}
                </div>
                <div className="font-montserrat text-[9px] text-[var(--text-muted)] tracking-wider">
                  {currentCurrencyConfig.gatewayNote}
                </div>
              </div>

              {/* Navigational Sub-Tabs for Fit & Provenance Protocol */}
              <div className="flex border-b border-[var(--border-subtle)] pt-2">
                <button
                  id="tab-item-details"
                  onClick={() => setActiveTab('details')}
                  className={`py-2 px-3 font-montserrat text-[10px] uppercase tracking-[0.22em] transition-colors relative ${
                    activeTab === 'details' ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  PIECE DETAILS
                  {activeTab === 'details' && (
                    <motion.div layoutId="itemTab" className="absolute bottom-0 left-0 right-0 h-[1px] bg-[var(--text-primary)]" />
                  )}
                </button>

                <button
                  id="tab-item-fit"
                  onClick={() => setActiveTab('fit')}
                  className={`py-2 px-3 font-montserrat text-[10px] uppercase tracking-[0.22em] transition-colors relative flex items-center space-x-1.5 ${
                    activeTab === 'fit' ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Ruler className="w-3 h-3 text-[var(--color-sand)]" />
                  <span>FIT & DRAPE</span>
                  {activeTab === 'fit' && (
                    <motion.div layoutId="itemTab" className="absolute bottom-0 left-0 right-0 h-[1px] bg-[var(--text-primary)]" />
                  )}
                </button>

                <button
                  id="tab-item-provenance"
                  onClick={() => setActiveTab('provenance')}
                  className={`py-2 px-3 font-montserrat text-[10px] uppercase tracking-[0.22em] transition-colors relative flex items-center space-x-1.5 ${
                    activeTab === 'provenance' ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <FileBadge className="w-3 h-3 text-[var(--color-sand)]" />
                  <span>PROVENANCE</span>
                  {activeTab === 'provenance' && (
                    <motion.div layoutId="itemTab" className="absolute bottom-0 left-0 right-0 h-[1px] bg-[var(--text-primary)]" />
                  )}
                </button>
              </div>

              {/* Tab 1: Standard Details */}
              {activeTab === 'details' && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Description */}
                  <p className="font-montserrat text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                    {item.description}
                  </p>

                  {/* Silhouette */}
                  <div className="space-y-1.5">
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--text-muted)] block">
                      SILHOUETTE & PROPORTION
                    </span>
                    <p className="font-montserrat text-xs text-[var(--text-secondary)]">
                      {item.silhouette}
                    </p>
                  </div>

                  {/* Material Composition */}
                  <div className="space-y-1.5 pt-2 border-t border-[var(--border-subtle)]">
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--text-muted)] block">
                      MATERIAL COMPOSITION
                    </span>
                    <p className="font-montserrat text-xs text-[var(--text-primary)] tracking-wide font-normal">
                      {item.composition}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Tab 2: Fit & Drape Protocol */}
              {activeTab === 'fit' && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-5 bg-[var(--bg-surface)] p-5 border border-[var(--border-subtle)]"
                >
                  <div className="space-y-1">
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--color-sand)] font-medium">
                      CUT CLASSIFICATION
                    </span>
                    <p className="font-montserrat text-xs text-[var(--text-primary)] font-medium">
                      {item.fitGuidance?.cut || 'Tailored Architectural Drop'}
                    </p>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-[var(--border-subtle)]">
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--color-sand)] font-medium">
                      DRAPE DENSITY & FABRIC WEIGHT
                    </span>
                    <p className="font-montserrat text-xs text-[var(--text-secondary)]">
                      {item.fitGuidance?.drapeWeight || '320gsm Heavyweight Archival'}
                    </p>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-[var(--border-subtle)]">
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--color-sand)] font-medium">
                      EDITORIAL MODEL SPECIFICATIONS
                    </span>
                    <p className="font-montserrat text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                      {item.fitGuidance?.modelStats || 'Model is 187cm / 6\'1.5", 76kg, wearing Size L for natural drop.'}
                    </p>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-[var(--border-subtle)]">
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--color-sand)] font-medium">
                      SIZING DIRECTIVE
                    </span>
                    <p className="font-montserrat text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                      {item.fitGuidance?.recommendedSizing || 'Take your standard size for intentional volume.'}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Tab 3: Provenance & Condition Certificate */}
              {activeTab === 'provenance' && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-5 bg-[var(--bg-surface)] p-5 border border-[var(--border-subtle)]"
                >
                  <div className="space-y-1">
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--color-sand)] font-medium">
                      PIECE CONDITION & INTEGRITY
                    </span>
                    <p className="font-montserrat text-xs text-[var(--text-primary)] font-medium">
                      {item.provenance?.condition || 'Brand New / Pristine Deadstock'}
                    </p>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-[var(--border-subtle)]">
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--color-sand)] font-medium">
                      AUTHENTICATION & INSPECTION
                    </span>
                    <p className="font-montserrat text-xs text-[var(--text-secondary)]">
                      {item.provenance?.inspectionBy || 'Ani Chisom & Metamorphoo Curatorial Bureau'}
                    </p>
                    <p className="font-montserrat text-[10px] text-[var(--text-muted)] italic">
                      Zero synthetic tension · Hand-verified grain and welt integrity.
                    </p>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-[var(--border-subtle)]">
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--color-sand)] font-medium">
                      DISPATCH PACKAGING
                    </span>
                    <p className="font-montserrat text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                      {item.provenance?.packaging || 'Archival Breathable Cotton Travel Garment Case + Cedar Block'}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Size Selection */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
                    SELECT SIZE
                  </span>
                  <span className="font-montserrat text-[9px] text-[var(--color-sand)] uppercase tracking-[0.2em] font-medium">
                    TAILORED CUT
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.sizes.map((size) => (
                    <button
                      key={size}
                      id={`size-btn-${size}`}
                      disabled={isVaulted}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-xs font-montserrat tracking-widest uppercase transition-all duration-200 border ${
                        selectedSize === size
                          ? 'border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-canvas)] font-semibold'
                          : 'border-[var(--border-medium)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]'
                      } ${isVaulted ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to Wardrobe or Inquire for Vaulted */}
              <div className="pt-4 space-y-4">
                {isVaulted ? (
                  <div className="space-y-3">
                    <div className="p-4 bg-[var(--bg-surface)] border border-[var(--color-rust)]/40 text-center space-y-1.5">
                      <span className="font-montserrat text-[9px] uppercase tracking-[0.28em] text-[var(--color-rust)] block font-medium">
                        VAULTED ARCHIVAL EDITION
                      </span>
                      <p className="font-montserrat text-xs text-[var(--text-secondary)] font-light">
                        This look is archived. Retained in the permanent register. Inquire for private ATELIER bespoke re-commission.
                      </p>
                    </div>
                    <button
                      onClick={() => onReturnToLook(originatingLook!)}
                      className="w-full py-4 border border-[var(--border-medium)] text-[var(--text-primary)] font-montserrat text-xs uppercase tracking-[0.25em] hover:border-[var(--text-primary)] transition-colors"
                    >
                      INQUIRE VIA ATELIER CONCIERGE
                    </button>
                  </div>
                ) : (
                  <button
                    id="add-to-wardrobe-btn"
                    onClick={handleAdd}
                    className="w-full group py-4 px-6 border border-[var(--text-primary)] hover:border-[var(--color-rust)] bg-[var(--bg-surface)] hover:bg-[var(--color-rust)] text-[var(--text-primary)] hover:text-[#F5EFE4] transition-all duration-300 flex items-center justify-center space-x-3 focus:outline-none"
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
                )}

                {/* Complete the Look link */}
                {originatingLook && (
                  <button
                    id="complete-the-look-btn"
                    onClick={() => onReturnToLook(originatingLook)}
                    className="w-full text-center font-montserrat text-[10px] uppercase tracking-[0.25em] text-[var(--color-sand)] hover:text-[var(--text-primary)] transition-colors py-2"
                  >
                    ← COMPLETE THE LOOK WITH {originatingLook.name}
                  </button>
                )}
              </div>

              {/* Footer Curation Note */}
              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center space-x-2 text-[var(--text-muted)]">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-sand)]" />
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
