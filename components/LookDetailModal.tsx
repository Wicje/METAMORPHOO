'use client';

import React, { useState } from 'react';
import EditorialImage from './EditorialImage';
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
  ZoomIn,
  Lock,
  Unlock,
} from 'lucide-react';
import { Look, Item } from '../lib/types';
import { CURRENCIES, useCurrency } from '../lib/currency';
import { ledgerStore, useLedger } from '../lib/ledger-store';
import { useCurrentTime } from '../lib/time';

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
  const [isLoupeEnabled, setIsLoupeEnabled] = useState(false);
  const [loupePos, setLoupePos] = useState<{ isHovering: boolean; x: number; y: number; px: number; py: number }>({
    isHovering: false,
    x: 0,
    y: 0,
    px: 50,
    py: 50,
  });
  const [enteredVipKey, setEnteredVipKey] = useState('');
  const [isVipUnlocked, setIsVipUnlocked] = useState(false);
  const [vipKeyError, setVipKeyError] = useState(false);
  const currentTime = useCurrentTime();

  const currency = useCurrency();
  const ledger = useLedger();
  const isSaved = look ? ledger.savedLooks.some((l) => l.lookId === look.id) : false;

  if (!look) return null;

  const isDropLocked = Boolean(look.vipPassword && !isVipUnlocked && look.dropTimestamp && currentTime > 0 && look.dropTimestamp > currentTime);

  const handleUnlockVip = (e: React.FormEvent) => {
    e.preventDefault();
    if (look.vipPassword && enteredVipKey.trim().toLowerCase() === look.vipPassword.trim().toLowerCase()) {
      setIsVipUnlocked(true);
      setVipKeyError(false);
    } else {
      setVipKeyError(true);
    }
  };

  const currentCurrencyConfig = CURRENCIES[currency] || CURRENCIES.USD;
  const totalLookPriceUSD = look.items.reduce((sum, it) => sum + it.price, 0);
  const formattedTotalPrice = currentCurrencyConfig.format(totalLookPriceUSD);

  const isVaulted = look.status === 'vaulted';

  const handleAddFullLook = () => {
    if (isVaulted || isDropLocked) return;
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

  const handleMouseMoveLoupe = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const py = Math.max(0, Math.min(100, (y / rect.height) * 100));
    setLoupePos({ isHovering: true, x, y, px, py });
  };

  const images = [
    { url: look.heroImage, caption: 'Hero Look Silhouette', type: 'full' },
    ...look.galleryImages,
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[var(--bg-canvas)]/95 backdrop-blur-xl text-[var(--text-primary)]">
        {/* Top Floating Control Bar */}
        <div className="sticky top-0 left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-12 py-5 bg-[var(--bg-surface)]/90 border-b border-[var(--border-subtle)]">
          <div className="flex items-center space-x-3">
            <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[var(--color-sand)] font-medium">
              {look.season}
            </span>
            <span className="text-[var(--text-muted)]">/</span>
            <span className="font-montserrat text-[10px] uppercase tracking-[0.2em] text-[var(--text-primary)]">
              {look.name}
            </span>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Share / Copy Deep Link */}
            <button
              id="share-look-link-btn"
              onClick={handleShareLook}
              className="flex items-center space-x-1.5 px-3 py-1.5 border border-[var(--border-medium)] text-[var(--text-secondary)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)] transition-all text-[10px] uppercase tracking-[0.2em] font-montserrat"
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
                  ? 'border-[var(--color-rust)] bg-[var(--color-rust)]/10 text-[var(--text-primary)]'
                  : 'border-[var(--border-medium)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]'
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-[var(--color-rust)]" />
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
              className="group flex items-center space-x-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-2 focus:outline-none transition-colors"
            >
              <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] hidden sm:inline-block">
                CLOSE
              </span>
              <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="max-w-7xl mx-auto px-6 sm:px-12 pb-24 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left: Multi-Image Editorial Gallery with Interactive Pins */}
            <div className="lg:col-span-7 space-y-6">
              {/* Main Display Stage with Texture Loupe & Interactive Pins */}
              <div
                className="relative aspect-[3/4] w-full bg-[var(--bg-surface)] overflow-hidden border border-[var(--border-subtle)] group/stage"
                onMouseMove={isLoupeEnabled ? handleMouseMoveLoupe : undefined}
                onMouseLeave={() => setLoupePos((prev) => ({ ...prev, isHovering: false }))}
              >
                <EditorialImage
                  src={images[activeImageIndex]?.url || look.heroImage}
                  alt={look.name}
                  fill
                  priority
                  className="object-cover object-center transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-canvas)]/40 via-transparent to-[var(--bg-canvas)]/10 pointer-events-none" />

                {/* Tactile Texture Loupe Magnifying Lens */}
                {isLoupeEnabled && loupePos.isHovering && (
                  <div
                    style={{
                      left: `${loupePos.x}px`,
                      top: `${loupePos.y}px`,
                    }}
                    className="absolute w-44 h-44 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--color-sand)] shadow-2xl overflow-hidden pointer-events-none z-30 hidden md:block bg-[var(--bg-surface)]"
                  >
                    <div
                      style={{
                        backgroundImage: `url(${images[activeImageIndex]?.url || look.heroImage})`,
                        backgroundPosition: `${loupePos.px}% ${loupePos.py}%`,
                        backgroundSize: '300%',
                        backgroundRepeat: 'no-repeat',
                      }}
                      className="w-full h-full"
                    />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-montserrat text-[7px] uppercase tracking-[0.2em] bg-[var(--bg-surface)]/90 px-1.5 py-0.5 text-[var(--color-sand)] whitespace-nowrap border border-[var(--border-subtle)]">
                      3.0X MACRO WEAVE
                    </div>
                  </div>
                )}

                {/* EDIT or VAULTED or VIP LOCKED mark */}
                <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
                  <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--color-sand)] bg-[var(--bg-surface)]/90 px-2.5 py-1 backdrop-blur-sm border border-[var(--border-subtle)] font-medium">
                    {look.tier}
                  </span>
                  {isVaulted && (
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#F5EFE4] bg-[var(--color-rust)] px-2.5 py-1 flex items-center space-x-1">
                      <Archive className="w-3 h-3" />
                      <span>VAULTED EDITION</span>
                    </span>
                  )}
                  {isDropLocked && (
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#F5EFE4] bg-[var(--color-rust)] px-2.5 py-1 flex items-center space-x-1 font-medium">
                      <Lock className="w-3 h-3" />
                      <span>VIP PRIVATE ALLOCATION</span>
                    </span>
                  )}
                  {look.status === 'low_stock' && !isVaulted && (
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--color-rust)] bg-[var(--bg-surface)]/90 px-2 py-0.5 border border-[var(--color-rust)]/40">
                      FINAL ALLOCATIONS
                    </span>
                  )}
                </div>

                {/* Texture Loupe Toggle Trigger */}
                <div className="absolute top-4 right-4 z-10 hidden md:block">
                  <button
                    onClick={() => setIsLoupeEnabled(!isLoupeEnabled)}
                    className={`px-2.5 py-1 text-[9px] font-montserrat uppercase tracking-[0.2em] flex items-center space-x-1.5 transition-all border ${
                      isLoupeEnabled
                        ? 'bg-[var(--color-sand)] text-[var(--bg-canvas)] border-[var(--color-sand)] font-medium'
                        : 'bg-[var(--bg-surface)]/90 text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
                    }`}
                    title="Toggle high-magnification macro fabric grain loupe"
                  >
                    <ZoomIn className="w-3 h-3" />
                    <span>{isLoupeEnabled ? 'LOUPE ACTIVE' : 'TACTILE LOUPE'}</span>
                  </button>
                </div>

                {/* Interactive Item Pins (Only on Hero image and when loupe is off) */}
                {activeImageIndex === 0 && !isLoupeEnabled && (
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
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-sand)] opacity-40"></span>
                              <span className="relative inline-flex rounded-full h-4 w-4 bg-[var(--bg-surface)] border border-[var(--text-primary)] group-hover:bg-[var(--color-rust)] group-hover:border-[var(--color-rust)] transition-colors items-center justify-center">
                                <span className="w-1.5 h-1.5 bg-[var(--text-primary)] rounded-full group-hover:bg-[#F5EFE4]" />
                              </span>
                            </span>

                            {/* Floating Pin Label Tooltip */}
                            <div
                              className={`absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[var(--bg-surface)]/95 backdrop-blur-md border border-[var(--border-medium)] px-3 py-1.5 pointer-events-none transition-all duration-200 z-30 ${
                                isHovered
                                  ? 'opacity-100 translate-x-0'
                                  : 'opacity-0 -translate-x-2'
                              }`}
                            >
                              <span className="font-montserrat text-[8px] uppercase tracking-[0.25em] text-[var(--color-sand)] block font-medium">
                                {item.category}
                              </span>
                              <span className="font-cormorant text-xs text-[var(--text-primary)] tracking-wider uppercase">
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

              {/* Multi-Angle Gallery Thumbnails */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
                    EDITORIAL ANGLES & TEXTURES ({images.length} FRAMES)
                  </span>
                  <span className="font-montserrat text-[9px] text-[var(--color-sand)] font-medium">
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
                          ? 'border-[var(--text-primary)] opacity-100 ring-1 ring-[var(--text-primary)]'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <EditorialImage
                        src={img.url}
                        alt={img.caption}
                        fill
                        className="object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-[var(--bg-canvas)]/20" />
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
                  <span className="font-montserrat text-[10px] uppercase tracking-[0.28em] text-[var(--color-sand)] font-medium">
                    {look.subName || look.tier}
                  </span>
                  <span className="text-[var(--text-muted)]">·</span>
                  <span className="font-montserrat text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.2em]">
                    {look.occasion.split(',')[0]}
                  </span>
                </div>

                <h1 className="font-cormorant font-light text-4xl sm:text-5xl text-[var(--text-primary)] tracking-[0.16em] uppercase leading-none">
                  {look.name}
                </h1>
              </div>

              {/* Statement Quote & Long Thesis */}
              <div className="space-y-4 border-l border-[var(--border-medium)] pl-5">
                <p className="font-cormorant italic text-xl sm:text-2xl text-[var(--text-primary)] font-light leading-relaxed">
                  &ldquo;{look.statementQuote}&rdquo;
                </p>
                <p className="font-montserrat text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                  {look.longThesis}
                </p>
              </div>

              {/* Allocation & Availability Notice */}
              {look.allocationNotes && (
                <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[10px] font-montserrat tracking-wider text-[var(--text-secondary)]">
                  <span className="text-[var(--color-sand)] uppercase tracking-[0.2em] block mb-1 font-medium">
                    ALLOCATION REGISTRY
                  </span>
                  {look.allocationNotes}
                </div>
              )}

              {/* The One Rule Broken (Signature Metamorphoo Principle) */}
              <div className="bg-[var(--bg-surface)] p-5 border border-[var(--border-subtle)] space-y-2">
                <span className="font-montserrat text-[9px] uppercase tracking-[0.28em] text-[var(--color-rust)] font-medium block">
                  THE RULE BROKEN
                </span>
                <p className="font-montserrat text-xs text-[var(--text-primary)] font-light leading-relaxed">
                  {look.oneRuleBroken}
                </p>
              </div>

              {/* Wardrobe Ensemble Items Breakdown */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                  <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[var(--text-secondary)] font-medium">
                    ENSEMBLE PIECES ({look.items.length})
                  </span>
                  <span className="font-montserrat text-[10px] uppercase tracking-[0.2em] text-[var(--color-sand)] font-medium">
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
                          ? 'border-[var(--text-primary)] bg-[var(--bg-elevated)]'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-medium)]'
                      }`}
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="relative w-11 h-14 bg-[var(--bg-canvas)] flex-shrink-0 overflow-hidden border border-[var(--border-subtle)]">
                          <EditorialImage
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[var(--color-sand)] block font-medium">
                            {item.category} · {item.origin.split('/')[0]}
                          </span>
                          <span className="font-cormorant text-base text-[var(--text-primary)] uppercase tracking-wide">
                            {item.name}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="font-montserrat text-xs text-[var(--text-primary)] tracking-wider font-medium">
                          {currentCurrencyConfig.format(item.price)}
                        </span>
                        <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Ensemble & Shop Full Look CTA */}
              <div className="pt-4 space-y-4 border-t border-[var(--border-subtle)]">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--text-muted)] block">
                      TOTAL ENSEMBLE PRICE ({look.items.length} PIECES)
                    </span>
                    <span className="font-montserrat text-xl text-[var(--text-primary)] tracking-widest font-light">
                      {formattedTotalPrice}
                    </span>
                  </div>
                  <span className="font-montserrat text-[9px] text-[var(--color-sand)] uppercase tracking-[0.2em] font-medium">
                    ALL-INCLUSIVE CURATION
                  </span>
                </div>

                {isDropLocked ? (
                  <form onSubmit={handleUnlockVip} className="p-5 bg-[var(--bg-surface)] border border-[var(--color-rust)]/40 space-y-3">
                    <div className="flex items-center space-x-2 text-[var(--color-rust)]">
                      <Lock className="w-4 h-4" />
                      <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] font-medium">
                        VIP PRIVATE ACCESS LOCKED
                      </span>
                    </div>
                    <p className="font-montserrat text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                      This private capsule look is currently reserved for registered allocation key holders before public drop.
                    </p>
                    <div className="flex gap-2 pt-1">
                      <input
                        type="password"
                        value={enteredVipKey}
                        onChange={(e) => {
                          setEnteredVipKey(e.target.value);
                          setVipKeyError(false);
                        }}
                        placeholder="Enter VIP Allocation Key..."
                        className="flex-1 bg-[var(--bg-canvas)] border border-[var(--border-medium)] px-3 py-2.5 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)]"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[var(--color-rust)] text-[#F5EFE4] font-montserrat text-xs uppercase tracking-[0.2em] font-medium hover:bg-[var(--color-rust)]/90 transition-colors"
                      >
                        UNLOCK
                      </button>
                    </div>
                    {vipKeyError && (
                      <p className="text-[10px] text-red-400 font-montserrat tracking-wider">
                        Invalid VIP Allocation Key. Contact concierge for private invite.
                      </p>
                    )}
                  </form>
                ) : isVaulted ? (
                  <div className="p-4 bg-[var(--bg-surface)] border border-[var(--color-rust)]/40 text-center space-y-2">
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.28em] text-[var(--color-rust)] font-medium block">
                      ARCHIVAL VAULT RECORD
                    </span>
                    <p className="font-montserrat text-xs text-[var(--text-secondary)] font-light">
                      This complete look has completed its official season. Inquiries for private recreation are directed to the Atelier.
                    </p>
                  </div>
                ) : (
                  <button
                    id="shop-full-look-btn"
                    onClick={handleAddFullLook}
                    className="w-full group py-5 px-6 border border-[var(--text-primary)] hover:border-[var(--color-rust)] bg-[var(--bg-surface)] hover:bg-[var(--color-rust)] text-[var(--text-primary)] hover:text-[#F5EFE4] transition-all duration-300 flex items-center justify-center space-x-3 focus:outline-none"
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
