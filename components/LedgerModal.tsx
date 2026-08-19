'use client';

import React from 'react';
import EditorialImage from './EditorialImage';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Bookmark,
  Trash2,
  ArrowRight,
  Printer,
  FileText,
} from 'lucide-react';
import { useLedger, ledgerStore } from '../lib/ledger-store';
import { useCatalog } from '../lib/catalog-store';
import { Look, Item } from '../lib/types';
import { CURRENCIES, useCurrency } from '../lib/currency';

interface LedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLook: (look: Look) => void;
  onSelectItem: (item: Item, look: Look) => void;
}

export default function LedgerModal({
  isOpen,
  onClose,
  onSelectLook,
  onSelectItem,
}: LedgerModalProps) {
  const ledger = useLedger();
  const catalog = useCatalog();
  const currency = useCurrency();

  if (!isOpen) return null;

  const currentCurrencyConfig = CURRENCIES[currency] || CURRENCIES.USD;
  const allLooks = [...catalog.customLaunchLooks, ...catalog.customArchiveLooks];

  // Resolve saved looks objects
  const savedLookObjects = ledger.savedLooks
    .map((sl) => allLooks.find((l) => l.id === sl.lookId))
    .filter((l): l is Look => Boolean(l));

  // Resolve saved individual items
  const savedItemObjects = ledger.savedItems
    .map((si) => {
      for (const l of allLooks) {
        const found = l.items.find((i) => i.id === si.itemId);
        if (found) {
          return { item: found, look: l };
        }
      }
      return null;
    })
    .filter((entry): entry is { item: Item; look: Look } => Boolean(entry));

  const totalSavedCount = savedLookObjects.length + savedItemObjects.length;

  const handlePrintDossier = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#14110E]/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.aside
          id="private-ledger-modal"
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          className="absolute inset-4 sm:inset-10 md:inset-16 bg-[var(--bg-canvas)] border border-[var(--border-medium)] flex flex-col justify-between shadow-2xl overflow-hidden max-w-5xl mx-auto rounded-none text-[var(--text-primary)]"
        >
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface)] z-10">
            <div>
              <span className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-[var(--color-sand)] block font-medium">
                METAMORPHOO PRIVATE CLIENT REGISTER
              </span>
              <h2 className="font-cormorant font-light text-2xl sm:text-3xl text-[var(--text-primary)] uppercase tracking-wider flex items-center space-x-2">
                <span>YOUR PRIVATE LEDGER</span>
                <span className="text-sm font-montserrat text-[var(--color-rust)]">({totalSavedCount})</span>
              </h2>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-4">
              {totalSavedCount > 0 && (
                <>
                  <button
                    onClick={handlePrintDossier}
                    className="font-montserrat text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 border border-[var(--border-medium)] hover:border-[var(--color-sand)] hover:text-[var(--color-sand)] text-[var(--text-primary)] transition-colors flex items-center space-x-1.5"
                    title="Export printable sartorial dossier"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">EXPORT DOSSIER</span>
                  </button>
                  <button
                    onClick={() => ledgerStore.clearLedger()}
                    className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-[var(--color-rust)] transition-colors"
                  >
                    CLEAR
                  </button>
                </>
              )}
              <button
                id="close-ledger-modal-btn"
                onClick={onClose}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors focus:outline-none"
                aria-label="Close Private Ledger"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-10">
            {totalSavedCount === 0 ? (
              <div className="py-24 text-center space-y-4">
                <Bookmark className="w-10 h-10 mx-auto text-[var(--text-muted)] stroke-[1]" />
                <h3 className="font-cormorant text-2xl text-[var(--text-primary)] uppercase tracking-wider font-light">
                  NO ENTRIES IN PRIVATE LEDGER
                </h3>
                <p className="font-montserrat text-xs text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
                  Record complete looks or individual curated pieces from the wardrobe scroll to build your personal seasonal wardrobe archive.
                </p>
              </div>
            ) : (
              <>
                {/* Saved Ensembles */}
                {savedLookObjects.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                      <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[var(--color-sand)] font-medium">
                        RECORDED ENSEMBLES ({savedLookObjects.length})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedLookObjects.map((look) => (
                        <div
                          key={look.id}
                          className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-hidden group flex flex-col justify-between"
                        >
                          <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--bg-canvas)]">
                            <EditorialImage
                              src={look.heroImage}
                              alt={look.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface)] via-transparent to-transparent opacity-80" />
                            <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                              <span className="text-[8px] font-montserrat uppercase tracking-[0.2em] bg-[var(--bg-surface)]/90 px-2 py-0.5 text-[var(--color-sand)] font-medium border border-[var(--border-subtle)]">
                                {look.tier}
                              </span>
                              {look.status === 'vaulted' && (
                                <span className="text-[8px] font-montserrat uppercase tracking-[0.2em] bg-[var(--color-rust)] px-2 py-0.5 text-[#F5EFE4]">
                                  VAULTED
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => ledgerStore.toggleSaveLook(look.id)}
                              className="absolute top-2.5 right-2.5 p-1.5 bg-[var(--bg-surface)]/90 text-[var(--color-rust)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]"
                              title="Remove from Ledger"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="p-4 space-y-2">
                            <span className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)] block">
                              {look.subName || look.season}
                            </span>
                            <h4 className="font-cormorant text-xl text-[var(--text-primary)] uppercase tracking-wide">
                              {look.name}
                            </h4>
                            <p className="font-cormorant italic text-xs text-[var(--text-secondary)] line-clamp-1">
                              &ldquo;{look.statementQuote}&rdquo;
                            </p>
                            <button
                              onClick={() => {
                                onSelectLook(look);
                                onClose();
                              }}
                              className="w-full mt-3 py-2.5 border border-[var(--border-medium)] hover:border-[var(--text-primary)] text-[var(--text-primary)] text-[10px] font-montserrat uppercase tracking-[0.2em] transition-colors flex items-center justify-center space-x-2"
                            >
                              <span>ENTER LOOK</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Saved Individual Pieces */}
                {savedItemObjects.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                      <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[var(--color-sand)] font-medium">
                        INDIVIDUAL RECORDED PIECES ({savedItemObjects.length})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedItemObjects.map(({ item, look }) => (
                        <div
                          key={item.id}
                          className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-3.5 flex items-start justify-between group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="relative w-14 h-18 bg-[var(--bg-canvas)] flex-shrink-0 overflow-hidden border border-[var(--border-subtle)]">
                              <EditorialImage
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="font-montserrat text-[8px] uppercase tracking-[0.2em] text-[var(--color-sand)] font-medium">
                                {item.category} · FROM {look.name}
                              </span>
                              <h4 className="font-cormorant text-base text-[var(--text-primary)] uppercase tracking-wide leading-tight">
                                {item.name}
                              </h4>
                              <div className="font-montserrat text-xs text-[var(--text-primary)] font-medium">
                                {currentCurrencyConfig.format(item.price)}
                              </div>
                              <button
                                onClick={() => {
                                  onSelectItem(item, look);
                                  onClose();
                                }}
                                className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[var(--color-sand)] hover:text-[var(--text-primary)] underline pt-1 block"
                              >
                                INSPECT PIECE →
                              </button>
                            </div>
                          </div>

                          <button
                            onClick={() => ledgerStore.toggleSaveItem(item.id, look.id, look.name)}
                            className="p-1 text-[var(--text-muted)] hover:text-[var(--color-rust)]"
                            title="Remove from Ledger"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Note */}
          <div className="p-4 sm:p-6 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] text-center">
            <p className="font-montserrat text-[10px] text-[var(--text-muted)] tracking-wider">
              Private Ledger state persists across your sessions. Curated to Metamorphoo Standard.
            </p>
          </div>
        </motion.aside>
      </div>
    </AnimatePresence>
  );
}
