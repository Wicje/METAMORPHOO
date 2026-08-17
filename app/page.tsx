'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import WardrobeScroll from '../components/WardrobeScroll';
import LookDetailModal from '../components/LookDetailModal';
import ItemDetailModal from '../components/ItemDetailModal';
import TheHouseView from '../components/TheHouseView';
import EditDirectoryView from '../components/EditDirectoryView';
import OriginalsView from '../components/OriginalsView';
import WardrobeDrawer from '../components/WardrobeDrawer';
import CuratorLedgerModal from '../components/CuratorLedgerModal';
import CuratorStudioModal from '../components/CuratorStudioModal';
import LedgerModal from '../components/LedgerModal';
import ArchiveVaultView from '../components/ArchiveVaultView';
import ConciergeChatWidget from '../components/ConciergeChatWidget';
import { Look, Item, CartItem } from '../lib/types';
import { useCart } from '../lib/cart-store';
import { useCatalog } from '../lib/catalog-store';
import { useTheme, themeStore } from '../lib/theme';
import { Sun, Moon } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'wardrobe' | 'archive' | 'edit' | 'originals' | 'house'>('wardrobe');
  const [selectedLook, setSelectedLook] = useState<Look | null>(null);
  const [selectedItem, setSelectedItem] = useState<{ item: Item; look: Look | null } | null>(null);
  const [isWardrobeDrawerOpen, setIsWardrobeDrawerOpen] = useState(false);
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);
  const [isManifestoOpen, setIsManifestoOpen] = useState(false);
  const [isCuratorStudioOpen, setIsCuratorStudioOpen] = useState(false);
  const [cartItems, setCartItems] = useCart();
  const catalog = useCatalog();
  const theme = useTheme();

  // Initialize client theme from localStorage on initial render
  useEffect(() => {
    themeStore.init();
  }, []);

  // Save cart to store
  const updateCart = (items: CartItem[]) => {
    setCartItems(items);
  };

  // Add individual piece to wardrobe
  const handleAddToWardrobe = (item: Item, lookName: string, selectedSize: string) => {
    const existingIndex = cartItems.findIndex(
      (ci) => ci.item.id === item.id && ci.selectedSize === selectedSize
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += 1;
      updateCart(updated);
    } else {
      const newItem: CartItem = {
        id: `${item.id}-${selectedSize}-${Date.now()}`,
        item,
        lookId: selectedLook?.id || 'edit',
        lookName: lookName || selectedLook?.name || 'Metamorphoo Edit',
        selectedSize: selectedSize || item.sizes[0] || 'Standard',
        quantity: 1,
      };
      updateCart([...cartItems, newItem]);
    }
  };

  // Shop Full Look — adds all pieces of the look as a coordinated ensemble
  const handleShopFullLook = (look: Look) => {
    const newItems: CartItem[] = look.items.map((it) => ({
      id: `${it.id}-${it.sizes[0] || 'Std'}-${Date.now()}-${Math.random()}`,
      item: it,
      lookId: look.id,
      lookName: look.name,
      selectedSize: it.sizes[0] || 'Standard',
      quantity: 1,
    }));

    updateCart([...cartItems, ...newItems]);
    setIsWardrobeDrawerOpen(true);
  };

  // Remove individual item from cart
  const handleRemoveCartItem = (id: string) => {
    updateCart(cartItems.filter((ci) => ci.id !== id));
  };

  // Update item quantity
  const handleUpdateQuantity = (id: string, delta: number) => {
    const updated = cartItems
      .map((ci) => {
        if (ci.id === id) {
          const newQty = ci.quantity + delta;
          return newQty > 0 ? { ...ci, quantity: newQty } : null;
        }
        return ci;
      })
      .filter(Boolean) as CartItem[];

    updateCart(updated);
  };

  const handleClearWardrobe = () => {
    updateCart([]);
  };

  const totalItemCount = cartItems.reduce((sum, ci) => sum + ci.quantity, 0);

  return (
    <div className="relative min-h-screen bg-[var(--bg-surface)] text-[var(--text-primary)] font-montserrat transition-colors duration-300">
      {/* Universal Sticky Minimalist Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab as any);
          setSelectedLook(null);
          setSelectedItem(null);
        }}
        cartCount={totalItemCount}
        onOpenCart={() => setIsWardrobeDrawerOpen(true)}
        onOpenLedger={() => setIsLedgerModalOpen(true)}
        onOpenCurator={() => setIsCuratorStudioOpen(true)}
      />

      {/* Main View Router */}
      {activeTab === 'wardrobe' && (
        <WardrobeScroll
          looks={catalog.customLaunchLooks}
          onSelectLook={(look) => setSelectedLook(look)}
          onSelectItem={(item, look) => setSelectedItem({ item, look })}
          onShopFullLook={handleShopFullLook}
        />
      )}

      {activeTab === 'archive' && (
        <ArchiveVaultView
          vaultLooks={catalog.customArchiveLooks}
          onSelectLook={(look) => setSelectedLook(look)}
          onSelectItem={(item, look) => setSelectedItem({ item, look })}
        />
      )}

      {activeTab === 'edit' && (
        <EditDirectoryView
          looks={catalog.customLaunchLooks}
          onSelectItem={(item, look) => setSelectedItem({ item, look })}
          onSelectLook={(look) => {
            setActiveTab('wardrobe');
            setSelectedLook(look);
          }}
        />
      )}

      {activeTab === 'originals' && (
        <OriginalsView
          onExploreWardrobe={() => {
            setActiveTab('wardrobe');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {activeTab === 'house' && (
        <TheHouseView
          onExploreWardrobe={() => {
            setActiveTab('wardrobe');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Look Detail Modal View */}
      {selectedLook && (
        <LookDetailModal
          look={selectedLook}
          onClose={() => setSelectedLook(null)}
          onSelectItem={(item, look) => {
            setSelectedItem({ item, look });
          }}
          onShopFullLook={handleShopFullLook}
        />
      )}

      {/* Individual Item Detail Modal View */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem.item}
          originatingLook={selectedItem.look}
          onClose={() => setSelectedItem(null)}
          onReturnToLook={(look) => {
            setSelectedItem(null);
            setSelectedLook(look);
          }}
          onAddToWardrobe={handleAddToWardrobe}
        />
      )}

      {/* Wardrobe Acquisition Drawer */}
      <WardrobeDrawer
        isOpen={isWardrobeDrawerOpen}
        onClose={() => setIsWardrobeDrawerOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onUpdateQuantity={handleUpdateQuantity}
        onClearWardrobe={handleClearWardrobe}
      />

      {/* Private Client Ledger Modal */}
      <LedgerModal
        isOpen={isLedgerModalOpen}
        onClose={() => setIsLedgerModalOpen(false)}
        onSelectLook={(look) => {
          setSelectedLook(look);
          setIsLedgerModalOpen(false);
        }}
        onSelectItem={(item, look) => {
          setSelectedItem({ item, look });
          setIsLedgerModalOpen(false);
        }}
      />

      {/* Curator Studio Ingestion & Upload Desk Modal */}
      <CuratorStudioModal
        isOpen={isCuratorStudioOpen}
        onClose={() => setIsCuratorStudioOpen(false)}
      />

      {/* Curator's Editorial Brief & Criteria Modal */}
      <CuratorLedgerModal
        isOpen={isManifestoOpen}
        onClose={() => setIsManifestoOpen(false)}
      />

      {/* Floating Active Atelier Concierge Widget */}
      <ConciergeChatWidget />

      {/* Global Architectural Editorial Footer */}
      <footer id="global-footer" className="border-t border-[var(--border-subtle)] bg-[var(--bg-canvas)] pt-16 sm:pt-24 pb-12 px-6 sm:px-12 lg:px-16 text-[var(--text-muted)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto space-y-16 sm:space-y-20">
          {/* SARTORIAL CHROMATIC PALETTE (Bone vs Obsidian in Footer) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <div className="space-y-1">
              <span className="font-montserrat text-[9px] uppercase tracking-[0.28em] text-[var(--color-sand)] font-semibold block">
                SARTORIAL CHROMATIC PALETTE
              </span>
              <p className="font-montserrat text-xs text-[var(--text-secondary)] font-light">
                {theme === 'obsidian'
                  ? 'Active: Smoked Obsidian (Nocturnal Salon & Architectural Weight)'
                  : 'Active: Bone Linen (Midday Light & Raw Flax Luminescence)'}
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                id="footer-palette-bone-btn"
                onClick={() => themeStore.setTheme('bone')}
                className={`px-4 py-2 text-[10px] font-montserrat uppercase tracking-[0.22em] flex items-center space-x-2 border transition-all ${
                  theme === 'bone'
                    ? 'bg-[var(--bg-canvas)] text-[var(--color-rust)] border-[var(--color-rust)] font-medium shadow-sm'
                    : 'text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--border-medium)]'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>BONE LINEN</span>
              </button>

              <button
                id="footer-palette-obsidian-btn"
                onClick={() => themeStore.setTheme('obsidian')}
                className={`px-4 py-2 text-[10px] font-montserrat uppercase tracking-[0.22em] flex items-center space-x-2 border transition-all ${
                  theme === 'obsidian'
                    ? 'bg-[var(--bg-canvas)] text-[var(--color-sand)] border-[var(--color-sand)] font-medium shadow-sm'
                    : 'text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--border-medium)]'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>SMOKED OBSIDIAN</span>
              </button>
            </div>
          </div>

          {/* 4 Architectural Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 text-left">
            {/* Column 1: The House */}
            <div className="space-y-4">
              <span className="font-montserrat text-[9px] uppercase tracking-[0.28em] text-[var(--color-sand)] block font-semibold">
                THE SARTORIAL HOUSE
              </span>
              <p className="font-montserrat text-xs text-[var(--text-secondary)] leading-relaxed font-light">
                A curated world of complete sartorial decisions. We reject isolated garments in favor of sovereign aesthetic harmony, fluid architectural drape, and natural fibre purity.
              </p>
              <div className="pt-2 text-[10px] font-montserrat tracking-[0.2em] text-[var(--text-muted)] uppercase">
                Lagos · Lisbon · Milan
              </div>
            </div>

            {/* Column 2: Architecture & Vault Navigation */}
            <div className="space-y-4">
              <span className="font-montserrat text-[9px] uppercase tracking-[0.28em] text-[var(--color-sand)] block font-semibold">
                COLLECTIONS & ARCHIVE
              </span>
              <ul className="space-y-2.5 font-montserrat text-xs tracking-[0.15em] uppercase">
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('wardrobe');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-[var(--text-primary)] hover:translate-x-1 transition-all duration-200"
                  >
                    The Wardrobe (Season I)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('archive');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-[var(--text-primary)] hover:translate-x-1 transition-all duration-200"
                  >
                    Archive Vault
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('edit');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-[var(--text-primary)] hover:translate-x-1 transition-all duration-200"
                  >
                    Edit Standard Directory
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('originals');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-[var(--text-primary)] hover:translate-x-1 transition-all duration-200"
                  >
                    House Originals
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('house');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-[var(--text-primary)] hover:translate-x-1 transition-all duration-200"
                  >
                    The House Manifesto
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Atelier Protocol & Private Desk */}
            <div className="space-y-4">
              <span className="font-montserrat text-[9px] uppercase tracking-[0.28em] text-[var(--color-sand)] block font-semibold">
                PRIVATE CLIENT SERVICES
              </span>
              <ul className="space-y-2.5 font-montserrat text-xs tracking-[0.15em] uppercase">
                <li>
                  <button
                    onClick={() => setIsLedgerModalOpen(true)}
                    className="hover:text-[var(--text-primary)] hover:translate-x-1 transition-all duration-200"
                  >
                    Private Client Ledger
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsManifestoOpen(true)}
                    className="hover:text-[var(--color-rust)] hover:translate-x-1 transition-all duration-200"
                  >
                    Editorial Brief & Criteria
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsWardrobeDrawerOpen(true)}
                    className="hover:text-[var(--text-primary)] hover:translate-x-1 transition-all duration-200"
                  >
                    Wardrobe Bag ({totalItemCount})
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Fibre Purity & Provenance */}
            <div className="space-y-4">
              <span className="font-montserrat text-[9px] uppercase tracking-[0.28em] text-[var(--color-sand)] block font-semibold">
                ATELIER STANDARDS
              </span>
              <ul className="space-y-2 font-montserrat text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                <li className="flex items-center space-x-2">
                  <span className="text-[var(--color-sand)]">✦</span>
                  <span>100% Natural Fibre Integrity</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-[var(--color-sand)]">✦</span>
                  <span>The One-Rule-Broken Doctrine</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-[var(--color-sand)]">✦</span>
                  <span>Zero Synthetic Tension Guarantee</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-[var(--color-sand)]">✦</span>
                  <span>Direct Atelier Concierge Support</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Monumental Architectural Brand Display (Bigger & Grand) */}
          <div className="pt-12 sm:pt-20 border-t border-[var(--border-subtle)] text-center overflow-hidden">
            <button
              onClick={() => {
                setActiveTab('wardrobe');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full text-center focus:outline-none group block py-4"
              title="Return to The Wardrobe"
            >
              <h1 className="font-cormorant font-light text-6xl sm:text-8xl md:text-9xl lg:text-[135px] xl:text-[165px] tracking-[0.22em] sm:tracking-[0.26em] text-[var(--text-primary)] group-hover:text-[var(--color-sand)] transition-colors duration-500 uppercase leading-none select-none">
                METAMORPHOO
              </h1>
            </button>
            <p className="font-montserrat text-[10px] sm:text-[11px] tracking-[0.38em] text-[var(--text-muted)] uppercase mt-5">
              A CURATED WORLD OF COMPLETE DECISIONS · DIRECTED BY ANI CHISOM
            </p>
          </div>

          {/* Bottom Bar with Copyright, Discreet Atelier Desk (Notion Sync), and Back to Top */}
          <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-montserrat uppercase tracking-[0.2em] text-[var(--text-muted)]">
            <div className="flex items-center space-x-3">
              <span>© {new Date().getFullYear()} METAMORPHOO BUREAU.</span>
              {/* Discrete Atelier Desk / Notion Sync Trigger - Unobtrusive & Eyes will not see it casually */}
              <button
                id="footer-atelier-desk-btn"
                onClick={() => setIsCuratorStudioOpen(true)}
                className="opacity-30 hover:opacity-100 hover:text-[var(--color-sand)] transition-all text-[8px] tracking-[0.25em] focus:outline-none"
                title="Atelier Ingestion & Notion Sync Desk"
                aria-label="Atelier Desk"
              >
                [ ATELIER DESK ]
              </button>
            </div>

            <div className="hidden md:block text-[9px] tracking-[0.28em] text-[var(--color-sand)]">
              ZERO SYNTHETIC TENSION · COMPLETE ENSEMBLE HARMONY
            </div>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-[var(--text-primary)] transition-colors flex items-center space-x-1"
            >
              <span>BACK TO APEX</span>
              <span>↑</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
