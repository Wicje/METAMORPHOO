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
    <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-24 space-y-20">
      {/* Header Context */}
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center space-x-2 text-[var(--color-rust)]">
          <Archive className="w-4 h-4" />
          <span className="font-montserrat text-[10px] uppercase tracking-[0.28em] font-medium">
            SEASONAL ARCHIVE VAULT
          </span>
        </div>

        <h1 className="font-cormorant font-light text-4xl sm:text-6xl text-[var(--text-primary)] uppercase tracking-[0.14em] leading-tight">
          THE ARCHIVE VAULT
        </h1>

        <p className="font-montserrat text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
          The permanent historical register of past METAMORPHOO seasonal releases. Vaulted ensembles represent closed production chapters. Pieces remain preserved for provenance research, client ledgers, and bespoke private commission through ATELIER.
        </p>

        {/* Archival Protocol Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs font-montserrat">
          <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
            <span className="text-[var(--color-sand)] uppercase tracking-[0.2em] text-[9px] block font-medium">
              RELEASE CADENCE
            </span>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed">
              4 to 6 deliberate looks per active season. Once closed, looks move to this permanent vault.
            </p>
          </div>

          <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
            <span className="text-[var(--color-sand)] uppercase tracking-[0.2em] text-[9px] block font-medium">
              BESPOKE RE-COMMISSION
            </span>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed">
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
            className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-hidden flex flex-col justify-between group"
          >
            {/* Editorial Hero Frame with Vault Stamp */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--bg-canvas)]">
              <Image
                src={look.heroImage}
                alt={look.name}
                fill
                className="object-cover object-center group-hover:scale-102 transition-transform duration-700 filter grayscale-[20%]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface)] via-transparent to-transparent opacity-80" />

              {/* Status Badge */}
              <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
                <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#F5EFE4] bg-[var(--color-rust)] px-2.5 py-1 flex items-center space-x-1 font-medium">
                  <Lock className="w-3 h-3" />
                  <span>VAULTED EDITION</span>
                </span>
                <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--color-sand)] bg-[var(--bg-canvas)]/90 px-2.5 py-1">
                  {look.tier}
                </span>
              </div>

              {/* Garments in this Look Pills */}
              <div className="absolute bottom-4 left-4 right-4 z-10 space-y-2">
                <span className="font-montserrat text-[8px] uppercase tracking-[0.25em] text-[var(--text-muted)] block">
                  ARCHIVED ENSEMBLE PIECES ({look.items.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {look.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onSelectItem(item, look)}
                      className="font-montserrat text-[9px] uppercase tracking-[0.15em] text-[var(--text-primary)] bg-[var(--bg-canvas)]/90 hover:bg-[var(--text-primary)] hover:text-[var(--bg-surface)] transition-colors px-2.5 py-1 border border-[var(--border-subtle)]"
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
                <span className="font-montserrat text-[10px] uppercase tracking-[0.28em] text-[var(--color-sand)] block">
                  {look.season}
                </span>
                <h3 className="font-cormorant font-light text-3xl sm:text-4xl text-[var(--text-primary)] uppercase tracking-wider">
                  {look.name}
                </h3>
              </div>

              <p className="font-cormorant italic text-lg text-[var(--text-secondary)] font-light">
                &ldquo;{look.statementQuote}&rdquo;
              </p>

              <p className="font-montserrat text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                {look.longThesis}
              </p>

              {/* Rule Broken */}
              <div className="p-4 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] space-y-1">
                <span className="font-montserrat text-[8px] uppercase tracking-[0.25em] text-[var(--color-rust)] block font-semibold">
                  HISTORICAL RULE BROKEN
                </span>
                <p className="font-montserrat text-[11px] text-[var(--text-secondary)] font-light">
                  {look.oneRuleBroken}
                </p>
              </div>

              {/* Action */}
              <button
                onClick={() => onSelectLook(look)}
                className="w-full py-4 border border-[var(--border-medium)] hover:border-[var(--text-primary)] bg-transparent text-[var(--text-primary)] font-montserrat text-xs uppercase tracking-[0.25em] transition-all flex items-center justify-center space-x-2"
              >
                <span>INSPECT HISTORICAL RECORD</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Historical Register Footnote */}
      <div className="p-6 border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center space-x-3">
          <ShieldCheck className="w-5 h-5 text-[var(--color-sand)]" />
          <div>
            <h4 className="font-cormorant text-lg text-[var(--text-primary)] uppercase tracking-wider font-light">
              PERMANENT METAMORPHOO REGISTER
            </h4>
            <p className="font-montserrat text-[10px] text-[var(--text-muted)] uppercase tracking-[0.2em]">
              All items authenticated & logged in immutable curatorial ledger
            </p>
          </div>
        </div>

        <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--color-rust)] font-medium">
          VOL. 01 — ARCHIVE 2024–2026
        </span>
      </div>
    </div>
  );
}
