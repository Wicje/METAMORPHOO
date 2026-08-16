'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Archive, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Look, Item } from '../lib/types';

interface ArchiveVaultViewProps {
  vaultLooks: Look[];
  onSelectLook: (look: Look) => void;
  onSelectItem: (item: Item, look: Look) => void;
}

export default function ArchiveVaultView({
  vaultLooks,
  onSelectLook,
  onSelectItem,
}: ArchiveVaultViewProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 sm:py-20 space-y-16">
      {/* Header Context */}
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center space-x-2 text-[#C4623A]">
          <Archive className="w-4 h-4" />
          <span className="font-montserrat text-[10px] uppercase tracking-[0.28em] font-medium">
            SEASONAL ARCHIVE VAULT
          </span>
        </div>

        <h1 className="font-cormorant font-light text-4xl sm:text-6xl text-[#E8E0D5] uppercase tracking-[0.14em] leading-tight">
          THE ARCHIVE VAULT
        </h1>

        <p className="font-montserrat text-xs sm:text-sm text-[#E8E0D5]/70 font-light leading-relaxed">
          The permanent historical register of past METAMORPHOO seasonal releases. Vaulted ensembles represent closed production chapters. Pieces remain preserved for provenance research, client ledgers, and bespoke private commission through ATELIER.
        </p>

        {/* Archival Protocol Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs font-montserrat">
          <div className="p-4 bg-[#14110E] border border-[#E8E0D5]/10 space-y-1.5">
            <span className="text-[#C9B89A] uppercase tracking-[0.2em] text-[9px] block">
              RELEASE CADENCE
            </span>
            <p className="text-[#E8E0D5]/80 font-light">
              4 to 6 deliberate looks per active season. Once closed, looks move to this permanent vault.
            </p>
          </div>

          <div className="p-4 bg-[#14110E] border border-[#E8E0D5]/10 space-y-1.5">
            <span className="text-[#C9B89A] uppercase tracking-[0.2em] text-[9px] block">
              BESPOKE RE-COMMISSION
            </span>
            <p className="text-[#E8E0D5]/80 font-light">
              Vaulted silhouettes can be re-commissioned in one-of-one editions through ATELIER consultation.
            </p>
          </div>
        </div>
      </div>

      {/* Vaulted Looks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16">
        {vaultLooks.map((look) => (
          <div
            key={look.id}
            className="bg-[#14110E] border border-[#E8E0D5]/15 overflow-hidden flex flex-col justify-between group"
          >
            {/* Editorial Hero Frame with Vault Stamp */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#1A1611]">
              <Image
                src={look.heroImage}
                alt={look.name}
                fill
                className="object-cover object-center group-hover:scale-102 transition-transform duration-700 filter grayscale-[25%]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14110E] via-transparent to-transparent opacity-80" />

              {/* Status Badge */}
              <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
                <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#F5EFE4] bg-[#C4623A] px-2.5 py-1 flex items-center space-x-1 font-medium">
                  <Lock className="w-3 h-3" />
                  <span>VAULTED EDITION</span>
                </span>
                <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#C9B89A] bg-[#1A1611]/90 px-2.5 py-1">
                  {look.tier}
                </span>
              </div>

              {/* Garments in this Look Pills */}
              <div className="absolute bottom-4 left-4 right-4 z-10 space-y-2">
                <span className="font-montserrat text-[8px] uppercase tracking-[0.25em] text-[#E8E0D5]/50 block">
                  ARCHIVED ENSEMBLE PIECES ({look.items.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {look.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onSelectItem(item, look)}
                      className="font-montserrat text-[9px] uppercase tracking-[0.15em] text-[#E8E0D5] bg-[#1A1611]/90 hover:bg-[#E8E0D5] hover:text-[#1A1611] transition-colors px-2 py-1 border border-[#E8E0D5]/15"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Look Meta & Info */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <span className="font-montserrat text-[10px] uppercase tracking-[0.28em] text-[#C9B89A] block">
                  {look.season}
                </span>
                <h3 className="font-cormorant font-light text-3xl sm:text-4xl text-[#E8E0D5] uppercase tracking-wider">
                  {look.name}
                </h3>
              </div>

              <p className="font-cormorant italic text-lg text-[#E8E0D5]/80 font-light">
                &ldquo;{look.statementQuote}&rdquo;
              </p>

              <p className="font-montserrat text-xs text-[#E8E0D5]/70 font-light leading-relaxed">
                {look.longThesis}
              </p>

              {/* Rule Broken */}
              <div className="p-3 bg-[#1A1611] border border-[#E8E0D5]/10 space-y-1">
                <span className="font-montserrat text-[8px] uppercase tracking-[0.25em] text-[#C4623A] block">
                  HISTORICAL RULE BROKEN
                </span>
                <p className="font-montserrat text-[11px] text-[#E8E0D5]/80 font-light">
                  {look.oneRuleBroken}
                </p>
              </div>

              {/* Action */}
              <button
                onClick={() => onSelectLook(look)}
                className="w-full py-4 border border-[#E8E0D5]/30 hover:border-[#E8E0D5] bg-transparent text-[#E8E0D5] font-montserrat text-xs uppercase tracking-[0.25em] transition-all flex items-center justify-center space-x-2"
              >
                <span>INSPECT HISTORICAL RECORD</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Historical Register Footnote */}
      <div className="p-6 border border-[#E8E0D5]/10 bg-[#14110E] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center space-x-3">
          <ShieldCheck className="w-5 h-5 text-[#C9B89A]" />
          <div>
            <h4 className="font-cormorant text-lg text-[#E8E0D5] uppercase tracking-wider">
              PERMANENT METAMORPHOO REGISTER
            </h4>
            <p className="font-montserrat text-[10px] text-[#E8E0D5]/50 uppercase tracking-[0.2em]">
              All items authenticated & logged in immutable curatorial ledger
            </p>
          </div>
        </div>

        <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#C4623A] font-medium">
          VOL. 01 — ARCHIVE 2024–2025
        </span>
      </div>
    </div>
  );
}
