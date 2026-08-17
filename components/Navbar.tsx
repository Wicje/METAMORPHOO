'use client';

import React, { useState } from 'react';
import { ShoppingBag, Bookmark, Globe, Menu, X, Check, Sun, Moon, Sparkles, Palette } from 'lucide-react';
import { CURRENCIES, CurrencyCode, currencyStore, useCurrency } from '../lib/currency';
import { useLedger } from '../lib/ledger-store';
import { themeStore, useTheme } from '../lib/theme';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenLedger: () => void;
  onOpenCurator: () => void;
}

export default function Navbar({
  activeTab,
  onSelectTab,
  cartCount,
  onOpenCart,
  onOpenLedger,
  onOpenCurator,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const currency = useCurrency();
  const ledger = useLedger();
  const theme = useTheme();

  const savedCount = ledger.savedLooks.length + ledger.savedItems.length;

  const navItems = [
    { id: 'wardrobe', label: 'THE WARDROBE' },
    { id: 'archive', label: 'ARCHIVE VAULT' },
    { id: 'edit', label: 'EDIT' },
    { id: 'originals', label: 'ORIGINALS' },
    { id: 'house', label: 'THE HOUSE' },
  ];

  const handleCurrencySelect = (code: CurrencyCode) => {
    currencyStore.setCurrency(code);
    setCurrencyDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--bg-surface)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 h-20 sm:h-24 flex items-center justify-between">
        {/* Left: Brand Monogram & Wordmark */}
        <div className="flex items-center">
          <button
            id="brand-home-btn"
            onClick={() => onSelectTab('wardrobe')}
            className="flex items-center text-left focus:outline-none group py-2"
          >
            <span className="font-cormorant font-light text-2xl sm:text-[26px] tracking-[0.28em] text-[var(--text-primary)] group-hover:text-[var(--color-rust)] transition-colors">
              METAMORPHOO
            </span>
          </button>
        </div>

        {/* Center: Desktop Architecture Navigation with generous breathing room */}
        <nav className="hidden md:flex items-center space-x-8 lg:space-x-12">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`font-montserrat text-[11px] uppercase tracking-[0.28em] transition-all duration-200 py-2 relative ${
                  isActive
                    ? 'text-[var(--text-primary)] font-medium'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[var(--text-primary)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Palette Switcher, Currency, Studio, Ledger & Wardrobe Bag with rhythmic dividers */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Palette Mode Switcher (Obsidian vs Warm Bone Linen) */}
          <button
            id="palette-toggle-btn"
            onClick={() => themeStore.toggleTheme()}
            className="flex items-center space-x-1.5 font-montserrat text-[10px] uppercase tracking-[0.22em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2 py-1.5 border border-transparent hover:border-[var(--border-medium)] transition-all"
            title={`Switch to ${theme === 'obsidian' ? 'Warm Bone Linen Light Mode' : 'Smoked Obsidian Dark Mode'}`}
          >
            {theme === 'obsidian' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#C9B89A]" />
                <span className="hidden xl:inline-block">BONE</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#8C7A6B]" />
                <span className="hidden xl:inline-block">OBSIDIAN</span>
              </>
            )}
          </button>

          {/* Multi-Currency Dropdown */}
          <div className="relative">
            <button
              id="currency-selector-btn"
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center space-x-1 font-montserrat text-[10px] uppercase tracking-[0.22em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2 py-1.5 border border-transparent hover:border-[var(--border-medium)] transition-all"
              title="Select settlement currency"
            >
              <Globe className="w-3 h-3 text-[var(--color-sand)]" />
              <span>{currency}</span>
            </button>

            {currencyDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--bg-surface)] border border-[var(--border-medium)] shadow-2xl p-2 z-50 space-y-1">
                <span className="font-montserrat text-[8px] uppercase tracking-[0.25em] text-[var(--color-sand)] px-2 py-1 block">
                  SETTLEMENT CURRENCY
                </span>
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
                  const cfg = CURRENCIES[code];
                  return (
                    <button
                      key={code}
                      onClick={() => handleCurrencySelect(code)}
                      className={`w-full text-left px-2.5 py-1.5 font-montserrat text-[10px] flex items-center justify-between transition-colors ${
                        currency === code
                          ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] font-medium'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]/50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-[var(--color-sand)]">{cfg.symbol}</span>
                        <span>{cfg.label}</span>
                      </div>
                      {currency === code && <Check className="w-3 h-3 text-[var(--color-rust)]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="hidden sm:block h-4 w-[1px] bg-[var(--border-subtle)]" />

          {/* Atelier Curator Studio Desk Button */}
          <button
            id="open-atelier-studio-btn"
            onClick={onOpenCurator}
            className="flex items-center space-x-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-2.5 py-1.5 border border-[var(--border-subtle)] hover:border-[var(--color-sand)] focus:outline-none"
            title="Open Atelier Curator Studio (Upload looks & collections)"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-sand)]" />
            <span className="font-montserrat text-[10px] uppercase tracking-[0.22em] hidden lg:inline-block">
              STUDIO
            </span>
          </button>

          {/* Private Ledger */}
          <button
            id="open-ledger-btn"
            onClick={onOpenLedger}
            className="flex items-center space-x-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-2 py-1.5 focus:outline-none relative"
            title="Open Private Ledger"
          >
            <Bookmark className="w-3.5 h-3.5 text-[var(--color-sand)]" />
            <span className="font-montserrat text-[10px] uppercase tracking-[0.22em] hidden sm:inline-block">
              LEDGER
            </span>
            {savedCount > 0 && (
              <span className="w-4 h-4 bg-[var(--color-rust)] text-[#F5EFE4] text-[9px] font-montserrat font-medium rounded-full flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          <div className="hidden sm:block h-4 w-[1px] bg-[var(--border-subtle)]" />

          {/* Wardrobe Cart Bag */}
          <button
            id="open-wardrobe-bag-btn"
            onClick={onOpenCart}
            className="flex items-center space-x-2 text-[var(--text-primary)] hover:text-[var(--color-rust)] transition-colors px-2.5 py-1.5 focus:outline-none group"
            aria-label={`View Wardrobe (${cartCount} items)`}
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-[var(--color-rust)] text-[#F5EFE4] text-[9px] font-montserrat font-medium rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] hidden sm:inline-block">
              WARDROBE
            </span>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-none ml-1"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] px-6 py-6 space-y-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left font-montserrat text-xs uppercase tracking-[0.25em] py-2 ${
                activeTab === item.id
                  ? 'text-[var(--text-primary)] font-medium'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
            <button
              onClick={() => {
                themeStore.toggleTheme();
                setMobileMenuOpen(false);
              }}
              className="font-montserrat text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)] flex items-center space-x-2"
            >
              {theme === 'obsidian' ? <Sun className="w-4 h-4 text-[#C9B89A]" /> : <Moon className="w-4 h-4 text-[#8C7A6B]" />}
              <span>{theme === 'obsidian' ? 'SWITCH TO WARM BONE LIGHT' : 'SWITCH TO OBSIDIAN DARK'}</span>
            </button>

            <button
              onClick={() => {
                onOpenCurator();
                setMobileMenuOpen(false);
              }}
              className="font-montserrat text-[10px] uppercase tracking-[0.2em] text-[var(--color-sand)] flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ATELIER STUDIO</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
