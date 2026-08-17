'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Mail, Check, ArrowRight, Sun, Moon, Sparkles } from 'lucide-react';
import { BRAND_STORY } from '../lib/data';
import { useTheme, themeStore } from '../lib/theme';

interface TheHouseViewProps {
  onExploreWardrobe: () => void;
}

export default function TheHouseView({ onExploreWardrobe }: TheHouseViewProps) {
  const theme = useTheme();
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
    <div id="the-house-page" className="w-full min-h-screen bg-[var(--bg-surface)] text-[var(--text-primary)] pt-24 sm:pt-28 pb-32 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 sm:px-12 space-y-24">
        {/* Section 1: The Founding Statement */}
        <section id="founding-statement" className="space-y-8 text-center pt-8">
          <div className="flex items-center justify-center space-x-3">
            <span className="font-montserrat text-[10px] uppercase tracking-[0.3em] text-[var(--color-sand)] font-medium">
              THE THESIS
            </span>
            <span className="text-[var(--text-muted)]">·</span>
            <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[var(--text-secondary)]">
              METAMORPHOO HOUSE
            </span>
          </div>

          <h1 className="font-cormorant font-light text-5xl sm:text-7xl lg:text-8xl uppercase tracking-[0.16em] text-[var(--text-primary)] leading-none">
            THE HOUSE
          </h1>

          <div className="space-y-6 max-w-2xl mx-auto text-left sm:text-justify">
            <p className="font-montserrat text-sm sm:text-base text-[var(--text-primary)] font-light leading-relaxed">
              {BRAND_STORY.foundingStatement}
            </p>
            <p className="font-montserrat text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
              We reject the friction of infinite scrolling, algorithmic recommendations, and disposable trends. By curating every piece into a total, unified presence, METAMORPHOO returns dressing to its rightful stature as an art of uncompromising composure.
            </p>
          </div>
        </section>

        {/* Section 2: The Philosophy */}
        <section id="philosophy-section" className="py-12 border-y border-[var(--border-subtle)] text-center space-y-6">
          <span className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-[var(--color-sand)] font-medium">
            THE METAMORPHOO PHILOSOPHY
          </span>

          <blockquote className="font-cormorant italic text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] font-light max-w-3xl mx-auto tracking-wide leading-tight">
            &ldquo;{BRAND_STORY.philosophy}&rdquo;
          </blockquote>

          <p className="font-montserrat text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl mx-auto font-light leading-relaxed">
            {BRAND_STORY.philosophyExpanded}
          </p>
        </section>

        {/* Section 3: The House Structure (EDIT → ORIGINALS → ATELIER) */}
        <section id="house-structure-section" className="space-y-10">
          <div className="text-center space-y-2">
            <span className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-[var(--color-sand)] font-medium">
              THE ARCHITECTURE
            </span>
            <h2 className="font-cormorant text-3xl sm:text-4xl text-[var(--text-primary)] font-light uppercase tracking-[0.18em]">
              THE THREE TIERS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BRAND_STORY.houseStructure.map((tier, idx) => (
              <div
                key={tier.tier}
                id={`tier-card-${tier.tier.toLowerCase()}`}
                className="bg-[var(--bg-canvas)] p-8 border border-[var(--border-subtle)] space-y-5 flex flex-col justify-between hover:border-[var(--border-medium)] transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-cormorant text-2xl font-light text-[var(--text-primary)] tracking-[0.2em]">
                      {tier.tier}
                    </span>
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[var(--color-sand)] border border-[var(--color-sand)]/30 px-2 py-0.5 font-medium">
                      {tier.status}
                    </span>
                  </div>

                  <h3 className="font-montserrat text-xs uppercase tracking-[0.2em] text-[var(--text-primary)] font-medium">
                    {tier.title}
                  </h3>

                  <p className="font-montserrat text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--border-subtle)]">
                  <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
                    TIER 0{idx + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: The Founder — Ani Chisom */}
        <section id="founder-section" className="bg-[var(--bg-canvas)] p-8 sm:p-12 border border-[var(--border-subtle)]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 relative aspect-[4/5] bg-[var(--bg-surface)] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85"
                alt="Ani Chisom — Founder"
                fill
                className="object-cover object-center grayscale contrast-125"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-canvas)]/80 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="font-montserrat text-[8px] uppercase tracking-[0.25em] text-[var(--text-primary)]">
                  LAGOS · LISBON · MILAN
                </span>
              </div>
            </div>

            <div className="md:col-span-8 space-y-4">
              <span className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-[var(--color-sand)] font-medium">
                CREATIVE DIRECTION
              </span>
              <h2 className="font-cormorant text-3xl sm:text-4xl text-[var(--text-primary)] font-light uppercase tracking-[0.16em]">
                {BRAND_STORY.founder.name}
              </h2>
              <p className="font-montserrat text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)] font-medium">
                {BRAND_STORY.founder.title}
              </p>
              <p className="font-montserrat text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
                {BRAND_STORY.founder.bio}
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: The Dual Palette Architecture */}
        <section id="palette-architecture-section" className="bg-[var(--bg-canvas)] p-8 sm:p-12 border border-[var(--border-subtle)] space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[var(--border-subtle)]">
            <div className="space-y-1">
              <span className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-[var(--color-sand)] font-medium">
                SARTORIAL CHROMATICS
              </span>
              <h2 className="font-cormorant text-3xl sm:text-4xl text-[var(--text-primary)] font-light uppercase tracking-[0.16em]">
                THE DUAL PALETTE DOCTRINE
              </h2>
            </div>

            {/* Interactive Switcher */}
            <button
              onClick={() => themeStore.toggleTheme()}
              id="house-palette-toggle-btn"
              className="px-5 py-3 border border-[var(--border-medium)] hover:border-[var(--text-primary)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-montserrat text-[10px] uppercase tracking-[0.25em] flex items-center space-x-2 transition-all shrink-0 group"
            >
              {theme === 'obsidian' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[var(--color-rust)] group-hover:rotate-45 transition-transform" />
                  <span>EXPERIENCE BONE LINEN PALETTE</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[var(--color-sand)] group-hover:-rotate-12 transition-transform" />
                  <span>EXPERIENCE SMOKED OBSIDIAN PALETTE</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className={`p-6 border transition-all ${theme === 'obsidian' ? 'border-[var(--color-sand)]/60 bg-[var(--bg-surface)]' : 'border-[var(--border-subtle)] bg-[var(--bg-surface)]/50'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[var(--color-sand)] font-medium">
                  PALETTE I
                </span>
                <span className="w-3 h-3 rounded-full bg-[#12100E] border border-[var(--color-sand)]/40 inline-block" />
              </div>
              <h3 className="font-cormorant text-2xl text-[var(--text-primary)] uppercase tracking-wide">
                Smoked Obsidian (Dark)
              </h3>
              <p className="font-montserrat text-xs text-[var(--text-secondary)] font-light mt-2 leading-relaxed">
                Formulated for nocturnal salons, private embassy gatherings, and architectural weight. Smoked charcoal undertones accented with muted sand and deep burnt terracotta.
              </p>
            </div>

            <div className={`p-6 border transition-all ${theme === 'bone' ? 'border-[var(--color-rust)]/60 bg-[var(--bg-surface)]' : 'border-[var(--border-subtle)] bg-[var(--bg-surface)]/50'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[var(--color-rust)] font-medium">
                  PALETTE II
                </span>
                <span className="w-3 h-3 rounded-full bg-[#F5EFE4] border border-[#3E3830]/40 inline-block" />
              </div>
              <h3 className="font-cormorant text-2xl text-[var(--text-primary)] uppercase tracking-wide">
                Bone Linen & Alabaster (Light)
              </h3>
              <p className="font-montserrat text-xs text-[var(--text-secondary)] font-light mt-2 leading-relaxed">
                Formulated for midday transit, Mediterranean sea breeze, and natural fibre luminescence. Unbleached organic flax tones accented with deep espresso text and warm earthen ochre.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: Contact & Concierge Enquiries */}
        <section id="contact-section" className="space-y-8 pt-4">
          <div className="text-center space-y-2">
            <span className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-[var(--color-sand)] font-medium">
              CORRESPONDENCE
            </span>
            <h2 className="font-cormorant text-3xl sm:text-4xl text-[var(--text-primary)] font-light uppercase tracking-[0.18em]">
              CONTACT & ENQUIRIES
            </h2>
            <p className="font-montserrat text-xs text-[var(--text-secondary)] font-light">
              Press correspondence, private client appointments, and ATELIER bespoke dialogue.
            </p>
          </div>

          <div className="bg-[var(--bg-canvas)] p-8 sm:p-10 border border-[var(--border-subtle)] max-w-2xl mx-auto">
            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-10 h-10 mx-auto rounded-full border border-[var(--color-rust)] flex items-center justify-center text-[var(--color-rust)]">
                  <Check className="w-5 h-5" />
                </div>
                <h3 className="font-cormorant text-2xl text-[var(--text-primary)] uppercase tracking-wider font-light">
                  DISPATCH RECEIVED
                </h3>
                <p className="font-montserrat text-xs text-[var(--text-secondary)] max-w-sm mx-auto font-light">
                  The Metamorphoo concierge will review your inquiry within one business day.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[var(--color-sand)] hover:text-[var(--text-primary)] underline pt-4"
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
                          ? 'border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-surface)] font-medium'
                          : 'border-[var(--border-medium)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--text-secondary)] mb-1.5 font-medium">
                      YOUR NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Elena Rostova"
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-medium)] px-4 py-3 text-xs text-[var(--text-primary)] font-montserrat placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--text-secondary)] mb-1.5 font-medium">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="concierge@example.com"
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-medium)] px-4 py-3 text-xs text-[var(--text-primary)] font-montserrat placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--text-secondary)] mb-1.5 font-medium">
                      MESSAGE / INQUIRY
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Provide details regarding your inquiry or commission..."
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-medium)] px-4 py-3 text-xs text-[var(--text-primary)] font-montserrat placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] resize-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="submit-house-inquiry-btn"
                  className="w-full py-4 border border-[var(--text-primary)] hover:border-[var(--color-rust)] bg-[var(--bg-surface)] hover:bg-[var(--color-rust)] text-[var(--text-primary)] hover:text-[#F5EFE4] transition-all font-montserrat text-xs uppercase tracking-[0.25em] font-medium"
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
            className="group relative font-montserrat text-[11px] uppercase tracking-[0.28em] text-[var(--text-primary)] hover:text-[var(--color-rust)] transition-colors py-2 inline-flex items-center space-x-2"
          >
            <span>RETURN TO THE WARDROBE</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
