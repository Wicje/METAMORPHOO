'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import WardrobeScroll from '../components/WardrobeScroll';
import LookDetailModal from '../components/LookDetailModal';
import ItemDetailModal from '../components/ItemDetailModal';
import TheHouseView from '../components/TheHouseView';
import EditDirectoryView from '../components/EditDirectoryView';
import OriginalsView from '../components/OriginalsView';
import WardrobeDrawer from '../components/WardrobeDrawer';
import CuratorLedgerModal from '../components/CuratorLedgerModal';
import LedgerModal from '../components/LedgerModal';
import ArchiveVaultView from '../components/ArchiveVaultView';
import { LAUNCH_LOOKS, ARCHIVE_VAULT_LOOKS } from '../lib/data';
import { Look, Item, CartItem } from '../lib/types';
import { useCart } from '../lib/cart-store';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'wardrobe' | 'archive' | 'edit' | 'originals' | 'house'>('wardrobe');
  const [selectedLook, setSelectedLook] = useState<Look | null>(null);
  const [selectedItem, setSelectedItem] = useState<{ item: Item; look: Look | null } | null>(null);
  const [isWardrobeDrawerOpen, setIsWardrobeDrawerOpen] = useState(false);
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);
  const [isManifestoOpen, setIsManifestoOpen] = useState(false);
  const [cartItems, setCartItems] = useCart();

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
    <div className="relative min-h-screen bg-[#1A1611] text-[#E8E0D5] font-montserrat">
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
      />

      {/* Main View Router */}
      {activeTab === 'wardrobe' && (
        <WardrobeScroll
          looks={LAUNCH_LOOKS}
          onSelectLook={(look) => setSelectedLook(look)}
          onSelectItem={(item, look) => setSelectedItem({ item, look })}
          onShopFullLook={handleShopFullLook}
        />
      )}

      {activeTab === 'archive' && (
        <ArchiveVaultView
          vaultLooks={ARCHIVE_VAULT_LOOKS}
          onSelectLook={(look) => setSelectedLook(look)}
          onSelectItem={(item, look) => setSelectedItem({ item, look })}
        />
      )}

      {activeTab === 'edit' && (
        <EditDirectoryView
          looks={LAUNCH_LOOKS}
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

      {/* Curator's Editorial Brief & Criteria Modal */}
      <CuratorLedgerModal
        isOpen={isManifestoOpen}
        onClose={() => setIsManifestoOpen(false)}
      />

      {/* Global Minimalist Footer */}
      <footer id="global-footer" className="border-t border-[#E8E0D5]/10 bg-[#14110E] py-12 px-6 sm:px-12 text-[#E8E0D5]/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <span className="font-cormorant text-xl tracking-[0.25em] text-[#E8E0D5] uppercase font-light">
              METAMORPHOO
            </span>
            <p className="font-montserrat text-[10px] tracking-[0.2em] text-[#E8E0D5]/40 mt-1 uppercase">
              A curated world of complete decisions · Lagos · Lisbon · Milan
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 font-montserrat text-[10px] uppercase tracking-[0.25em]">
            <button
              onClick={() => {
                setActiveTab('wardrobe');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#E8E0D5] transition-colors"
            >
              The Wardrobe
            </button>
            <button
              onClick={() => {
                setActiveTab('archive');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#E8E0D5] transition-colors"
            >
              Archive Vault
            </button>
            <button
              onClick={() => {
                setActiveTab('edit');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#E8E0D5] transition-colors"
            >
              Edit Standard
            </button>
            <button
              onClick={() => {
                setActiveTab('originals');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#E8E0D5] transition-colors"
            >
              Originals
            </button>
            <button
              onClick={() => {
                setActiveTab('house');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#E8E0D5] transition-colors"
            >
              The House
            </button>
            <button
              onClick={() => setIsManifestoOpen(true)}
              className="hover:text-[#C4623A] transition-colors"
            >
              Editorial Brief
            </button>
          </div>

          <div className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[#E8E0D5]/30">
            © {new Date().getFullYear()} METAMORPHOO. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
