'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Command, Sparkles } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'J / ↓', label: 'Next Wardrobe Look', desc: 'Glide forward in the seasonal scroll' },
    { key: 'K / ↑', label: 'Previous Wardrobe Look', desc: 'Glide backward in the seasonal scroll' },
    { key: 'ESC', label: 'Close Any Modal / Drawer', desc: 'Instantly dismiss active overlays' },
    { key: 'T', label: 'Toggle Chromatic Palette', desc: 'Switch Bone Linen / Smoked Obsidian' },
    { key: 'B', label: 'Wardrobe Acquisition Bag', desc: 'Open / close your acquisition bag' },
    { key: 'L', label: 'Private Client Ledger', desc: 'Open / close recorded looks ledger' },
    { key: '?', label: 'Sartorial Command HUD', desc: 'Toggle this keyboard navigation index' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#14110E]/85 backdrop-blur-md"
        />

        {/* HUD Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="relative z-10 w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-medium)] p-6 sm:p-8 shadow-2xl space-y-6 text-[var(--text-primary)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
            <div className="flex items-center space-x-2.5">
              <Command className="w-4 h-4 text-[var(--color-sand)]" />
              <span className="font-montserrat text-[10px] uppercase tracking-[0.28em] text-[var(--color-sand)] font-medium">
                MAISON NAVIGATION PROTOCOL
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors focus:outline-none"
              aria-label="Close Shortcuts HUD"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h3 className="font-cormorant font-light text-2xl uppercase tracking-wider text-[var(--text-primary)]">
              KEYBOARD SARTORIAL HOTKEYS
            </h3>
            <p className="font-montserrat text-[11px] text-[var(--text-secondary)] font-light mt-1 leading-relaxed">
              Engineered for unhurried, magazine-speed exploration without touching the trackpad.
            </p>
          </div>

          {/* List */}
          <div className="space-y-2.5 font-montserrat">
            {shortcuts.map((sc, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors"
              >
                <div>
                  <span className="text-xs text-[var(--text-primary)] font-medium block">
                    {sc.label}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-light">
                    {sc.desc}
                  </span>
                </div>
                <kbd className="px-2.5 py-1 bg-[var(--bg-surface)] border border-[var(--border-medium)] text-[10px] font-mono tracking-widest text-[var(--color-sand)] font-medium shadow-sm">
                  {sc.key}
                </kbd>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="pt-2 text-center border-t border-[var(--border-subtle)]">
            <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
              PRESS <span className="text-[var(--color-sand)]">ESC</span> AT ANY TIME TO RESUME RUNWAY
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
