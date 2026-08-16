'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckSquare, Sparkles, BookOpen, Layers, ShieldCheck } from 'lucide-react';
import { BRAND_STORY, LAUNCH_LOOKS } from '../lib/data';

interface CuratorLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CuratorLedgerModal({
  isOpen,
  onClose,
}: CuratorLedgerModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1A1611]/95 backdrop-blur-xl">
        {/* Top Control Bar */}
        <div className="sticky top-0 left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-12 py-5 bg-gradient-to-b from-[#1A1611] to-transparent">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-4 h-4 text-[#C9B89A]" />
            <span className="font-montserrat text-[10px] uppercase tracking-[0.28em] text-[#E8E0D5]">
              METAMORPHOO EDITORIAL BRIEF & GOVERNANCE
            </span>
          </div>

          <button
            id="close-curator-ledger-btn"
            onClick={onClose}
            className="group flex items-center space-x-2 text-[#E8E0D5]/70 hover:text-[#E8E0D5] p-2 focus:outline-none transition-colors"
          >
            <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] hidden sm:inline-block">
              CLOSE
            </span>
            <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
          </button>
        </div>

        {/* Content Body */}
        <div className="max-w-4xl mx-auto px-6 sm:px-12 py-8 space-y-16">
          {/* Header */}
          <div className="text-center space-y-4">
            <span className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-[#C9B89A]">
              CREATIVE DIRECTIVE & ARCHITECTURE
            </span>
            <h1 className="font-cormorant font-light text-4xl sm:text-6xl text-[#E8E0D5] uppercase tracking-[0.16em]">
              THE EDITORIAL SYSTEM
            </h1>
            <p className="font-montserrat text-xs text-[#E8E0D5]/70 max-w-xl mx-auto font-light leading-relaxed">
              The creative backbone of the METAMORPHOO Wardrobe. Defining the look naming criteria, photography rules, curation gates, and the one-rule-broken doctrine.
            </p>
          </div>

          {/* Part 1: Look Naming Criteria */}
          <div className="bg-[#14110E] p-8 border border-[#E8E0D5]/10 space-y-6">
            <div className="space-y-2">
              <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#C9B89A] block">
                PART 01 · THE NAMING CRITERIA
              </span>
              <h2 className="font-cormorant text-2xl sm:text-3xl text-[#E8E0D5] font-light uppercase tracking-wider">
                The 4 Naming Tests
              </h2>
            </div>

            <p className="font-montserrat text-xs text-[#E8E0D5]/80 font-light leading-relaxed">
              {BRAND_STORY.editorialManifesto.rule}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {BRAND_STORY.editorialManifesto.criteria.map((crit, idx) => (
                <div key={idx} className="p-3.5 bg-[#1A1611] border border-[#E8E0D5]/10 flex items-start space-x-3">
                  <span className="font-montserrat text-xs text-[#C9B89A] font-mono">0{idx + 1}</span>
                  <span className="font-montserrat text-xs text-[#E8E0D5]/80 font-light">{crit}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-[#1A1611]/80 text-xs font-montserrat">
              <div className="space-y-1">
                <span className="text-[#E8E0D5]/40 text-[9px] uppercase tracking-[0.2em] block">NEVER</span>
                <p className="text-[#E8E0D5]/60 line-through">The Classic Look, The Summer Outfit, Look 3, Cream Knit Set</p>
              </div>
              <div className="space-y-1">
                <span className="text-[#C9B89A] text-[9px] uppercase tracking-[0.2em] block">ALWAYS</span>
                <p className="text-[#E8E0D5]">The Sovereign, The Attache, The Meridian, The Nocturne</p>
              </div>
            </div>
          </div>

          {/* Part 2: The One-Rule-Broken Principle */}
          <div className="bg-[#14110E] p-8 border border-[#E8E0D5]/10 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-[#C4623A]">
                <Sparkles className="w-4 h-4" />
                <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] font-medium">
                  PART 02 · SARTORIAL REBELLION
                </span>
              </div>
              <h2 className="font-cormorant text-2xl sm:text-3xl text-[#E8E0D5] font-light uppercase tracking-wider">
                The One-Rule-Broken Principle
              </h2>
            </div>

            <p className="font-montserrat text-xs text-[#E8E0D5]/80 font-light leading-relaxed">
              {BRAND_STORY.editorialManifesto.oneRuleBrokenPrinciple}
            </p>

            <div className="space-y-3 pt-2">
              {LAUNCH_LOOKS.map((lk) => (
                <div key={lk.id} className="p-3 bg-[#1A1611] border border-[#E8E0D5]/10 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <span className="font-cormorant text-base text-[#E8E0D5]">{lk.name}</span>
                  <span className="font-montserrat text-xs text-[#E8E0D5]/70 italic">{lk.oneRuleBroken}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Part 3: Photography Brief & Atmosphere */}
          <div className="bg-[#14110E] p-8 border border-[#E8E0D5]/10 space-y-6">
            <div className="space-y-2">
              <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#C9B89A] block">
                PART 03 · CINEMATIC PHOTOGRAPHY
              </span>
              <h2 className="font-cormorant text-2xl sm:text-3xl text-[#E8E0D5] font-light uppercase tracking-wider">
                Atmosphere & Provenance
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-montserrat">
              <div className="p-4 bg-[#1A1611] space-y-2">
                <span className="text-[#C9B89A] text-[9px] uppercase tracking-[0.2em] block">LOCATION PATINA</span>
                <p className="text-[#E8E0D5]/70 font-light">
                  Architectural stone, terrazzo floors, wooden shutters, ambiguous coastal port light. No white seamless studios.
                </p>
              </div>
              <div className="p-4 bg-[#1A1611] space-y-2">
                <span className="text-[#C9B89A] text-[9px] uppercase tracking-[0.2em] block">WARM LIGHT</span>
                <p className="text-[#E8E0D5]/70 font-light">
                  Golden hour & morning natural light. Warm bone & sand tone grade. Never cool or blue-shifted.
                </p>
              </div>
              <div className="p-4 bg-[#1A1611] space-y-2">
                <span className="text-[#C9B89A] text-[9px] uppercase tracking-[0.2em] block">VESSEL CASTING</span>
                <p className="text-[#E8E0D5]/70 font-light">
                  Gaze away from lens, unhurried posture, West African and Southern European poise.
                </p>
              </div>
            </div>
          </div>

          {/* Part 4: Approval Gate Checklist */}
          <div className="bg-[#14110E] p-8 border border-[#E8E0D5]/15 space-y-4">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#C9B89A]" />
              <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#C9B89A]">
                APPROVAL GATE
              </span>
            </div>
            <h2 className="font-cormorant text-2xl text-[#E8E0D5] font-light uppercase tracking-wider">
              Signed Off by Ani Chisom
            </h2>
            <div className="space-y-2 text-xs font-montserrat text-[#E8E0D5]/80">
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-3.5 h-3.5 text-[#C9B89A]" />
                <span>Naming check — proper noun, inherited register, passes all 4 criteria</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-3.5 h-3.5 text-[#C9B89A]" />
                <span>Photography check — min 3-5 images, warm grading, negative space &gt; 40%</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-3.5 h-3.5 text-[#C9B89A]" />
                <span>EDIT criteria check — natural fibres, baggy trousers, unbranded elegance</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-3.5 h-3.5 text-[#C9B89A]" />
                <span>One-rule-broken confirmation — intentional rebellious edge</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
