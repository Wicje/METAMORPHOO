'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Trash2,
  Check,
  ArrowRight,
  ShieldCheck,
  Package,
  MessageCircle,
  Copy,
  ExternalLink,
  Sparkles,
  Phone,
} from 'lucide-react';
import { CartItem } from '../lib/types';
import { CURRENCIES, useCurrency } from '../lib/currency';
import {
  CONCIERGE_CONFIG,
  buildAllocationManifestText,
  getWhatsAppUrl,
  saveAllocationLocally,
  AllocationPayload,
} from '../lib/concierge';

interface WardrobeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onClearWardrobe: () => void;
}

export default function WardrobeDrawer({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  onClearWardrobe,
}: WardrobeDrawerProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [allocationComplete, setAllocationComplete] = useState(false);
  const [allocationRefNumber, setAllocationRefNumber] = useState('');
  const [copiedManifest, setCopiedManifest] = useState(false);
  const [lastManifestText, setLastManifestText] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'courier' | 'white_glove'>('courier');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currency = useCurrency();

  // Customer form inputs
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientNotes, setClientNotes] = useState('');

  const currentCurrencyConfig = CURRENCIES[currency] || CURRENCIES.USD;

  // Group items by look name
  const groupedByLook: { [lookName: string]: CartItem[] } = {};
  cartItems.forEach((ci) => {
    if (!groupedByLook[ci.lookName]) {
      groupedByLook[ci.lookName] = [];
    }
    groupedByLook[ci.lookName].push(ci);
  });

  const subtotalUSD = cartItems.reduce(
    (sum, ci) => sum + ci.item.price * ci.quantity,
    0
  );
  const courierFeeUSD = deliveryMethod === 'white_glove' ? 120 : 0;
  const totalUSD = subtotalUSD + courierFeeUSD;
  const formattedTotal = currentCurrencyConfig.format(totalUSD);

  const handleInitiateAllocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    const generatedRef = `MΦ-ALLOC-${Math.floor(100000 + Math.random() * 900000)}`;
    setAllocationRefNumber(generatedRef);

    const payload: AllocationPayload = {
      reference: generatedRef,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim(),
      clientAddress: clientAddress.trim(),
      notes: clientNotes.trim(),
      items: cartItems,
      currency,
      subtotalUSD,
      totalUSD,
      formattedTotal,
      deliveryMethod,
      timestamp: Date.now(),
    };

    const manifestText = buildAllocationManifestText(payload);
    setLastManifestText(manifestText);

    // 1. Save to local storage for persistent client record
    saveAllocationLocally(payload);

    // 2. Post to lightweight serverless storage
    try {
      await fetch('/api/concierge/allocation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('API ledger logging error, client local storage intact', err);
    }

    setIsSubmitting(false);
    setAllocationComplete(true);

    // 3. Launch WhatsApp Concierge in new window with manifest
    const waUrl = getWhatsAppUrl(manifestText);
    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopyManifest = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard && lastManifestText) {
      navigator.clipboard.writeText(lastManifestText);
      setCopiedManifest(true);
      setTimeout(() => setCopiedManifest(false), 2500);
    }
  };

  const handleResetAndClose = () => {
    onClearWardrobe();
    setIsCheckingOut(false);
    setAllocationComplete(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#14110E]/80 backdrop-blur-md"
        />

        {/* Drawer Panel */}
        <motion.aside
          id="wardrobe-drawer-panel"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="absolute right-0 top-0 bottom-0 w-full max-w-xl bg-[var(--bg-canvas)] border-l border-[var(--border-subtle)] flex flex-col justify-between shadow-2xl overflow-y-auto text-[var(--text-primary)]"
        >
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-[var(--border-subtle)] flex items-center justify-between sticky top-0 bg-[var(--bg-canvas)]/95 backdrop-blur-md z-10">
            <div>
              <span className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-[var(--color-sand)] block font-medium">
                METAMORPHOO PRIVATE ALLOCATION
              </span>
              <h2 className="font-cormorant font-light text-2xl sm:text-3xl text-[var(--text-primary)] uppercase tracking-wider">
                YOUR WARDROBE
              </h2>
            </div>

            <button
              id="close-wardrobe-drawer-btn"
              onClick={onClose}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors focus:outline-none"
              aria-label="Close Wardrobe"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-6 sm:p-8 flex-1 space-y-6">
            {allocationComplete ? (
              /* Honest Concierge Allocation Confirmation Screen */
              <div className="py-6 space-y-6">
                <div className="text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full border border-[var(--color-sand)] flex items-center justify-center text-[var(--color-sand)] bg-[var(--bg-surface)]">
                    <Check className="w-7 h-7" />
                  </div>
                  <span className="font-montserrat text-[10px] uppercase tracking-[0.3em] text-[var(--color-sand)] block font-medium">
                    ALLOCATION LOGGED WITH ATELIER
                  </span>
                  <h3 className="font-cormorant text-3xl text-[var(--text-primary)] uppercase tracking-wider">
                    DISPATCH REQUEST REGISTERED
                  </h3>
                  <p className="font-montserrat text-xs text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
                    Your allocation request has been assigned reference{' '}
                    <span className="text-[var(--text-primary)] font-semibold tracking-wider">
                      {allocationRefNumber}
                    </span>{' '}
                    and recorded in our private register.
                  </p>
                </div>

                {/* Status Card & Instructions */}
                <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 text-left font-montserrat text-xs">
                  <div className="flex items-start space-x-3 pb-3 border-b border-[var(--border-subtle)]">
                    <MessageCircle className="w-5 h-5 text-[#25D366] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[var(--text-primary)] font-medium text-xs uppercase tracking-wider">
                        Next: Concierge Verification
                      </h4>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-1 leading-relaxed">
                        A Metamorphoo stylist confirms fabric lot availability, verifies sizing measurements with you, and coordinates direct settlement (wire transfer or custom private card link).
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-[11px] text-[var(--text-secondary)]">
                    <div className="flex justify-between">
                      <span className="text-[var(--color-sand)] font-medium">CLIENT:</span>
                      <span className="text-[var(--text-primary)]">{clientName || 'Private Client'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-sand)] font-medium">WARDROBE VALUE:</span>
                      <span className="text-[var(--text-primary)]">{formattedTotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-sand)] font-medium">DELIVERY PROTOCOL:</span>
                      <span className="text-[var(--text-primary)]">
                        {deliveryMethod === 'white_glove'
                          ? 'White Glove Atelier Courier'
                          : 'Complimentary Express Transit'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-sand)] font-medium">SETTLEMENT RAIL:</span>
                      <span className="text-[var(--text-primary)]">Direct Atelier Wire / Concierge Transfer</span>
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="space-y-3 pt-2">
                  <a
                    href={getWhatsAppUrl(lastManifestText)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-[#14110E] font-montserrat text-xs uppercase tracking-[0.25em] font-semibold transition-colors flex items-center justify-center space-x-2.5"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>OPEN WHATSAPP CHAT WITH ATELIER</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyManifest}
                    className="w-full py-3 border border-[var(--border-medium)] hover:border-[var(--text-primary)] text-[var(--text-primary)] font-montserrat text-[10px] uppercase tracking-[0.25em] flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-[var(--color-sand)]" />
                    <span>{copiedManifest ? 'MANIFEST COPIED TO CLIPBOARD' : 'COPY SARTORIAL MANIFEST'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="w-full py-2.5 text-center font-montserrat text-[10px] uppercase tracking-[0.25em] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    DONE · RETURN TO WARDROBE
                  </button>
                </div>
              </div>
            ) : isCheckingOut ? (
              /* Honest Concierge Allocation Request Form */
              <form onSubmit={handleInitiateAllocation} className="space-y-6">
                <div className="space-y-1">
                  <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--color-sand)] font-medium">
                    PRIVATE CLIENT ALLOCATION
                  </span>
                  <h3 className="font-cormorant text-2xl text-[var(--text-primary)] uppercase tracking-wider">
                    ATELIER DISPATCH MANIFEST
                  </h3>
                  <p className="font-montserrat text-xs text-[var(--text-secondary)] leading-relaxed">
                    Pieces are individually inspected and reserved directly with the House Concierge. No automated blind charges are billed.
                  </p>
                </div>

                {/* Delivery Option */}
                <div className="space-y-2">
                  <label className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--text-secondary)] block">
                    DELIVERY PROTOCOL
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('courier')}
                      className={`p-3.5 text-left border text-xs font-montserrat transition-all ${
                        deliveryMethod === 'courier'
                          ? 'border-[var(--text-primary)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-medium'
                          : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-medium)]'
                      }`}
                    >
                      <span className="block font-medium uppercase tracking-wider text-[10px]">
                        COMPLIMENTARY DISPATCH
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] block mt-1">
                        Insured express transit (3-5 days)
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('white_glove')}
                      className={`p-3.5 text-left border text-xs font-montserrat transition-all ${
                        deliveryMethod === 'white_glove'
                          ? 'border-[var(--text-primary)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-medium'
                          : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-medium)]'
                      }`}
                    >
                      <span className="block font-medium uppercase tracking-wider text-[10px]">
                        WHITE GLOVE ATELIER (+{currentCurrencyConfig.format(120)})
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] block mt-1">
                        Hand-delivered in breathable cedar cases
                      </span>
                    </button>
                  </div>
                </div>

                {/* Concierge Mechanism Notice */}
                <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-start space-x-3">
                  <MessageCircle className="w-5 h-5 text-[#25D366] flex-shrink-0 mt-0.5" />
                  <div className="text-xs font-montserrat space-y-1">
                    <span className="text-[var(--text-primary)] font-medium uppercase tracking-wider text-[10px] block">
                      ZERO-FRICTION CONCIERGE SETTLEMENT
                    </span>
                    <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                      Submitting generates an official allocation manifest and connects you directly to our WhatsApp Concierge ({CONCIERGE_CONFIG.displayPhone}) to confirm stock, tailor measurements, and settle payment via direct bank transfer or private link.
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--text-secondary)] mb-1">
                      CLIENT FULL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. David Sterling"
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] px-4 py-3 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--text-secondary)] mb-1">
                      WHATSAPP NUMBER OR PHONE (FOR DIRECT ALLOCATION CONFIRMATION) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+234 ... or +44 ... / +1 ..."
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] px-4 py-3 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--text-secondary)] mb-1">
                      CONFIDENTIAL EMAIL
                    </label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="client@salondispatch.com"
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] px-4 py-3 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--text-secondary)] mb-1">
                      DELIVERY DESTINATION & COUNTRY *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={clientAddress}
                      onChange={(e) => setClientAddress(e.target.value)}
                      placeholder="City, Country & Residence / Diplomatic dispatch address..."
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] px-4 py-3 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--text-secondary)] mb-1">
                      BESPOKE SIZING / SPECIAL REQUESTS (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                      placeholder="e.g. Hem trouser to 32in, rush weekend dispatch, etc."
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] px-4 py-2.5 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)]"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    id="initiate-concierge-allocation-btn"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[var(--text-primary)] hover:bg-[var(--text-secondary)] text-[var(--bg-canvas)] font-montserrat text-xs uppercase tracking-[0.28em] font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>
                      {isSubmitting
                        ? 'LOGGING ALLOCATION...'
                        : `INITIATE CONCIERGE ALLOCATION — ${formattedTotal}`}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="w-full py-2 text-center font-montserrat text-[10px] uppercase tracking-[0.25em] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    ← RETURN TO PIECES LIST
                  </button>
                </div>
              </form>
            ) : cartItems.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <Package className="w-10 h-10 mx-auto text-[var(--text-muted)] stroke-[1]" />
                <h3 className="font-cormorant text-2xl text-[var(--text-primary)] uppercase tracking-wider font-light">
                  YOUR WARDROBE IS EMPTY
                </h3>
                <p className="font-montserrat text-xs text-[var(--text-secondary)] max-w-xs mx-auto leading-relaxed">
                  Browse the wardrobe scroll to acquire complete looks or individual curated pieces.
                </p>
                <button
                  onClick={onClose}
                  className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[var(--color-rust)] hover:text-[var(--text-primary)] underline pt-4"
                >
                  EXPLORE THE WARDROBE
                </button>
              </div>
            ) : (
              /* Ensembles Grouped by Look */
              <div className="space-y-8">
                {Object.entries(groupedByLook).map(([lookName, items]) => (
                  <div key={lookName} className="space-y-3">
                    {/* Look Header */}
                    <div className="flex items-center justify-between pb-1.5 border-b border-[var(--border-subtle)]">
                      <span className="font-montserrat text-[9px] uppercase tracking-[0.28em] text-[var(--color-sand)] font-medium">
                        ENSEMBLE · {lookName}
                      </span>
                      <span className="font-montserrat text-[9px] text-[var(--text-muted)] uppercase tracking-widest">
                        {items.length} {items.length === 1 ? 'PIECE' : 'PIECES'}
                      </span>
                    </div>

                    {/* Pieces */}
                    <div className="space-y-3">
                      {items.map((cartItem) => (
                        <div
                          key={cartItem.id}
                          className="flex items-center justify-between p-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] group"
                        >
                          <div className="flex items-center space-x-3.5">
                            <div className="relative w-12 h-16 bg-[var(--bg-canvas)] flex-shrink-0 overflow-hidden border border-[var(--border-subtle)]">
                              <Image
                                src={cartItem.item.image}
                                alt={cartItem.item.name}
                                fill
                                className="object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="space-y-0.5">
                              <span className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[var(--color-sand)] font-medium">
                                {cartItem.item.category}
                              </span>
                              <h4 className="font-cormorant text-base text-[var(--text-primary)] uppercase tracking-wide leading-tight">
                                {cartItem.item.name}
                              </h4>
                              <div className="flex items-center space-x-3 pt-1 text-[10px] font-montserrat text-[var(--text-secondary)]">
                                <span>SIZE: {cartItem.selectedSize}</span>
                                <span>·</span>
                                <span className="text-[var(--text-primary)] font-medium">
                                  {currentCurrencyConfig.format(cartItem.item.price)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            {/* Quantity */}
                            <div className="flex items-center border border-[var(--border-subtle)]">
                              <button
                                onClick={() => onUpdateQuantity(cartItem.id, -1)}
                                className="px-2 py-0.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                              >
                                -
                              </button>
                              <span className="px-2 text-xs font-montserrat text-[var(--text-primary)]">
                                {cartItem.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(cartItem.id, 1)}
                                className="px-2 py-0.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                              >
                                +
                              </button>
                            </div>

                            {/* Delete */}
                            <button
                              onClick={() => onRemoveItem(cartItem.id)}
                              className="p-1.5 text-[var(--text-muted)] hover:text-[var(--color-rust)] transition-colors"
                              aria-label="Remove Piece"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          {!isCheckingOut && !allocationComplete && cartItems.length > 0 && (
            <div className="p-6 sm:p-8 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[var(--text-secondary)]">
                    WARDROBE SUBTOTAL
                  </span>
                  <span className="font-montserrat text-xl text-[var(--text-primary)] tracking-widest font-light">
                    {currentCurrencyConfig.format(subtotalUSD)}
                  </span>
                </div>
                <p className="font-montserrat text-[9px] text-[var(--text-muted)] tracking-wider">
                  Includes complimentary insured express courier. Handled via Private Concierge.
                </p>
              </div>

              <button
                id="proceed-to-allocation-btn"
                onClick={() => setIsCheckingOut(true)}
                className="w-full group py-4 px-6 border border-[var(--text-primary)] hover:border-[var(--color-rust)] bg-[var(--bg-canvas)] hover:bg-[var(--color-rust)] text-[var(--text-primary)] hover:text-[#F5EFE4] transition-all duration-300 flex items-center justify-center space-x-3 focus:outline-none"
              >
                <span className="font-montserrat text-xs uppercase tracking-[0.28em] font-medium">
                  PROCEED TO PRIVATE ALLOCATION
                </span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
              </button>

              <div className="flex items-center justify-center space-x-2 text-[10px] font-montserrat text-[var(--text-muted)] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-sand)]" />
                <span>Zero Synthetic Tension · Guaranteed Return Concierge</span>
              </div>
            </div>
          )}
        </motion.aside>
      </div>
    </AnimatePresence>
  );
}
