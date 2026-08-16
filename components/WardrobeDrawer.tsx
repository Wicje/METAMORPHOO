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
  CreditCard,
  Building,
  Smartphone,
} from 'lucide-react';
import { CartItem } from '../lib/types';
import { CURRENCIES, useCurrency } from '../lib/currency';

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
  const [paymentRail, setPaymentRail] = useState<'card' | 'paystack_transfer' | 'concierge'>('card');
  const currency = useCurrency();

  // Customer form inputs
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');

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

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedRef = `MΦ-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderRefNumber(generatedRef);
    setOrderComplete(true);
    setTimeout(() => {
      onClearWardrobe();
      setIsCheckingOut(false);
      setOrderComplete(false);
      onClose();
    }, 4500);
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

          {/* Drawer Body */}
          <div className="p-6 sm:p-8 flex-1 space-y-6">
            {orderComplete ? (
              <div className="py-12 text-center space-y-5">
                <div className="w-14 h-14 mx-auto rounded-full border border-[#C4623A] flex items-center justify-center text-[#C4623A]">
                  <Check className="w-7 h-7" />
                </div>
                <span className="font-montserrat text-[10px] uppercase tracking-[0.3em] text-[#C9B89A] block">
                  DISPATCH CONFIRMED
                </span>
                <h3 className="font-cormorant text-3xl text-[#E8E0D5] uppercase tracking-wider">
                  WARDROBE ALLOCATED
                </h3>
                <p className="font-montserrat text-xs text-[#E8E0D5]/70 max-w-sm mx-auto leading-relaxed">
                  Your acquisition order <span className="text-[#E8E0D5] font-medium">{orderRefNumber}</span> has been logged with the Metamorphoo Concierge. A formal garment dispatch dossier has been routed to {clientEmail || 'your email'}.
                </p>
                <div className="p-4 bg-[#14110E] border border-[#E8E0D5]/15 text-left text-xs font-montserrat space-y-1 max-w-sm mx-auto text-[#E8E0D5]/80">
                  <div className="flex justify-between">
                    <span className="text-[#C9B89A]">PAYMENT SETTLEMENT:</span>
                    <span>{paymentRail.toUpperCase().replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#C9B89A]">CURRENCY:</span>
                    <span>{currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#C9B89A]">PACKAGING:</span>
                    <span>MΦ Cedar Garment Case</span>
                  </div>
                </div>
              </div>
            ) : isCheckingOut ? (
              /* Checkout Form with Dual-Rail Payment */
              <form onSubmit={handleCompleteOrder} className="space-y-6">
                <div className="space-y-1">
                  <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#C9B89A]">
                    CONCIERGE DISPATCH
                  </span>
                  <h3 className="font-cormorant text-2xl text-[#E8E0D5] uppercase tracking-wider">
                    DELIVERY & SETTLEMENT
                  </h3>
                </div>

                {/* Delivery Option */}
                <div className="space-y-2">
                  <label className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#E8E0D5]/60 block">
                    DELIVERY PROTOCOL
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('courier')}
                      className={`p-3.5 text-left border text-xs font-montserrat transition-all ${
                        deliveryMethod === 'courier'
                          ? 'border-[#E8E0D5] bg-[#14110E] text-[#E8E0D5]'
                          : 'border-[#E8E0D5]/15 text-[#E8E0D5]/60 hover:border-[#E8E0D5]/30'
                      }`}
                    >
                      <span className="block font-medium uppercase tracking-wider text-[10px]">
                        COMPLIMENTARY DISPATCH
                      </span>
                      <span className="text-[10px] text-[#E8E0D5]/50 block mt-1">
                        Insured express transit (3-5 days)
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('white_glove')}
                      className={`p-3.5 text-left border text-xs font-montserrat transition-all ${
                        deliveryMethod === 'white_glove'
                          ? 'border-[#E8E0D5] bg-[#14110E] text-[#E8E0D5]'
                          : 'border-[#E8E0D5]/15 text-[#E8E0D5]/60 hover:border-[#E8E0D5]/30'
                      }`}
                    >
                      <span className="block font-medium uppercase tracking-wider text-[10px]">
                        WHITE GLOVE ATELIER (+{currentCurrencyConfig.format(120)})
                      </span>
                      <span className="text-[10px] text-[#E8E0D5]/50 block mt-1">
                        Hand-delivered in breathable cedar cases
                      </span>
                    </button>
                  </div>
                </div>

                {/* Payment Rail Selection */}
                <div className="space-y-2">
                  <label className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#E8E0D5]/60 block">
                    PAYMENT RAIL & SETTLEMENT GATEWAY
                  </label>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setPaymentRail('card')}
                      className={`w-full p-3 text-left border text-xs font-montserrat transition-all flex items-center justify-between ${
                        paymentRail === 'card'
                          ? 'border-[#E8E0D5] bg-[#14110E] text-[#E8E0D5]'
                          : 'border-[#E8E0D5]/15 text-[#E8E0D5]/60 hover:border-[#E8E0D5]/30'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <CreditCard className="w-4 h-4 text-[#C9B89A]" />
                        <span>International Private Card (Stripe / Visa / Master / Amex)</span>
                      </div>
                      <span className="text-[9px] uppercase tracking-wider text-[#C9B89A]">GLOBAL</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentRail('paystack_transfer')}
                      className={`w-full p-3 text-left border text-xs font-montserrat transition-all flex items-center justify-between ${
                        paymentRail === 'paystack_transfer'
                          ? 'border-[#E8E0D5] bg-[#14110E] text-[#E8E0D5]'
                          : 'border-[#E8E0D5]/15 text-[#E8E0D5]/60 hover:border-[#E8E0D5]/30'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Building className="w-4 h-4 text-[#C9B89A]" />
                        <span>Nigeria Direct Bank Transfer / Paystack Gateway (Zero Surcharge)</span>
                      </div>
                      <span className="text-[9px] uppercase tracking-wider text-[#C4623A]">NGN ₦ / CARD</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentRail('concierge')}
                      className={`w-full p-3 text-left border text-xs font-montserrat transition-all flex items-center justify-between ${
                        paymentRail === 'concierge'
                          ? 'border-[#E8E0D5] bg-[#14110E] text-[#E8E0D5]'
                          : 'border-[#E8E0D5]/15 text-[#E8E0D5]/60 hover:border-[#E8E0D5]/30'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Smartphone className="w-4 h-4 text-[#C9B89A]" />
                        <span>Private WhatsApp Concierge Allocation & Tailor Consultation</span>
                      </div>
                      <span className="text-[9px] uppercase tracking-wider text-[#C9B89A]">DIRECT</span>
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#E8E0D5]/60 mb-1">
                      CLIENT FULL NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. David Sterling"
                      className="w-full bg-[#14110E] border border-[#E8E0D5]/20 px-4 py-3 text-xs text-[#E8E0D5] font-montserrat focus:outline-none focus:border-[#E8E0D5]"
                    />
                  </div>

                  <div>
                    <label className="block font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#E8E0D5]/60 mb-1">
                      CONFIDENTIAL EMAIL
                    </label>
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="client@salondispatch.com"
                      className="w-full bg-[#14110E] border border-[#E8E0D5]/20 px-4 py-3 text-xs text-[#E8E0D5] font-montserrat focus:outline-none focus:border-[#E8E0D5]"
                    />
                  </div>

                  <div>
                    <label className="block font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#E8E0D5]/60 mb-1">
                      DELIVERY ADDRESS & COUNTRY
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={clientAddress}
                      onChange={(e) => setClientAddress(e.target.value)}
                      placeholder="Private residence or diplomatic pouch destination..."
                      className="w-full bg-[#14110E] border border-[#E8E0D5]/20 px-4 py-3 text-xs text-[#E8E0D5] font-montserrat focus:outline-none focus:border-[#E8E0D5] resize-none"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    id="confirm-acquisition-btn"
                    className="w-full py-4 bg-[#E8E0D5] hover:bg-[#F5EFE4] text-[#1A1611] font-montserrat text-xs uppercase tracking-[0.28em] font-medium transition-colors"
                  >
                    COMPLETE ACQUISITION — {currentCurrencyConfig.format(totalUSD)}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="w-full py-2 text-center font-montserrat text-[10px] uppercase tracking-[0.25em] text-[#E8E0D5]/60 hover:text-[#E8E0D5]"
                  >
                    ← RETURN TO PIECES LIST
                  </button>
                </div>
              </form>
            ) : cartItems.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <Package className="w-10 h-10 mx-auto text-[#E8E0D5]/30 stroke-[1]" />
                <h3 className="font-cormorant text-2xl text-[#E8E0D5] uppercase tracking-wider font-light">
                  YOUR WARDROBE IS EMPTY
                </h3>
                <p className="font-montserrat text-xs text-[#E8E0D5]/60 max-w-xs mx-auto leading-relaxed">
                  Browse the wardrobe scroll to acquire complete looks or individual curated pieces.
                </p>
                <button
                  onClick={onClose}
                  className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[#C4623A] hover:text-[#E8E0D5] underline pt-4"
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
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#E8E0D5]/15">
                      <span className="font-montserrat text-[9px] uppercase tracking-[0.28em] text-[#C9B89A] font-medium">
                        ENSEMBLE · {lookName}
                      </span>
                      <span className="font-montserrat text-[9px] text-[#E8E0D5]/40 uppercase tracking-widest">
                        {items.length} {items.length === 1 ? 'PIECE' : 'PIECES'}
                      </span>
                    </div>

                    {/* Pieces */}
                    <div className="space-y-3">
                      {items.map((cartItem) => (
                        <div
                          key={cartItem.id}
                          className="flex items-center justify-between p-3 bg-[#14110E] border border-[#E8E0D5]/10 group"
                        >
                          <div className="flex items-center space-x-3.5">
                            <div className="relative w-12 h-16 bg-[#1A1611] flex-shrink-0 overflow-hidden">
                              <Image
                                src={cartItem.item.image}
                                alt={cartItem.item.name}
                                fill
                                className="object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="space-y-0.5">
                              <span className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[#C9B89A]">
                                {cartItem.item.category}
                              </span>
                              <h4 className="font-cormorant text-base text-[#E8E0D5] uppercase tracking-wide leading-tight">
                                {cartItem.item.name}
                              </h4>
                              <div className="flex items-center space-x-3 pt-1 text-[10px] font-montserrat text-[#E8E0D5]/60">
                                <span>SIZE: {cartItem.selectedSize}</span>
                                <span>·</span>
                                <span className="text-[#E8E0D5]">
                                  {currentCurrencyConfig.format(cartItem.item.price)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            {/* Quantity */}
                            <div className="flex items-center border border-[#E8E0D5]/20">
                              <button
                                onClick={() => onUpdateQuantity(cartItem.id, -1)}
                                className="px-2 py-0.5 text-xs text-[#E8E0D5]/60 hover:text-[#E8E0D5]"
                              >
                                -
                              </button>
                              <span className="px-2 text-xs font-montserrat text-[#E8E0D5]">
                                {cartItem.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(cartItem.id, 1)}
                                className="px-2 py-0.5 text-xs text-[#E8E0D5]/60 hover:text-[#E8E0D5]"
                              >
                                +
                              </button>
                            </div>

                            {/* Delete */}
                            <button
                              onClick={() => onRemoveItem(cartItem.id)}
                              className="p-1.5 text-[#E8E0D5]/40 hover:text-[#C4623A] transition-colors"
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

          {/* Drawer Footer (Only if not checking out and has items) */}
          {!isCheckingOut && !orderComplete && cartItems.length > 0 && (
            <div className="p-6 sm:p-8 border-t border-[#E8E0D5]/15 bg-[#14110E] space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[#E8E0D5]/60">
                    WARDROBE SUBTOTAL
                  </span>
                  <span className="font-montserrat text-xl text-[#E8E0D5] tracking-widest font-light">
                    {currentCurrencyConfig.format(subtotalUSD)}
                  </span>
                </div>
                <p className="font-montserrat text-[9px] text-[#E8E0D5]/50 tracking-wider">
                  Includes complimentary insured express courier. Curated in single dispatch.
                </p>
              </div>

              <button
                id="proceed-to-acquisition-btn"
                onClick={() => setIsCheckingOut(true)}
                className="w-full group py-4 px-6 border border-[#E8E0D5] hover:border-[#C4623A] bg-[#1A1611] hover:bg-[#C4623A] text-[#E8E0D5] hover:text-[#F5EFE4] transition-all duration-300 flex items-center justify-center space-x-3 focus:outline-none"
              >
                <span className="font-montserrat text-xs uppercase tracking-[0.28em] font-medium">
                  PROCEED TO ACQUISITION
                </span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
              </button>

              <div className="flex items-center justify-center space-x-2 text-[10px] font-montserrat text-[#E8E0D5]/40 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9B89A]" />
                <span>Zero Synthetic Tension · Guaranteed Return Concierge</span>
              </div>
            </div>
          )}
        </motion.aside>
      </div>
    </AnimatePresence>
  );
}
