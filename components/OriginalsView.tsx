'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Check, ArrowRight, MessageCircle, ExternalLink } from 'lucide-react';
import {
  saveWaitlistLocally,
  getSavedWaitlists,
  getWhatsAppUrl,
  CONCIERGE_CONFIG,
  WaitlistPayload,
} from '../lib/concierge';

interface OriginalsViewProps {
  onExploreWardrobe: () => void;
}

export default function OriginalsView({ onExploreWardrobe }: OriginalsViewProps) {
  const [clientName, setClientName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lazy initializer to avoid synchronous setState inside useEffect
  const [initialData] = useState(() => {
    const existing = typeof window !== 'undefined' ? getSavedWaitlists() : [];
    if (existing.length > 0) {
      return {
        joined: true,
        id: existing[0].id,
        email: existing[0].email,
      };
    }
    return { joined: false, id: '', email: '' };
  });

  const [email, setEmail] = useState(initialData.email);
  const [joinedWaitlist, setJoinedWaitlist] = useState(initialData.joined);
  const [registeredId, setRegisteredId] = useState(initialData.id);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    const assignedId = `ORIGINALS-${Math.floor(1000 + Math.random() * 9000)}`;

    const payload: WaitlistPayload = {
      id: assignedId,
      email: email.trim().toLowerCase(),
      name: clientName.trim(),
      source: 'ORIGINALS_CAPSULE_PAGE',
      timestamp: Date.now(),
    };

    // 1. Save in client local persistence
    saveWaitlistLocally(payload);
    setRegisteredId(assignedId);
    setJoinedWaitlist(true);

    // 2. Post to API route for lightweight backend persistence
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.id) {
        setRegisteredId(data.id);
      }
    } catch (err) {
      console.warn('Waitlist logging API error, local copy saved', err);
    }

    setIsSubmitting(false);
  };

  const whatsAppWaitlistMsg = `Hello Metamorphoo Concierge,\n\nI have registered my allocation priority for the *MΦ ORIGINALS* Inaugural Capsule.\nRegistration Ref: *${registeredId}*\nEmail: ${email}\n\nPlease include me on the private priority allocation list before public release.`;

  const previewPieces = [
    {
      title: 'The MΦ Monogram Heavy Silk Capelet',
      edition: 'Numbered Edition of 50',
      origin: 'Como / Milan Atelier',
      composition: '420gsm Double-Faced Mulberry Silk Crepe',
      status: 'In Loom Development',
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=85',
    },
    {
      title: 'The Architectural Slub Trouser',
      edition: 'Numbered Edition of 75',
      origin: 'Guimarães / Lisbon Studio',
      composition: 'Custom-Milled 480gsm Raw Flax & Cashmere',
      status: 'Pattern Grading Complete',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=85',
    },
    {
      title: 'The Sovereign Obsidian Signet',
      edition: 'Numbered Edition of 30',
      origin: 'Bespoke Lagos Foundry',
      composition: 'Solid 950 Platinum & Uncut Obsidian Matrix',
      status: 'Lost-Wax Casting',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85',
    },
  ];

  return (
    <div id="originals-page" className="w-full min-h-screen bg-[#1A1611] text-[#E8E0D5] pt-28 pb-32">
      <div className="max-w-5xl mx-auto px-6 sm:px-12 space-y-20">
        {/* Header Title */}
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center space-x-3">
            <span className="font-cormorant text-base tracking-[0.3em] text-[#E8E0D5]/70">
              MΦ
            </span>
            <span className="text-[#E8E0D5]/30">·</span>
            <span className="font-montserrat text-[10px] uppercase tracking-[0.3em] text-[#C9B89A]">
              PHASE 02 PREVIEW
            </span>
          </div>

          <h1 className="font-cormorant font-light text-5xl sm:text-7xl lg:text-8xl uppercase tracking-[0.18em] text-[#E8E0D5] leading-none">
            ORIGINALS
          </h1>

          <p className="font-montserrat text-xs sm:text-sm text-[#E8E0D5]/80 font-light leading-relaxed">
            Where <span className="text-[#C9B89A]">EDIT</span> represents the relentless curation of existing masterworks, <span className="text-[#E8E0D5] font-medium">ORIGINALS</span> represents our own manufacture. Designed by Ani Chisom and crafted in strictly numbered editions across Portugal, Italy, and West Africa.
          </p>
        </div>

        {/* Monogram Distinction Feature */}
        <div className="bg-[#14110E] p-8 sm:p-12 border border-[#E8E0D5]/15 flex flex-col md:flex-row items-center gap-8 sm:gap-12">
          <div className="w-32 h-32 flex-shrink-0 border border-[#E8E0D5]/20 flex items-center justify-center bg-[#1A1611]">
            <span className="font-cormorant text-5xl font-light tracking-[0.25em] text-[#E8E0D5] select-none pl-2">
              MΦ
            </span>
          </div>

          <div className="space-y-3 text-left">
            <span className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-[#C9B89A]">
              THE IDENTIFIER
            </span>
            <h2 className="font-cormorant text-2xl sm:text-3xl text-[#E8E0D5] font-light uppercase tracking-wider">
              The Hairline MΦ Monogram
            </h2>
            <p className="font-montserrat text-xs text-[#E8E0D5]/70 font-light leading-relaxed">
              ORIGINALS carry no exterior logos or marketing badges. Instead, each manufactured piece is signed with a discrete, tone-on-tone hairline MΦ monogram at the inner hem, signifying bespoke yarn spinning, hand-finished canvas, and archival preservation.
            </p>
          </div>
        </div>

        {/* Preview Capsule Pieces Under Development */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-[#C9B89A]">
              IN PRODUCTION
            </span>
            <h2 className="font-cormorant text-3xl sm:text-4xl text-[#E8E0D5] font-light uppercase tracking-[0.16em]">
              INCOMING INAUGURAL CAPSULE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {previewPieces.map((piece, i) => (
              <div
                key={i}
                className="bg-[#14110E] border border-[#E8E0D5]/10 flex flex-col justify-between overflow-hidden"
              >
                <div className="relative aspect-[3/4] w-full bg-[#1A1611]">
                  <Image
                    src={piece.image}
                    alt={piece.title}
                    fill
                    className="object-cover object-center grayscale contrast-125"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-[#1A1611]/30" />
                  <div className="absolute bottom-3 right-3 z-10">
                    <span className="font-cormorant text-sm tracking-[0.3em] text-[#E8E0D5]/80 bg-[#1A1611]/80 px-2 py-0.5">
                      MΦ
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <span className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[#C9B89A] block">
                    {piece.edition} · {piece.origin}
                  </span>
                  <h3 className="font-cormorant text-xl text-[#E8E0D5] font-light leading-snug">
                    {piece.title}
                  </h3>
                  <p className="font-montserrat text-[11px] text-[#E8E0D5]/60">
                    {piece.composition}
                  </p>
                  <div className="pt-2 border-t border-[#E8E0D5]/10">
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[#E8E0D5]/40">
                      STATUS: {piece.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Private Capsule Notification */}
        <div className="bg-[#14110E] p-8 sm:p-12 border border-[#E8E0D5]/15 max-w-2xl mx-auto text-center space-y-6">
          <span className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-[#C9B89A]">
            EARLY DISPATCH
          </span>
          <h3 className="font-cormorant text-3xl text-[#E8E0D5] font-light uppercase tracking-wider">
            PRIVATE RELEASE REGISTRATION
          </h3>
          <p className="font-montserrat text-xs text-[#E8E0D5]/70 font-light max-w-md mx-auto">
            Numbered ORIGINALS editions are allocated strictly in order of registration before public disclosure.
          </p>

          {joinedWaitlist ? (
            <div className="p-6 border border-[#C9B89A]/40 bg-[#14110E] space-y-4 max-w-lg mx-auto text-left">
              <div className="flex items-center space-x-3 pb-3 border-b border-[#E8E0D5]/10">
                <div className="w-8 h-8 rounded-full bg-[#C9B89A]/10 border border-[#C9B89A] flex items-center justify-center text-[#C9B89A] flex-shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#C9B89A] block">
                    ARCHIVE REGISTRATION CONFIRMED
                  </span>
                  <h4 className="font-cormorant text-xl text-[#E8E0D5] font-light uppercase tracking-wide">
                    ALLOCATION REGISTRY NO. {registeredId || 'ORIGINALS-01'}
                  </h4>
                </div>
              </div>

              <div className="space-y-1.5 font-montserrat text-xs text-[#E8E0D5]/80">
                <div className="flex justify-between">
                  <span className="text-[#C9B89A]">REGISTERED CLIENT:</span>
                  <span>{email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#C9B89A]">PROTOCOL:</span>
                  <span>Early Private Access (48hr Priority Window)</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={getWhatsAppUrl(whatsAppWaitlistMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-[#14110E] font-montserrat text-[10px] uppercase tracking-[0.2em] font-semibold flex items-center justify-center space-x-2 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>CONFIRM ON WHATSAPP</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="button"
                  onClick={() => setJoinedWaitlist(false)}
                  className="py-3 px-4 border border-[#E8E0D5]/20 hover:border-[#E8E0D5] text-[#E8E0D5]/70 hover:text-[#E8E0D5] font-montserrat text-[10px] uppercase tracking-[0.2em] transition-colors text-center"
                >
                  REGISTER ANOTHER EMAIL
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleWaitlist} className="space-y-4 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter confidential email for numbered allocation"
                className="w-full bg-[#1A1611] border border-[#E8E0D5]/20 px-4 py-3 text-xs text-[#E8E0D5] font-montserrat placeholder-[#E8E0D5]/30 text-center focus:outline-none focus:border-[#E8E0D5]"
              />
              <button
                type="submit"
                id="originals-register-btn"
                disabled={isSubmitting}
                className="w-full py-3.5 border border-[#E8E0D5] hover:border-[#C4623A] bg-[#1A1611] hover:bg-[#C4623A] text-[#E8E0D5] hover:text-[#F5EFE4] transition-all font-montserrat text-xs uppercase tracking-[0.25em] font-medium"
              >
                {isSubmitting ? 'RECORDING IN ARCHIVE...' : 'REQUEST ALLOCATION ACCESS'}
              </button>
            </form>
          )}
        </div>

        {/* Back to Wardrobe */}
        <div className="text-center pt-4">
          <button
            onClick={onExploreWardrobe}
            className="group relative font-montserrat text-[11px] uppercase tracking-[0.28em] text-[#E8E0D5] hover:text-[#C4623A] transition-colors py-2 inline-flex items-center space-x-2"
          >
            <span>EXPLORE LIVE WARDROBE LOOKS</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
