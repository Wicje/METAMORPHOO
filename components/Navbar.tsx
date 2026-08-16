'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  activeTab: 'wardrobe' | 'edit' | 'originals' | 'house';
  setActiveTab: (tab: 'wardrobe' | 'edit' | 'originals' | 'house') => void;
  wardrobeCount: number;
  onOpenWardrobe: () => void;
  onOpenManifesto: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  wardrobeCount,
  onOpenWardrobe,
  onOpenManifesto,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { id: 'wardrobe' | 'edit' | 'originals' | 'house'; label: string }[] = [
    { id: 'wardrobe', label: 'THE WARDROBE' },
    { id: 'edit', label: 'EDIT' },
    { id: 'originals', label: 'ORIGINALS' },
    { id: 'house', label: 'THE HOUSE' },
  ];

  return (
    <>
      <header
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-[#1A1611]/90 backdrop-blur-md border-b border-[#E8E0D5]/10 py-4'
            : 'bg-gradient-to-b from-[#1A1611]/80 via-[#1A1611]/40 to-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
          {/* Brand Monogram / Title */}
          <button
            id="brand-logo-btn"
            onClick={() => {
              setActiveTab('wardrobe');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex items-center space-x-2 text-left focus:outline-none"
          >
            <span className="font-cormorant text-xl sm:text-2xl tracking-[0.28em] text-[#E8E0D5] uppercase font-light transition-colors group-hover:text-[#F5EFE4]">
              METAMORPHOO
            </span>
          </button>

          {/* Desktop Centered Nav */}
          <nav id="desktop-nav" className="hidden md:flex items-center space-x-9 lg:space-x-12">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => {
                    setActiveTab(link.id);
                    if (link.id === 'wardrobe') {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className={`relative font-montserrat text-[11px] lg:text-[12px] uppercase tracking-[0.25em] font-normal transition-colors py-1 ${
                    isActive
                      ? 'text-[#E8E0D5]'
                      : 'text-[#E8E0D5]/60 hover:text-[#E8E0D5]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#E8E0D5]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-5 sm:space-x-6">
            {/* Curator's Brief / Manifesto */}
            <button
              id="curator-manifesto-btn"
              onClick={onOpenManifesto}
              title="Curator's Editorial Brief"
              className="hidden lg:flex items-center space-x-1.5 text-[#E8E0D5]/60 hover:text-[#C4623A] transition-colors text-[10px] tracking-[0.2em] uppercase font-montserrat"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>BRIEF</span>
            </button>

            {/* Wardrobe Cart Bag */}
            <button
              id="wardrobe-bag-btn"
              onClick={onOpenWardrobe}
              className="group flex items-center space-x-2 text-[#E8E0D5] hover:text-[#F5EFE4] transition-colors focus:outline-none"
            >
              <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-105" />
              <span className="font-montserrat text-[10px] sm:text-[11px] uppercase tracking-[0.2em]">
                WARDROBE
                {wardrobeCount > 0 && (
                  <span className="ml-1.5 text-[#C4623A] font-medium">({wardrobeCount})</span>
                )}
              </span>
            </button>

            {/* Mobile Menu Trigger */}
            <button
              id="mobile-menu-trigger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1 text-[#E8E0D5] hover:text-[#F5EFE4] focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu-drawer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-[68px] z-30 bg-[#1A1611]/98 backdrop-blur-xl border-t border-[#E8E0D5]/10 px-8 py-12 flex flex-col justify-between md:hidden"
          >
            <div className="flex flex-col space-y-7 text-center">
              {navLinks.map((link) => {
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    id={`mobile-nav-link-${link.id}`}
                    onClick={() => {
                      setActiveTab(link.id);
                      setMobileMenuOpen(false);
                      if (link.id === 'wardrobe') {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className={`font-montserrat text-[14px] uppercase tracking-[0.28em] py-2 transition-colors ${
                      isActive ? 'text-[#E8E0D5] font-medium' : 'text-[#E8E0D5]/60'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}

              <div className="pt-4 border-t border-[#E8E0D5]/10">
                <button
                  id="mobile-manifesto-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenManifesto();
                  }}
                  className="font-montserrat text-[12px] uppercase tracking-[0.25em] text-[#C9B89A] hover:text-[#E8E0D5] py-2"
                >
                  EDITORIAL BRIEF & CRITERIA
                </button>
              </div>
            </div>

            <div className="text-center pt-8 border-t border-[#E8E0D5]/10">
              <p className="font-cormorant italic text-[14px] text-[#E8E0D5]/60 mb-2">
                &ldquo;Your dressing is as important as the room.&rdquo;
              </p>
              <p className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-[#E8E0D5]/40">
                METAMORPHOO · LAGOS · LISBON · MILAN
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
