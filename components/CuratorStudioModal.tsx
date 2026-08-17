'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  Check,
  Copy,
  Eye,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import Image from 'next/image';
import { Look, Item } from '../lib/types';
import { catalogStore, useCatalog } from '../lib/catalog-store';
import { CURRENCIES, useCurrency } from '../lib/currency';
import { BRAND_STORY } from '../lib/data';

interface CuratorStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ItemCategory = 'Shirt' | 'Trousers' | 'Shoes' | 'Watch' | 'Fragrance' | 'Accessory' | 'Jacket' | 'Knitwear' | 'Eyewear';

interface DraftPiece {
  id: string;
  name: string;
  category: ItemCategory;
  price: number;
  sizes: string[];
  composition: string;
  silhouette: string;
  description: string;
  curationNote: string;
  image: string;
}

export default function CuratorStudioModal({
  isOpen,
  onClose,
}: CuratorStudioModalProps) {
  const catalog = useCatalog();
  const currency = useCurrency();
  const currencyConfig = CURRENCIES[currency] || CURRENCIES.USD;

  const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'governance'>('create');
  const [copiedJSON, setCopiedJSON] = useState(false);
  const [importJSONText, setImportJSONText] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Form State for creating a new Look
  const [lookName, setLookName] = useState('');
  const [subName, setSubName] = useState('THE SARTORIAL COMPOSITION');
  const [occasion, setOccasion] = useState('Early Evening / Embassy Gathering / Trans-continental Transit');
  const [season, setSeason] = useState('Season I: The Inaugural Wardrobe');
  const [oneRuleBroken, setOneRuleBroken] = useState('');
  const [statementQuote, setStatementQuote] = useState('A complete decision in raw unbleached natural cloth.');
  const [longThesis, setLongThesis] = useState('');
  const [paletteDescription, setPaletteDescription] = useState('Warm Alabaster, Smoked Umber & Tuscan Terracotta');
  const [paletteColorsText, setPaletteColorsText] = useState('#E8E0D5, #1A1611, #C4623A, #C9B89A');
  const [heroImage, setHeroImage] = useState(
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop'
  );
  const [secondaryImage, setSecondaryImage] = useState(
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop'
  );
  const [isArchivedSection, setIsArchivedSection] = useState(false);

  // Pieces in this new look
  const [pieces, setPieces] = useState<DraftPiece[]>([
    {
      id: 'draft-p1',
      name: 'Unstructured Double-Breasted Raw Flax Trench',
      category: 'Jacket',
      price: 680,
      sizes: ['S', 'M', 'L', 'XL'],
      composition: '420gsm Organic Raw Flax & Unbleached Cotton',
      silhouette: 'Fluid Architectural',
      description: 'Hand-sewn horn buttons, wide kimono lapel, unlined construction with deep side vents.',
      curationNote: 'Cut with generous chest ease to allow dramatic, unstudied motion in warm coastal air.',
      image:
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 'draft-p2',
      name: 'Fluid Pleated Wide-Leg Tropical Wool Trousers',
      category: 'Trousers',
      price: 340,
      sizes: ['30', '32', '34', '36'],
      composition: '290gsm High-Twist Tropical Wool & Silk Weft',
      silhouette: 'Structured Tailored',
      description: 'Double reverse pleats, extended tab waistband, deep break puddling over footwear.',
      curationNote: 'Engineered with clean drop to fall cleanly without synthetic stiffness.',
      image:
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
    },
  ]);

  const [publishedSuccess, setPublishedSuccess] = useState(false);

  if (!isOpen) return null;

  // Add empty piece
  const handleAddPiece = () => {
    const newPiece: DraftPiece = {
      id: `draft-piece-${Date.now()}`,
      name: '',
      category: 'Shirt',
      price: 260,
      sizes: ['S', 'M', 'L'],
      composition: '320gsm Heavyweight Mulberry Silk',
      silhouette: 'Natural Drop',
      description: 'Clean seam edges with invisible blind stitching.',
      curationNote: 'Supple fluid silk that drapes naturally across collarbones.',
      image: heroImage,
    };
    setPieces([...pieces, newPiece]);
  };

  const handleRemovePiece = (index: number) => {
    setPieces(pieces.filter((_, i) => i !== index));
  };

  const handleUpdatePiece = (index: number, field: keyof DraftPiece, value: any) => {
    const updated = [...pieces];
    updated[index] = { ...updated[index], [field]: value };
    setPieces(updated);
  };

  const handlePublishLook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookName.trim() || pieces.length === 0) return;

    const slug = lookName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const formattedLookId = `look-${slug}-${Date.now().toString().slice(-4)}`;

    const paletteColors = paletteColorsText
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const validatedItems: Item[] = pieces.map((p, idx) => ({
      id: `item-${formattedLookId}-${idx + 1}`,
      name: p.name || `Piece 0${idx + 1}`,
      category: p.category,
      price: Number(p.price) || 250,
      currency: 'USD',
      composition: p.composition || '100% Natural Archival Fibre',
      tier: 'EDIT',
      origin: 'Atelier Metamorphoo Certified Allocation',
      silhouette: p.silhouette || 'Natural Drop',
      image: p.image || heroImage,
      sizes: Array.isArray(p.sizes) ? p.sizes : ['S', 'M', 'L'],
      description: p.description || 'Mastercrafted garment for complete ensemble harmony.',
      curationNote: p.curationNote || 'Approved under Metamorphoo editorial standard.',
      pinLocation: {
        x: 35 + ((idx * 20) % 40),
        y: 25 + ((idx * 25) % 50),
      },
      fitGuidance: {
        cut: 'Fluid Architectural',
        modelStats: "Model is 188cm / 6'2\", wearing Size L",
        drapeWeight: 'Medium Drape (240-300gsm)',
        recommendedSizing: 'True to size for relaxed silhouette.',
      },
      provenance: {
        condition: 'Atelier Curated Standard',
        inspectionBy: 'Ani Chisom & Metamorphoo Curatorial Bureau',
        authenticationStandard: '100% Natural Fibre Integrity · Zero Synthetic Tension',
        packaging: 'Archival Breathable Cotton Travel Garment Case + Cedar Block',
      },
      isAvailable: true,
    }));

    const newLook: Look = {
      id: formattedLookId,
      slug,
      name: lookName.trim().toUpperCase(),
      subName: subName.trim(),
      occasion: occasion.trim(),
      paletteDescription: paletteDescription.trim(),
      paletteColors: paletteColors.length > 0 ? paletteColors : ['#E8E0D5', '#1A1611', '#C4623A'],
      statementQuote: statementQuote.trim() || 'A complete sartorial decision.',
      longThesis: longThesis.trim() || 'Composed for clients who require complete sartorial harmony.',
      tier: 'EDIT',
      season: season.trim(),
      seasonCode: isArchivedSection ? 'ARCHIVE_VAULT' : 'SEASON_I',
      status: 'active',
      oneRuleBroken: oneRuleBroken.trim() || 'Unstructured architectural ease with tailored rigor.',
      heroImage,
      galleryImages: [
        {
          url: heroImage,
          caption: `${lookName} — Full editorial portrait`,
          type: 'full',
        },
        {
          url: secondaryImage,
          caption: `${lookName} — Atmospheric angle & tactile detail`,
          type: 'second_angle',
        },
      ],
      items: validatedItems,
    };

    catalogStore.addLook(newLook, isArchivedSection);
    setPublishedSuccess(true);
    setTimeout(() => setPublishedSuccess(false), 4000);
  };

  const handleCopyCatalogJSON = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      activeSeason: catalog.activeSeasonTitle,
      launchLooks: catalog.customLaunchLooks,
      archiveLooks: catalog.customArchiveLooks,
    };
    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
    setCopiedJSON(true);
    setTimeout(() => setCopiedJSON(false), 2500);
  };

  const handleImportJSON = () => {
    try {
      const parsed = JSON.parse(importJSONText);
      if (Array.isArray(parsed.launchLooks)) {
        catalogStore.save({
          customLaunchLooks: parsed.launchLooks,
          customArchiveLooks: parsed.archiveLooks || catalog.customArchiveLooks,
          activeSeasonTitle: parsed.activeSeason || catalog.activeSeasonTitle,
        });
        setImportStatus('success');
        setTimeout(() => setImportStatus('idle'), 3000);
        setImportJSONText('');
      } else {
        setImportStatus('error');
      }
    } catch {
      setImportStatus('error');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[var(--bg-canvas)]/95 backdrop-blur-xl text-[var(--text-primary)]">
        {/* Top Header Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 sm:px-12 py-5 bg-[var(--bg-surface)]/90 border-b border-[var(--border-subtle)]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full border border-[var(--color-sand)] flex items-center justify-center text-[var(--color-sand)] bg-[var(--bg-canvas)]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-[var(--color-sand)] block">
                METAMORPHOO PRIVATE DESK
              </span>
              <h2 className="font-cormorant text-2xl uppercase tracking-wider text-[var(--text-primary)]">
                ATELIER CURATOR STUDIO
              </h2>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="hidden md:flex items-center space-x-2 bg-[var(--bg-canvas)] p-1 border border-[var(--border-subtle)]">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 font-montserrat text-[10px] uppercase tracking-[0.2em] transition-colors ${
                activeTab === 'create'
                  ? 'bg-[var(--text-primary)] text-[var(--bg-surface)] font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              + Upload New Look
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-4 py-2 font-montserrat text-[10px] uppercase tracking-[0.2em] transition-colors ${
                activeTab === 'manage'
                  ? 'bg-[var(--text-primary)] text-[var(--bg-surface)] font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Catalog & JSON Sync ({catalog.customLaunchLooks.length + catalog.customArchiveLooks.length})
            </button>
            <button
              onClick={() => setActiveTab('governance')}
              className={`px-4 py-2 font-montserrat text-[10px] uppercase tracking-[0.2em] transition-colors ${
                activeTab === 'governance'
                  ? 'bg-[var(--text-primary)] text-[var(--bg-surface)] font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Editorial Doctrine
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus:outline-none flex items-center space-x-2"
          >
            <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] hidden sm:inline-block">
              CLOSE STUDIO
            </span>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="md:hidden flex border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-3 text-center font-montserrat text-[10px] uppercase tracking-wider ${
              activeTab === 'create' ? 'text-[var(--text-primary)] border-b-2 border-[var(--color-sand)]' : 'text-[var(--text-muted)]'
            }`}
          >
            Upload Look
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex-1 py-3 text-center font-montserrat text-[10px] uppercase tracking-wider ${
              activeTab === 'manage' ? 'text-[var(--text-primary)] border-b-2 border-[var(--color-sand)]' : 'text-[var(--text-muted)]'
            }`}
          >
            Catalog Sync
          </button>
          <button
            onClick={() => setActiveTab('governance')}
            className={`flex-1 py-3 text-center font-montserrat text-[10px] uppercase tracking-wider ${
              activeTab === 'governance' ? 'text-[var(--text-primary)] border-b-2 border-[var(--color-sand)]' : 'text-[var(--text-muted)]'
            }`}
          >
            Doctrine
          </button>
        </div>

        {/* Tab 1: Create / Upload New Look */}
        {activeTab === 'create' && (
          <div className="max-w-6xl mx-auto px-6 sm:px-12 py-10 space-y-10">
            {publishedSuccess && (
              <div className="p-4 bg-[var(--bg-surface)] border border-[#25D366] text-[#25D366] font-montserrat text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5" />
                  <span>LOOK SUCCESSFULLY PUBLISHED TO LIVE WARDROBE & READY FOR IMMEDIATE ALLOCATION</span>
                </div>
                <span className="text-[10px] text-[var(--text-primary)]">Live in Carousel</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Form Column */}
              <form onSubmit={handlePublishLook} className="lg:col-span-2 space-y-8">
                {/* Look Architecture Section */}
                <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6">
                  <div className="border-b border-[var(--border-subtle)] pb-4">
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--color-sand)] block">
                      LOOK METADATA & IDENTITY
                    </span>
                    <h3 className="font-cormorant text-2xl text-[var(--text-primary)] uppercase tracking-wider">
                      Sartorial Composition
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)] block">
                        LOOK NAME (PROPER NOUN, E.G. THE MEDITERRANEAN EMBASSY) *
                      </label>
                      <input
                        type="text"
                        required
                        value={lookName}
                        onChange={(e) => setLookName(e.target.value)}
                        placeholder="e.g. THE SOVEREIGN FLUIDITY"
                        className="w-full bg-[var(--bg-canvas)] border border-[var(--border-medium)] px-4 py-3 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)] block">
                        SUB-NAME
                      </label>
                      <input
                        type="text"
                        value={subName}
                        onChange={(e) => setSubName(e.target.value)}
                        placeholder="THE EMBASSY ENSEMBLE"
                        className="w-full bg-[var(--bg-canvas)] border border-[var(--border-medium)] px-4 py-3 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)] block">
                      SEASON TITLE
                    </label>
                    <input
                      type="text"
                      value={season}
                      onChange={(e) => setSeason(e.target.value)}
                      placeholder="Season I: The Inaugural Wardrobe"
                      className="w-full bg-[var(--bg-canvas)] border border-[var(--border-medium)] px-4 py-3 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[var(--color-rust)] block">
                      THE ONE-RULE-BROKEN DOCTRINE *
                    </label>
                    <input
                      type="text"
                      required
                      value={oneRuleBroken}
                      onChange={(e) => setOneRuleBroken(e.target.value)}
                      placeholder="e.g. Traditional heavy tailored wool paired with unlined hem and fluid drape"
                      className="w-full bg-[var(--bg-canvas)] border border-[var(--color-rust)]/40 px-4 py-3 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--color-rust)]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)] block">
                      EDITORIAL CONCEPT & LONG THESIS
                    </label>
                    <textarea
                      rows={3}
                      value={longThesis}
                      onChange={(e) => setLongThesis(e.target.value)}
                      placeholder="Describe the mood, poise, setting, and tactile feeling of the full ensemble..."
                      className="w-full bg-[var(--bg-canvas)] border border-[var(--border-medium)] px-4 py-3 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)] block">
                        DOMINANT PALETTE
                      </label>
                      <input
                        type="text"
                        value={paletteDescription}
                        onChange={(e) => setPaletteDescription(e.target.value)}
                        placeholder="Raw Flax, Smoked Obsidian, Ochre"
                        className="w-full bg-[var(--bg-canvas)] border border-[var(--border-medium)] px-4 py-3 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)] block">
                        OCCASION
                      </label>
                      <input
                        type="text"
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        placeholder="Diplomatic Trans-continental Transit"
                        className="w-full bg-[var(--bg-canvas)] border border-[var(--border-medium)] px-4 py-3 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)]"
                      />
                    </div>
                  </div>

                  {/* Photography URLs */}
                  <div className="space-y-3 pt-2">
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--color-sand)] block">
                      CINEMATIC EDITORIAL IMAGERY (3:4 PORTRAIT)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-montserrat text-[8px] uppercase tracking-[0.2em] text-[var(--text-muted)] block mb-1">
                          HERO FULL-BODY IMAGE URL
                        </label>
                        <input
                          type="url"
                          required
                          value={heroImage}
                          onChange={(e) => setHeroImage(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-[var(--bg-canvas)] border border-[var(--border-medium)] px-3 py-2 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)]"
                        />
                      </div>
                      <div>
                        <label className="font-montserrat text-[8px] uppercase tracking-[0.2em] text-[var(--text-muted)] block mb-1">
                          SECONDARY ANGLE / DETAIL URL
                        </label>
                        <input
                          type="url"
                          value={secondaryImage}
                          onChange={(e) => setSecondaryImage(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-[var(--bg-canvas)] border border-[var(--border-medium)] px-3 py-2 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ensemble Pieces Builder */}
                <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6">
                  <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                    <div>
                      <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--color-sand)] block">
                        ENSEMBLE COMPONENTS
                      </span>
                      <h3 className="font-cormorant text-2xl text-[var(--text-primary)] uppercase tracking-wider">
                        Garment Breakdown ({pieces.length} Pieces)
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddPiece}
                      className="px-3 py-2 bg-[var(--text-primary)] hover:bg-[var(--text-primary)]/80 text-[var(--bg-surface)] font-montserrat text-[10px] uppercase tracking-[0.2em] font-semibold flex items-center space-x-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>ADD PIECE</span>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {pieces.map((piece, idx) => (
                      <div
                        key={idx}
                        className="p-5 bg-[var(--bg-canvas)] border border-[var(--border-medium)] space-y-4 relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-montserrat text-[10px] uppercase tracking-[0.2em] text-[var(--color-sand)] font-semibold">
                            PIECE 0{idx + 1}
                          </span>
                          {pieces.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemovePiece(idx)}
                              className="text-[var(--color-rust)] hover:opacity-80 p-1 text-xs flex items-center space-x-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="text-[9px] uppercase tracking-wider">Remove</span>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className="font-montserrat text-[8px] uppercase tracking-widest text-[var(--text-muted)] block mb-1">
                              GARMENT NAME *
                            </label>
                            <input
                              type="text"
                              required
                              value={piece.name}
                              onChange={(e) => handleUpdatePiece(idx, 'name', e.target.value)}
                              placeholder="e.g. Relaxed Raw Silk Lapel Shirt"
                              className="w-full bg-[var(--bg-surface)] border border-[var(--border-medium)] px-3 py-2 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)]"
                            />
                          </div>

                          <div>
                            <label className="font-montserrat text-[8px] uppercase tracking-widest text-[var(--text-muted)] block mb-1">
                              CATEGORY
                            </label>
                            <select
                              value={piece.category}
                              onChange={(e) => handleUpdatePiece(idx, 'category', e.target.value as ItemCategory)}
                              className="w-full bg-[var(--bg-surface)] border border-[var(--border-medium)] px-3 py-2 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)]"
                            >
                              <option value="Jacket">Jacket / Outerwear</option>
                              <option value="Shirt">Shirt / Top</option>
                              <option value="Trousers">Trousers</option>
                              <option value="Knitwear">Knitwear</option>
                              <option value="Shoes">Shoes</option>
                              <option value="Accessory">Accessory</option>
                              <option value="Watch">Watch</option>
                              <option value="Eyewear">Eyewear</option>
                              <option value="Fragrance">Fragrance</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="font-montserrat text-[8px] uppercase tracking-widest text-[var(--text-muted)] block mb-1">
                              PRICE (USD $) *
                            </label>
                            <input
                              type="number"
                              required
                              min="0"
                              value={piece.price || ''}
                              onChange={(e) => handleUpdatePiece(idx, 'price', Number(e.target.value))}
                              placeholder="340"
                              className="w-full bg-[var(--bg-surface)] border border-[var(--border-medium)] px-3 py-2 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)]"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="font-montserrat text-[8px] uppercase tracking-widest text-[var(--text-muted)] block mb-1">
                              FABRIC COMPOSITION & GSM
                            </label>
                            <input
                              type="text"
                              value={piece.composition}
                              onChange={(e) => handleUpdatePiece(idx, 'composition', e.target.value)}
                              placeholder="e.g. 380gsm Unbleached Italian Linen"
                              className="w-full bg-[var(--bg-surface)] border border-[var(--border-medium)] px-3 py-2 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-montserrat text-[8px] uppercase tracking-widest text-[var(--text-muted)] block mb-1">
                            SIZES (COMMA SEPARATED)
                          </label>
                          <input
                            type="text"
                            value={Array.isArray(piece.sizes) ? piece.sizes.join(', ') : 'S, M, L'}
                            onChange={(e) =>
                              handleUpdatePiece(
                                idx,
                                'sizes',
                                e.target.value.split(',').map((s) => s.trim())
                              )
                            }
                            placeholder="S, M, L, XL or 30, 32, 34"
                            className="w-full bg-[var(--bg-surface)] border border-[var(--border-medium)] px-3 py-2 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section Destination (Active vs Archive) */}
                <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-montserrat text-[var(--text-primary)] block font-medium">
                      Publish Destination
                    </span>
                    <span className="text-[10px] font-montserrat text-[var(--text-muted)]">
                      {isArchivedSection
                        ? 'Will be placed in the Archive Vault'
                        : 'Will be placed in Active Seasonal Carousel'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsArchivedSection(!isArchivedSection)}
                    className={`px-4 py-2 text-xs font-montserrat uppercase tracking-wider transition-colors ${
                      isArchivedSection
                        ? 'bg-[var(--color-sand)] text-[var(--bg-canvas)]'
                        : 'bg-[var(--bg-canvas)] border border-[var(--border-medium)] text-[var(--text-primary)]'
                    }`}
                  >
                    {isArchivedSection ? 'Vaulted Archive' : 'Active Carousel'}
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  id="publish-curator-look-btn"
                  className="w-full py-4 bg-[var(--text-primary)] hover:bg-[var(--text-primary)]/90 text-[var(--bg-surface)] font-montserrat text-xs uppercase tracking-[0.28em] font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-[var(--bg-surface)]" />
                  <span>PUBLISH LOOK TO LIVE CATALOG</span>
                </button>
              </form>

              {/* Live Preview Card (Right Column) */}
              <div className="space-y-6">
                <div className="sticky top-24 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--color-sand)]">
                      LIVE LOOKBOOK PREVIEW
                    </span>
                    <Eye className="w-3.5 h-3.5 text-[var(--color-sand)]" />
                  </div>

                  <div className="bg-[var(--bg-surface)] border border-[var(--border-medium)] overflow-hidden shadow-2xl">
                    <div className="relative aspect-[3/4] w-full bg-[var(--bg-canvas)]">
                      {heroImage ? (
                        <Image
                          src={heroImage}
                          alt="Look preview"
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] text-xs">
                          No Image Provided
                        </div>
                      )}

                      <div className="absolute top-4 left-4 bg-[var(--bg-canvas)]/80 backdrop-blur-md px-3 py-1 border border-[var(--border-subtle)] text-[9px] font-montserrat uppercase tracking-[0.2em] text-[var(--text-primary)]">
                        NEW LOOK
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <span className="font-montserrat text-[8px] uppercase tracking-[0.2em] text-[var(--color-sand)] block">
                          {season}
                        </span>
                        <h4 className="font-cormorant text-xl text-[var(--text-primary)] uppercase tracking-wider font-light">
                          {lookName || 'UNTITLED SARTORIAL ENSEMBLE'}
                        </h4>
                      </div>

                      {oneRuleBroken && (
                        <p className="font-montserrat text-[11px] text-[var(--color-rust)] italic">
                          &quot;{oneRuleBroken}&quot;
                        </p>
                      )}

                      <div className="pt-3 border-t border-[var(--border-subtle)] space-y-1 text-[10px] font-montserrat text-[var(--text-secondary)]">
                        <div className="flex justify-between">
                          <span>PIECES IN ENSEMBLE:</span>
                          <span className="text-[var(--text-primary)]">{pieces.length} items</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ENSEMBLE TOTAL:</span>
                          <span className="text-[var(--text-primary)]">
                            {currencyConfig.format(
                              pieces.reduce((sum, p) => sum + (Number(p.price) || 0), 0)
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Manage & JSON Sync */}
        {activeTab === 'manage' && (
          <div className="max-w-5xl mx-auto px-6 sm:px-12 py-10 space-y-10">
            {/* Sync Action Header */}
            <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--color-sand)] block">
                  ZERO-BUDGET DATA PERMANENCE
                </span>
                <h3 className="font-cormorant text-2xl text-[var(--text-primary)] uppercase tracking-wider">
                  Catalog JSON Manifest & Export
                </h3>
                <p className="font-montserrat text-xs text-[var(--text-muted)] mt-1 max-w-xl">
                  Export the full collection JSON to commit into code, or import a JSON payload to load new seasons instantly.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleCopyCatalogJSON}
                  className="px-4 py-3 bg-[var(--text-primary)] hover:bg-[var(--text-primary)]/90 text-[var(--bg-surface)] font-montserrat text-xs uppercase tracking-[0.2em] font-semibold flex items-center space-x-2 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedJSON ? 'COPIED TO CLIPBOARD' : 'EXPORT JSON'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => catalogStore.resetToDefaults()}
                  className="px-3 py-3 border border-[var(--border-medium)] hover:border-[var(--color-rust)] text-[var(--text-muted)] hover:text-[var(--color-rust)] font-montserrat text-xs uppercase tracking-wider transition-colors flex items-center space-x-1.5"
                  title="Reset to factory house archive"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>RESTORE DEFAULTS</span>
                </button>
              </div>
            </div>

            {/* Import JSON Box */}
            <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--color-sand)] block">
                IMPORT SARTORIAL CAPSULE (JSON)
              </span>
              <textarea
                rows={4}
                value={importJSONText}
                onChange={(e) => setImportJSONText(e.target.value)}
                placeholder='Paste raw JSON catalog manifest here (e.g. { "launchLooks": [...] })'
                className="w-full bg-[var(--bg-canvas)] border border-[var(--border-medium)] px-4 py-3 text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--text-primary)] resize-none"
              />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleImportJSON}
                  disabled={!importJSONText.trim()}
                  className="px-5 py-2.5 bg-[var(--color-sand)] hover:opacity-90 disabled:opacity-40 text-[var(--bg-canvas)] font-montserrat text-xs uppercase tracking-[0.2em] font-semibold transition-colors"
                >
                  LOAD CAPSULE INTO APPLICATION
                </button>

                {importStatus === 'success' && (
                  <span className="text-xs text-[#25D366] font-montserrat">
                    ✓ Capsule successfully imported!
                  </span>
                )}
                {importStatus === 'error' && (
                  <span className="text-xs text-[var(--color-rust)] font-montserrat">
                    ✗ Invalid JSON format. Please verify manifest structure.
                  </span>
                )}
              </div>
            </div>

            {/* List of Active Looks in Live System */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[var(--color-sand)]">
                  ACTIVE LOOKS IN LIVE CAROUSEL ({catalog.customLaunchLooks.length})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catalog.customLaunchLooks.map((look) => (
                  <div
                    key={look.id}
                    className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3 relative group"
                  >
                    <div className="relative aspect-[3/4] w-full bg-[var(--bg-canvas)]">
                      <Image
                        src={look.heroImage}
                        alt={look.name}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <span className="font-montserrat text-[8px] uppercase tracking-widest text-[var(--color-sand)]">
                        {look.season}
                      </span>
                      <h4 className="font-cormorant text-lg text-[var(--text-primary)] uppercase">{look.name}</h4>
                      <p className="font-montserrat text-[10px] text-[var(--text-muted)] mt-1">
                        {look.items.length} garments · {look.paletteDescription}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-[var(--border-subtle)] flex justify-between items-center text-[10px] font-montserrat">
                      <span className="text-[var(--color-rust)] italic truncate max-w-[180px]">
                        {look.oneRuleBroken}
                      </span>
                      <button
                        onClick={() => catalogStore.deleteLook(look.id)}
                        className="text-[var(--text-muted)] hover:text-[var(--color-rust)] p-1"
                        title="Remove look"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Editorial Governance & Criteria */}
        {activeTab === 'governance' && (
          <div className="max-w-4xl mx-auto px-6 sm:px-12 py-10 space-y-12">
            <div className="text-center space-y-4">
              <span className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-[var(--color-sand)]">
                CREATIVE DIRECTIVE & ARCHITECTURE
              </span>
              <h1 className="font-cormorant font-light text-4xl sm:text-6xl text-[var(--text-primary)] uppercase tracking-[0.16em]">
                THE EDITORIAL DOCTRINE
              </h1>
              <p className="font-montserrat text-xs text-[var(--text-secondary)] max-w-xl mx-auto font-light leading-relaxed">
                The creative backbone of METAMORPHOO. Defining look naming criteria, photography rules, curation gates, and the one-rule-broken doctrine.
              </p>
            </div>

            {/* Criteria Grid */}
            <div className="bg-[var(--bg-surface)] p-8 border border-[var(--border-subtle)] space-y-6">
              <div className="space-y-2">
                <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--color-sand)] block">
                  PART 01 · THE 4 NAMING TESTS
                </span>
                <h2 className="font-cormorant text-2xl sm:text-3xl text-[var(--text-primary)] font-light uppercase tracking-wider">
                  The Metamorphoo Naming Standard
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BRAND_STORY.editorialManifesto.criteria.map((crit, idx) => (
                  <div key={idx} className="p-3.5 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] flex items-start space-x-3">
                    <span className="font-montserrat text-xs text-[var(--color-sand)] font-mono">0{idx + 1}</span>
                    <span className="font-montserrat text-xs text-[var(--text-secondary)] font-light">{crit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Signed Off Signet */}
            <div className="bg-[var(--bg-surface)] p-8 border border-[var(--border-medium)] space-y-4">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[var(--color-sand)]" />
                <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--color-sand)]">
                  APPROVAL SIGNET
                </span>
              </div>
              <h2 className="font-cormorant text-2xl text-[var(--text-primary)] font-light uppercase tracking-wider">
                Signed Off by Ani Chisom
              </h2>
              <p className="font-montserrat text-xs text-[var(--text-secondary)] leading-relaxed">
                Every uploaded capsule must maintain uncompromised natural fibres (mulberry silk, organic linen, raw cotton, high-twist wool), relaxed tailored proportions, and absolute complete decision curation.
              </p>
            </div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}
