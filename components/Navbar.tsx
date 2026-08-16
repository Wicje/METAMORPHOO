'use client';

import React, { useState } from 'react';
import { ShoppingBag, Bookmark, Globe, Menu, X, Check } from 'lucide-react';
import { CURRENCIES, CurrencyCode, currencyStore, useCurrency } from '../lib/currency';
import { useLedger } from '../lib/ledger-store';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenLedger: () => void;
}

export default function Navbar({
  activeTab,
  onSelectTab,
  cartCount,
  onOpenCart,
  onOpenLedger,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const currency = useCurrency();
  const ledger = useLedger();

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
    <header className="sticky top-0 z-40 w-full bg-[#1A1611]/90 backdrop-blur-md border-b border-[#E8E0D5]/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 h-20 flex items-center justify-between">
        {/* Left: Brand Monogram & Wordmark */}
        <div className="flex items-center space-x-3">
          <button
            id="brand-home-btn"
            onClick={() => onSelectTab('wardrobe')}
            className="flex items-center space-x-2 text-left focus:outline-none group"
          >
            <span className="font-cormorant font-normal text-2xl tracking-[0.2em] text-[#E8E0D5] group-hover:text-[#F5EFE4] transition-colors">
              METAMORPHOO
            </span>
          </button>
        </div>

        {/* Center: Desktop Architecture Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`font-montserrat text-[11px] uppercase tracking-[0.25em] transition-all duration-200 py-1 relative ${
                  isActive
                    ? 'text-[#E8E0D5] font-medium'
                    : 'text-[#E8E0D5]/60 hover:text-[#E8E0D5]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#E8E0D5]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Currency Selector, Private Ledger & Wardrobe Bag */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* Multi-Currency Dropdown */}
          <div className="relative">
            <button
              id="currency-selector-btn"
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center space-x-1 font-montserrat text-[10px] uppercase tracking-[0.2em] text-[#E8E0D5]/70 hover:text-[#E8E0D5] p-1.5 border border-transparent hover:border-[#E8E0D5]/20 transition-all"
              title="Select settlement currency"
            >
              <Globe className="w-3 h-3 text-[#C9B89A]" />
              <span>{currency}</span>
            </button>

            {currencyDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#14110E] border border-[#E8E0D5]/20 shadow-2xl p-2 z-50 space-y-1">
                <span className="font-montserrat text-[8px] uppercase tracking-[0.25em] text-[#C9B89A] px-2 py-1 block">
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
                          ? 'bg-[#1A1611] text-[#E8E0D5] font-medium'
                          : 'text-[#E8E0D5]/60 hover:text-[#E8E0D5] hover:bg-[#1A1611]/50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-[#C9B89A]">{cfg.symbol}</span>
                        <span>{cfg.label}</span>
                      </div>
                      {currency === code && <Check className="w-3 h-3 text-[#C4623A]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Private Ledger */}
          <button
            id="open-ledger-btn"
            onClick={onOpenLedger}
            className="flex items-center space-x-1.5 text-[#E8E0D5]/70 hover:text-[#E8E0D5] transition-colors p-1.5 focus:outline-none relative"
            title="Open Private Ledger"
          >
            <Bookmark className="w-4 h-4 text-[#C9B89A]" />
            <span className="font-montserrat text-[10px] uppercase tracking-[0.2em] hidden sm:inline-block">
              LEDGER
            </span>
            {savedCount > 0 && (
              <span className="w-4 h-4 bg-[#C4623A] text-[#F5EFE4] text-[9px] font-montserrat font-medium rounded-full flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          {/* Wardrobe Cart Bag */}
          <button
            id="open-wardrobe-bag-btn"
            onClick={onOpenCart}
            className="flex items-center space-x-2 text-[#E8E0D5]/80 hover:text-[#E8E0D5] transition-colors p-1.5 focus:outline-none group"
            aria-label={`View Wardrobe (${cartCount} items)`}
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-[#E8E0D5] group-hover:text-[#F5EFE4] transition-colors stroke-[1.5]" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#C4623A] text-[#F5EFE4] text-[9px] font-montserrat font-medium rounded-full flex items-center justify-center">
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
            className="md:hidden p-1.5 text-[#E8E0D5]/70 hover:text-[#E8E0D5] focus:outline-none"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1A1611] border-b border-[#E8E0D5]/10 px-6 py-6 space-y-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left font-montserrat text-xs uppercase tracking-[0.25em] py-2 ${
                activeTab === item.id
                  ? 'text-[#E8E0D5] font-medium'
                  : 'text-[#E8E0D5]/60 hover:text-[#E8E0D5]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
