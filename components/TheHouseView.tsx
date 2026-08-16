'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Mail, Check, ArrowRight } from 'lucide-react';
import { BRAND_STORY } from '../lib/data';

interface TheHouseViewProps {
  onExploreWardrobe: () => void;
}

export default function TheHouseView({ onExploreWardrobe }: TheHouseViewProps) {
  const [inquiryType, setInquiryType] = useState<'press' | 'client' | 'atelier'>('client');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div id="the-house-page" className="w-full min-h-screen bg-[#1A1611] text-[#E8E0D5] pt-28 pb-32">
      <div className="max-w-4xl mx-auto px-6 sm:px-12 space-y-24">
        {/* Section 1: The Founding Statement */}
        <section id="founding-statement" className="space-y-8 text-center pt-8">
          <div className="flex items-center justify-center space-x-3">
            <span className="font-montserrat text-[10px] uppercase tracking-[0.3em] text-[#C9B89A]">
              THE THESIS
            </span>
            <span className="text-[#E8E0D5]/30">·</span>
            <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[#E8E0D5]/60">
              METAMORPHOO HOUSE
            </span>
          </div>

          <h1 className="font-cormorant font-light text-5xl sm:text-7xl lg:text-8xl uppercase tracking-[0.16em] text-[#E8E0D5] leading-none">
            THE HOUSE
          </h1>

          <div className="space-y-6 max-w-2xl mx-auto text-left sm:text-justify">
            <p className="font-montserrat text-sm sm:text-base text-[#E8E0D5]/90 font-light leading-relaxed">
              {BRAND_STORY.foundingStatement}
            </p>
            <p className="font-montserrat text-xs sm:text-sm text-[#E8E0D5]/70 font-light leading-relaxed">
              We reject the friction of infinite scrolling, algorithmic recommendations, and disposable trends. By curating every piece into a total, unified presence, METAMORPHOO returns dressing to its rightful stature as an art of uncompromising composure.
            </p>
          </div>
        </section>

        {/* Section 2: The Philosophy */}
        <section id="philosophy-section" className="py-12 border-y border-[#E8E0D5]/15 text-center space-y-6">
          <span className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-[#C9B89A]">
            THE METAMORPHOO PHILOSOPHY
          </span>

          <blockquote className="font-cormorant italic text-3xl sm:text-4xl lg:text-5xl text-[#F5EFE4] font-light max-w-3xl mx-auto tracking-wide leading-tight">
            &ldquo;{BRAND_STORY.philosophy}&rdquo;
          </blockquote>

          <p className="font-montserrat text-xs sm:text-sm text-[#E8E0D5]/70 max-w-xl mx-auto font-light leading-relaxed">
            {BRAND_STORY.philosophyExpanded}
          </p>
        </section>

        {/* Section 3: The House Structure (EDIT → ORIGINALS → ATELIER) */}
        <section id="house-structure-section" className="space-y-10">
          <div className="text-center space-y-2">
            <span className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-[#C9B89A]">
              THE ARCHITECTURE
            </span>
            <h2 className="font-cormorant text-3xl sm:text-4xl text-[#E8E0D5] font-light uppercase tracking-[0.18em]">
              THE THREE TIERS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BRAND_STORY.houseStructure.map((tier, idx) => (
              <div
                key={tier.tier}
                id={`tier-card-${tier.tier.toLowerCase()}`}
                className="bg-[#14110E] p-8 border border-[#E8E0D5]/10 space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-cormorant text-2xl font-light text-[#E8E0D5] tracking-[0.2em]">
                      {tier.tier}
                    </span>
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[#C9B89A] border border-[#C9B89A]/30 px-2 py-0.5">
                      {tier.status}
                    </span>
                  </div>

                  <h3 className="font-montserrat text-xs uppercase tracking-[0.2em] text-[#E8E0D5]/80 font-medium">
                    {tier.title}
                  </h3>

                  <p className="font-montserrat text-xs text-[#E8E0D5]/60 font-light leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E8E0D5]/5">
                  <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#E8E0D5]/40">
                    TIER 0{idx + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: The Founder — Ani Chisom */}
        <section id="founder-section" className="bg-[#14110E] p-8 sm:p-12 border border-[#E8E0D5]/15">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 relative aspect-[4/5] bg-[#1A1611] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85"
                alt="Ani Chisom — Founder"
                fill
                className="object-cover object-center grayscale contrast-125"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1611]/80 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="font-montserrat text-[8px] uppercase tracking-[0.25em] text-[#E8E0D5]/80">
                  LAGOS · LISBON · MILAN
                </span>
              </div>
            </div>

            <div className="md:col-span-8 space-y-4">
              <span className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-[#C9B89A]">
                CREATIVE DIRECTION
              </span>
              <h2 className="font-cormorant text-3xl sm:text-4xl text-[#E8E0D5] font-light uppercase tracking-[0.16em]">
                {BRAND_STORY.founder.name}
              </h2>
              <p className="font-montserrat text-xs uppercase tracking-[0.2em] text-[#E8E0D5]/60">
                {BRAND_STORY.founder.title}
              </p>
              <p className="font-montserrat text-xs sm:text-sm text-[#E8E0D5]/80 font-light leading-relaxed">
                {BRAND_STORY.founder.bio}
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Contact & Concierge Enquiries */}
        <section id="contact-section" className="space-y-8 pt-4">
          <div className="text-center space-y-2">
            <span className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-[#C9B89A]">
              CORRESPONDENCE
            </span>
            <h2 className="font-cormorant text-3xl sm:text-4xl text-[#E8E0D5] font-light uppercase tracking-[0.18em]">
              CONTACT & ENQUIRIES
            </h2>
            <p className="font-montserrat text-xs text-[#E8E0D5]/60 font-light">
              Press correspondence, private client appointments, and ATELIER bespoke dialogue.
            </p>
          </div>

          <div className="bg-[#14110E] p-8 sm:p-10 border border-[#E8E0D5]/15 max-w-2xl mx-auto">
            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-10 h-10 mx-auto rounded-full border border-[#C4623A] flex items-center justify-center text-[#C4623A]">
                  <Check className="w-5 h-5" />
                </div>
                <h3 className="font-cormorant text-2xl text-[#E8E0D5] uppercase tracking-wider">
                  DISPATCH RECEIVED
                </h3>
                <p className="font-montserrat text-xs text-[#E8E0D5]/70 max-w-sm mx-auto font-light">
                  The Metamorphoo concierge will review your inquiry within one business day.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[#C9B89A] hover:text-[#E8E0D5] underline pt-4"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Inquiry Type */}
                <div className="flex gap-2">
                  {[
                    { id: 'client', label: 'Wardrobe Client' },
                    { id: 'press', label: 'Press / Editorial' },
                    { id: 'atelier', label: 'ATELIER Commission' },
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setInquiryType(type.id as any)}
                      className={`flex-1 py-2 text-[10px] font-montserrat tracking-[0.18em] uppercase transition-colors border ${
                        inquiryType === type.id
                          ? 'border-[#E8E0D5] bg-[#E8E0D5] text-[#1A1611] font-medium'
                          : 'border-[#E8E0D5]/20 text-[#E8E0D5]/60 hover:border-[#E8E0D5]/40'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#E8E0D5]/60 mb-1.5">
                      YOUR NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Elena Rostova"
                      className="w-full bg-[#1A1611] border border-[#E8E0D5]/20 px-4 py-3 text-xs text-[#E8E0D5] font-montserrat placeholder-[#E8E0D5]/25 focus:outline-none focus:border-[#E8E0D5]"
                    />
                  </div>

                  <div>
                    <label className="block font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#E8E0D5]/60 mb-1.5">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="concierge@example.com"
                      className="w-full bg-[#1A1611] border border-[#E8E0D5]/20 px-4 py-3 text-xs text-[#E8E0D5] font-montserrat placeholder-[#E8E0D5]/25 focus:outline-none focus:border-[#E8E0D5]"
                    />
                  </div>

                  <div>
                    <label className="block font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#E8E0D5]/60 mb-1.5">
                      MESSAGE / INQUIRY
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Provide details regarding your inquiry or commission..."
                      className="w-full bg-[#1A1611] border border-[#E8E0D5]/20 px-4 py-3 text-xs text-[#E8E0D5] font-montserrat placeholder-[#E8E0D5]/25 focus:outline-none focus:border-[#E8E0D5] resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="submit-house-inquiry-btn"
                  className="w-full py-4 border border-[#E8E0D5] hover:border-[#C4623A] bg-[#1A1611] hover:bg-[#C4623A] text-[#E8E0D5] hover:text-[#F5EFE4] transition-all font-montserrat text-xs uppercase tracking-[0.25em] font-medium"
                >
                  DISPATCH INQUIRY
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Bottom CTA to return to Wardrobe */}
        <div className="text-center pt-8">
          <button
            id="return-to-wardrobe-btn"
            onClick={onExploreWardrobe}
            className="group relative font-montserrat text-[11px] uppercase tracking-[0.28em] text-[#E8E0D5] hover:text-[#C4623A] transition-colors py-2 inline-flex items-center space-x-2"
          >
            <span>RETURN TO THE WARDROBE</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
