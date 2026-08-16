'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Check, ArrowRight, ShieldCheck, Package } from 'lucide-react';
import { CartItem } from '../lib/types';

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
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderRefNumber, setOrderRefNumber] = useState('MΦ-839201');
  const [deliveryMethod, setDeliveryMethod] = useState<'courier' | 'white_glove'>('courier');

  // Group items by look name
  const groupedByLook: { [lookName: string]: CartItem[] } = {};
  cartItems.forEach((ci) => {
    if (!groupedByLook[ci.lookName]) {
      groupedByLook[ci.lookName] = [];
    }
    groupedByLook[ci.lookName].push(ci);
  });

  const subtotal = cartItems.reduce(
    (sum, ci) => sum + ci.item.price * ci.quantity,
    0
  );
  const courierFee = deliveryMethod === 'white_glove' ? 120 : 0;
  const total = subtotal + courierFee;

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderRefNumber(`MΦ-${Math.floor(100000 + Math.random() * 900000)}`);
    setOrderComplete(true);
    setTimeout(() => {
      onClearWardrobe();
      setIsCheckingOut(false);
      setOrderComplete(false);
      onClose();
    }, 4000);
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
          className="absolute right-0 top-0 bottom-0 w-full max-w-xl bg-[#1A1611] border-l border-[#E8E0D5]/15 flex flex-col justify-between shadow-2xl overflow-y-auto"
        >
          {/* Header: Your Wardrobe */}
          <div className="p-6 sm:p-8 border-b border-[#E8E0D5]/10 flex items-center justify-between sticky top-0 bg-[#1A1611]/95 backdrop-blur-md z-10">
            <div>
              <span className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-[#C9B89A] block">
                METAMORPHOO ACQUISITION
              </span>
              <h2 className="font-cormorant font-light text-2xl sm:text-3xl text-[#E8E0D5] uppercase tracking-wider">
                YOUR WARDROBE
              </h2>
            </div>

            <button
              id="close-wardrobe-drawer-btn"
              onClick={onClose}
              className="p-2 text-[#E8E0D5]/60 hover:text-[#E8E0D5] transition-colors focus:outline-none"
              aria-label="Close Wardrobe"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 flex-1 space-y-8">
            {orderComplete ? (
              <div className="text-center py-16 space-y-6">
                <div className="w-14 h-14 mx-auto rounded-full border border-[#C4623A] flex items-center justify-center text-[#C4623A]">
                  <Check className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-cormorant text-3xl text-[#E8E0D5] uppercase tracking-wider font-light">
                    WARDROBE DISPATCHED
                  </h3>
                  <p className="font-montserrat text-xs text-[#E8E0D5]/70 max-w-sm mx-auto font-light leading-relaxed">
                    Your complete decision has been recorded. Garments are currently being hand-inspected, steam-pressed, and packaged in archival Metamorphoo cotton garment travel cases.
                  </p>
                </div>
                <div className="p-4 bg-[#14110E] border border-[#E8E0D5]/10 max-w-xs mx-auto">
                  <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#C9B89A] block">
                    TRACKING REFERENCE
                  </span>
                  <span className="font-montserrat text-xs text-[#E8E0D5] tracking-widest font-mono">
                    {orderRefNumber}
                  </span>
                </div>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <p className="font-cormorant italic text-2xl text-[#E8E0D5]/50 font-light">
                  &ldquo;The wardrobe is empty.&rdquo;
                </p>
                <p className="font-montserrat text-xs text-[#E8E0D5]/40 font-light max-w-xs mx-auto">
                  Explore the curated looks to select individual pieces or adopt a complete sartorial decision.
                </p>
              </div>
            ) : isCheckingOut ? (
              /* Checkout Details Form */
              <form onSubmit={handleCompleteOrder} className="space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8E0D5]/10">
                  <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[#C9B89A]">
                    PRIVATE DELIVERY DETAILS
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="font-montserrat text-[10px] uppercase tracking-[0.2em] text-[#E8E0D5]/60 hover:text-[#E8E0D5]"
                  >
                    ← Review Pieces
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#E8E0D5]/60 mb-1.5">
                      RECIPIENT NAME
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lorde Sterling"
                      className="w-full bg-[#14110E] border border-[#E8E0D5]/20 px-4 py-3 text-xs text-[#E8E0D5] font-montserrat focus:outline-none focus:border-[#E8E0D5]"
                    />
                  </div>

                  <div>
                    <label className="block font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#E8E0D5]/60 mb-1.5">
                      PRIVATE RESIDENCE / HOTEL CONCIERGE
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Via Manzoni 12, Piano 4"
                      className="w-full bg-[#14110E] border border-[#E8E0D5]/20 px-4 py-3 text-xs text-[#E8E0D5] font-montserrat focus:outline-none focus:border-[#E8E0D5]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#E8E0D5]/60 mb-1.5">
                        CITY
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Milan / Lisbon / Lagos"
                        className="w-full bg-[#14110E] border border-[#E8E0D5]/20 px-4 py-3 text-xs text-[#E8E0D5] font-montserrat focus:outline-none focus:border-[#E8E0D5]"
                      />
                    </div>
                    <div>
                      <label className="block font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#E8E0D5]/60 mb-1.5">
                        COUNTRY
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Italy"
                        className="w-full bg-[#14110E] border border-[#E8E0D5]/20 px-4 py-3 text-xs text-[#E8E0D5] font-montserrat focus:outline-none focus:border-[#E8E0D5]"
                      />
                    </div>
                  </div>

                  {/* Delivery Service Selection */}
                  <div className="space-y-2 pt-2">
                    <label className="block font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#E8E0D5]/60">
                      DISPATCH PROTOCOL
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('courier')}
                        className={`p-3 border text-left transition-colors ${
                          deliveryMethod === 'courier'
                            ? 'border-[#E8E0D5] bg-[#14110E]'
                            : 'border-[#E8E0D5]/10 text-[#E8E0D5]/50'
                        }`}
                      >
                        <span className="font-montserrat text-[10px] uppercase tracking-[0.2em] block text-[#E8E0D5]">
                          Express Courier
                        </span>
                        <span className="font-montserrat text-[9px] text-[#C9B89A]">
                          Complimentary (2-3 Days)
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('white_glove')}
                        className={`p-3 border text-left transition-colors ${
                          deliveryMethod === 'white_glove'
                            ? 'border-[#E8E0D5] bg-[#14110E]'
                            : 'border-[#E8E0D5]/10 text-[#E8E0D5]/50'
                        }`}
                      >
                        <span className="font-montserrat text-[10px] uppercase tracking-[0.2em] block text-[#E8E0D5]">
                          White Glove Fitting
                        </span>
                        <span className="font-montserrat text-[9px] text-[#C9B89A]">
                          +$120 USD (Private Attendant)
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  id="confirm-wardrobe-acquisition-btn"
                  className="w-full py-4 border border-[#E8E0D5] hover:border-[#C4623A] bg-[#1A1611] hover:bg-[#C4623A] text-[#E8E0D5] hover:text-[#F5EFE4] transition-all font-montserrat text-xs uppercase tracking-[0.25em] font-medium"
                >
                  CONFIRM WARDROBE ACQUISITION (${total.toLocaleString()} USD)
                </button>
              </form>
            ) : (
              /* Items Grouped Strictly by Look */
              <div className="space-y-8">
                {Object.keys(groupedByLook).map((lookName) => {
                  const itemsInLook = groupedByLook[lookName];
                  const lookSubtotal = itemsInLook.reduce(
                    (s, ci) => s + ci.item.price * ci.quantity,
                    0
                  );

                  return (
                    <div
                      key={lookName}
                      id={`wardrobe-group-${lookName.toLowerCase().replace(/\s+/g, '-')}`}
                      className="space-y-3"
                    >
                      {/* Look Header */}
                      <div className="flex justify-between items-baseline pb-2 border-b border-[#E8E0D5]/15">
                        <div>
                          <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#C9B89A] block">
                            FROM
                          </span>
                          <h3 className="font-cormorant text-xl text-[#E8E0D5] uppercase tracking-wider font-light">
                            {lookName}
                          </h3>
                        </div>
                        <span className="font-montserrat text-xs text-[#E8E0D5]/70 tracking-wider">
                          ${lookSubtotal.toLocaleString()} USD
                        </span>
                      </div>

                      {/* Items in this look */}
                      <div className="space-y-3">
                        {itemsInLook.map((ci) => (
                          <div
                            key={ci.id}
                            id={`cart-item-${ci.id}`}
                            className="bg-[#14110E] p-3.5 border border-[#E8E0D5]/10 flex gap-4 items-center"
                          >
                            <div className="relative w-16 h-20 bg-[#1A1611] flex-shrink-0">
                              <Image
                                src={ci.item.image}
                                alt={ci.item.name}
                                fill
                                className="object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>

                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex justify-between items-start">
                                <p className="font-cormorant text-base text-[#E8E0D5] font-light truncate leading-snug">
                                  {ci.item.name}
                                </p>
                                <button
                                  onClick={() => onRemoveItem(ci.id)}
                                  className="text-[#E8E0D5]/30 hover:text-[#C4623A] transition-colors p-1"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="flex items-center space-x-2 text-[10px] font-montserrat text-[#E8E0D5]/60">
                                <span>Size: {ci.selectedSize}</span>
                                <span>·</span>
                                <span className="text-[#C9B89A]">{ci.item.category}</span>
                              </div>

                              <div className="flex justify-between items-center pt-1">
                                <div className="flex items-center space-x-2 border border-[#E8E0D5]/10 px-2 py-0.5">
                                  <button
                                    onClick={() => onUpdateQuantity(ci.id, -1)}
                                    className="text-xs text-[#E8E0D5]/60 hover:text-[#E8E0D5]"
                                  >
                                    -
                                  </button>
                                  <span className="text-xs font-montserrat text-[#E8E0D5]">
                                    {ci.quantity}
                                  </span>
                                  <button
                                    onClick={() => onUpdateQuantity(ci.id, 1)}
                                    className="text-xs text-[#E8E0D5]/60 hover:text-[#E8E0D5]"
                                  >
                                    +
                                  </button>
                                </div>
                                <span className="font-montserrat text-xs text-[#E8E0D5] font-medium">
                                  ${ci.item.price * ci.quantity} USD
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Subtotal & Action (No upsell cross-sell grids) */}
          {cartItems.length > 0 && !orderComplete && !isCheckingOut && (
            <div className="p-6 sm:p-8 border-t border-[#E8E0D5]/15 bg-[#14110E] space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between font-montserrat text-xs text-[#E8E0D5]/60 uppercase tracking-[0.2em]">
                  <span>TOTAL PIECES</span>
                  <span>{cartItems.reduce((s, ci) => s + ci.quantity, 0)} ITEMS</span>
                </div>
                <div className="flex justify-between font-cormorant text-2xl text-[#E8E0D5] uppercase tracking-wider">
                  <span>TOTAL ESTIMATE</span>
                  <span>${subtotal.toLocaleString()} USD</span>
                </div>
              </div>

              <button
                id="proceed-to-checkout-btn"
                onClick={() => setIsCheckingOut(true)}
                className="w-full py-4 border border-[#E8E0D5] hover:border-[#C4623A] bg-[#1A1611] hover:bg-[#C4623A] text-[#E8E0D5] hover:text-[#F5EFE4] transition-all font-montserrat text-xs uppercase tracking-[0.28em] font-medium flex items-center justify-center space-x-2"
              >
                <span>PROCEED TO PRIVATE CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center space-x-2 text-[#E8E0D5]/40 font-montserrat text-[9px] uppercase tracking-[0.2em] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9B89A]" />
                <span>Hand-Packaged in Archival Breathable Cotton Cases</span>
              </div>
            </div>
          )}
        </motion.aside>
      </div>
    </AnimatePresence>
  );
}
