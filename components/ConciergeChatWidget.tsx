'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageCircle,
  X,
  Send,
  ExternalLink,
  Phone,
  Sparkles,
  Clock,
  ShieldCheck,
  Check,
  ChevronDown,
} from 'lucide-react';
import {
  CONCIERGE_CONFIG,
  getWhatsAppUrl,
  getSavedAllocations,
  AllocationPayload,
} from '../lib/concierge';

export default function ConciergeChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [clientAllocations, setClientAllocations] = useState<AllocationPayload[]>([]);
  const [showAllocations, setShowAllocations] = useState(false);

  const handleToggleOpen = () => {
    const nextState = !isOpen;
    if (nextState) {
      setClientAllocations(getSavedAllocations());
    }
    setIsOpen(nextState);
  };

  const quickPrompts = [
    {
      label: 'Bespoke Sizing & Fit Check',
      msg: 'Hello Metamorphoo Concierge,\n\nI would like to verify garment measurements and sizing recommendations with an atelier stylist before completing my allocation.',
    },
    {
      label: 'Check Fabric Lot Availability',
      msg: 'Hello Metamorphoo Concierge,\n\nCould you please check real-time fabric lot availability and dispatch timing for my selected wardrobe pieces?',
    },
    {
      label: 'Phase 2 ORIGINALS Inquiry',
      msg: 'Hello Metamorphoo Concierge,\n\nI would like to inquire about the incoming MΦ ORIGINALS numbered capsule release schedule.',
    },
    {
      label: 'Direct Bank Wire Settlement',
      msg: 'Hello Metamorphoo Concierge,\n\nI would like to request official atelier bank wire settlement details for my pending allocation.',
    },
  ];

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;

    const formatted = `Hello Metamorphoo Concierge,\n\n${customMsg.trim()}`;
    const url = getWhatsAppUrl(formatted);
    window.open(url, '_blank', 'noopener,noreferrer');
    setCustomMsg('');
  };

  const handleQuickSend = (msg: string) => {
    const url = getWhatsAppUrl(msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          id="concierge-chat-toggle-btn"
          onClick={handleToggleOpen}
          className="group relative flex items-center space-x-2.5 bg-[#14110E] hover:bg-[#1A1611] text-[#E8E0D5] border border-[#C9B89A]/40 hover:border-[#C9B89A] px-4 py-3 shadow-2xl transition-all duration-300 focus:outline-none"
          aria-label="Open Atelier Concierge Chat"
        >
          <div className="relative">
            <MessageCircle className="w-4 h-4 text-[#25D366] fill-current" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#25D366] rounded-full animate-pulse" />
          </div>
          <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] font-medium hidden sm:inline-block">
            ATELIER CONCIERGE
          </span>
          <span className="font-montserrat text-[9px] text-[#C9B89A] tracking-wider hidden sm:inline-block">
            · ACTIVE
          </span>
        </button>
      </div>

      {/* Floating Concierge Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="concierge-chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 bg-[#14110E] border border-[#E8E0D5]/20 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Header */}
            <div className="p-4 bg-[#1A1611] border-b border-[#E8E0D5]/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full border border-[#25D366]/40 flex items-center justify-center bg-[#14110E]">
                  <MessageCircle className="w-4 h-4 text-[#25D366] fill-current" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-cormorant text-base text-[#E8E0D5] uppercase tracking-wider font-light">
                      ATELIER CONCIERGE
                    </h3>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
                  </div>
                  <span className="font-montserrat text-[9px] text-[#C9B89A] tracking-widest block">
                    {CONCIERGE_CONFIG.displayPhone} · PRIVATE DESK
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-[#E8E0D5]/60 hover:text-[#E8E0D5] p-1"
                aria-label="Close Chat Widget"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1 font-montserrat text-xs">
              {/* Concierge Intro Message */}
              <div className="p-3 bg-[#1A1611] border border-[#E8E0D5]/10 space-y-1.5 text-[#E8E0D5]/80">
                <div className="flex items-center justify-between text-[9px] text-[#C9B89A] uppercase tracking-widest">
                  <span>METAMORPHOO SALON DESK</span>
                  <span>DIRECT RAIL</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Welcome to the Metamorphoo private desk. Stylists and tailors are on duty to verify fabric lots, confirm custom dimensions, and handle direct acquisitions.
                </p>
              </div>

              {/* Past Allocation References Accordion */}
              {clientAllocations.length > 0 && (
                <div className="border border-[#C9B89A]/30 bg-[#1A1611]/60 p-3 space-y-2">
                  <button
                    type="button"
                    onClick={() => setShowAllocations(!showAllocations)}
                    className="w-full flex items-center justify-between text-[9px] uppercase tracking-[0.2em] text-[#C9B89A] text-left"
                  >
                    <span>YOUR LOGGED ALLOCATIONS ({clientAllocations.length})</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transform transition-transform ${
                        showAllocations ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {showAllocations && (
                    <div className="space-y-2 pt-1 border-t border-[#E8E0D5]/10 max-h-36 overflow-y-auto">
                      {clientAllocations.map((alloc) => (
                        <div
                          key={alloc.reference}
                          className="text-[10px] p-2 bg-[#14110E] border border-[#E8E0D5]/10 flex items-center justify-between"
                        >
                          <div>
                            <span className="text-[#E8E0D5] font-medium block">
                              {alloc.reference}
                            </span>
                            <span className="text-[#E8E0D5]/50">
                              {alloc.items.length} pieces · {alloc.formattedTotal}
                            </span>
                          </div>
                          <a
                            href={getWhatsAppUrl(`Hello Concierge, checking status on allocation ${alloc.reference}`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-[#25D366] hover:text-[#20bd5a]"
                            title="Chat on WhatsApp about this allocation"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Quick Inquiry Options */}
              <div className="space-y-1.5">
                <span className="font-montserrat text-[8px] uppercase tracking-[0.25em] text-[#E8E0D5]/50 block">
                  INSTANT ATELIER ROUTING
                </span>
                <div className="space-y-1.5">
                  {quickPrompts.map((qp, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickSend(qp.msg)}
                      className="w-full text-left p-2.5 bg-[#1A1611] hover:bg-[#1f1a14] border border-[#E8E0D5]/10 hover:border-[#C9B89A]/50 text-[11px] text-[#E8E0D5]/90 transition-all flex items-center justify-between group"
                    >
                      <span>{qp.label}</span>
                      <ExternalLink className="w-3 h-3 text-[#25D366] opacity-60 group-hover:opacity-100 flex-shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Input / Send */}
            <div className="p-3 bg-[#1A1611] border-t border-[#E8E0D5]/10">
              <form onSubmit={handleSendCustom} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  placeholder="Type a confidential question..."
                  className="flex-1 bg-[#14110E] border border-[#E8E0D5]/20 px-3 py-2 text-xs text-[#E8E0D5] font-montserrat placeholder-[#E8E0D5]/30 focus:outline-none focus:border-[#E8E0D5]"
                />
                <button
                  type="submit"
                  disabled={!customMsg.trim()}
                  className="p-2 bg-[#25D366] hover:bg-[#20bd5a] disabled:opacity-30 text-[#14110E] transition-colors flex-shrink-0"
                  aria-label="Send Message to WhatsApp"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="flex items-center justify-between pt-2 text-[8px] font-montserrat text-[#E8E0D5]/40 tracking-wider">
                <span>ENCRYPTED DIRECT CHANNEL</span>
                <span>AVERAGE RESPONSE &lt; 15 MIN</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
