'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
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
  Database,
  ArrowDownToLine,
  Sun,
  Moon,
  FileSpreadsheet,
} from 'lucide-react';
import Image from 'next/image';
import EditorialImage from './EditorialImage';
import { Look, Item } from '../lib/types';
import { catalogStore, useCatalog } from '../lib/catalog-store';
import { CURRENCIES, useCurrency } from '../lib/currency';
import { BRAND_STORY } from '../lib/data';
import { useTheme, themeStore } from '../lib/theme';

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
  drapeWeight?: string;
  modelStats?: string;
  recommendedSizing?: string;
  measurementsSummary?: {
    chestOrWaist?: string;
    length?: string;
    hemOrOpening?: string;
  };
  image: string;
  pinLocation?: { x: number; y: number };
}

export default function CuratorStudioModal({
  isOpen,
  onClose,
}: CuratorStudioModalProps) {
  const catalog = useCatalog();
  const currency = useCurrency();
  const theme = useTheme();
  const currencyConfig = CURRENCIES[currency] || CURRENCIES.USD;

  const [activeTab, setActiveTab] = useState<'notion' | 'create' | 'manage' | 'governance'>('notion');
  const [copiedJSON, setCopiedJSON] = useState(false);
  const [copiedNotionGuide, setCopiedNotionGuide] = useState(false);
  const [importJSONText, setImportJSONText] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Notion Sync State with lazy local storage recovery
  const [notionApiKey, setNotionApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('metamorphoo_notion_key') || '';
      } catch {
        return '';
      }
    }
    return '';
  });

  const [notionDbId, setNotionDbId] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('metamorphoo_notion_db') || '';
      } catch {
        return '';
      }
    }
    return '';
  });

  const [notionSyncing, setNotionSyncing] = useState(false);
  const [notionSyncResult, setNotionSyncResult] = useState<{
    success?: boolean;
    totalSynced?: number;
    source?: string;
    message?: string;
  } | null>(null);
  const [rawNotionTableText, setRawNotionTableText] = useState('');

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
  const [editionTotal, setEditionTotal] = useState<string>('');
  const [isTimedDropEnabled, setIsTimedDropEnabled] = useState(false);
  const [dropDateText, setDropDateText] = useState<string>('');
  const [isVipLockEnabled, setIsVipLockEnabled] = useState(false);
  const [vipPassword, setVipPassword] = useState<string>('');
  const [activePinPieceIndex, setActivePinPieceIndex] = useState<number | null>(null);

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
      pinLocation: { x: 42, y: 35 },
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
      pinLocation: { x: 50, y: 65 },
    },
  ]);

  const [publishedSuccess, setPublishedSuccess] = useState(false);

  if (!isOpen) return null;

  // Save Notion credentials
  const handleSaveNotionCreds = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('metamorphoo_notion_key', notionApiKey);
        localStorage.setItem('metamorphoo_notion_db', notionDbId);
      } catch {
        // ignore
      }
    }
  };

  // Perform Live Notion Database Sync via Server API
  const handleLiveNotionSync = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    handleSaveNotionCreds();
    setNotionSyncing(true);
    setNotionSyncResult(null);

    try {
      const res = await fetch('/api/notion/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: notionApiKey.trim(),
          databaseId: notionDbId.trim(),
          manualJsonText: rawNotionTableText.trim() || undefined,
          manualCsvText: rawNotionTableText.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && Array.isArray(data.looks)) {
        // Partition looks into active launch looks and archive looks
        const activeLooks = data.looks.filter((l: any) => !l.isArchive && l.seasonCode !== 'ARCHIVE_VAULT');
        const archiveLooks = data.looks.filter((l: any) => l.isArchive || l.seasonCode === 'ARCHIVE_VAULT');

        catalogStore.save({
          customLaunchLooks: activeLooks.length > 0 ? activeLooks : data.looks,
          customArchiveLooks: archiveLooks.length > 0 ? archiveLooks : catalog.customArchiveLooks,
          activeSeasonTitle: data.looks[0]?.season || catalog.activeSeasonTitle,
        });

        setNotionSyncResult({
          success: true,
          totalSynced: data.totalSynced || data.looks.length,
          source: data.source,
          message: `Synchronized ${data.totalSynced || data.looks.length} looks and complete garment allocations from Notion!`,
        });
      } else {
        setNotionSyncResult({
          success: false,
          message: data.error || data.details || 'Failed to query Notion API. Verify Database ID & Token permissions.',
        });
      }
    } catch (err: any) {
      setNotionSyncResult({
        success: false,
        message: err?.message || 'Network error during Notion synchronization.',
      });
    } finally {
      setNotionSyncing(false);
    }
  };

  // One-Click Download of Notion CSV Template
  const handleDownloadNotionTemplate = () => {
    const csvContent =
      'Look Name,Season,Tier,Occasion,Statement Quote,Thesis,One Rule Broken,Primary Piece,Primary Piece Price,Primary Composition,Secondary Piece,Secondary Piece Price,Secondary Composition,Hero Image,Secondary Image,Status,Archive\n' +
      '"THE SOVEREIGN FLUIDITY","Season I: The Inaugural Wardrobe","EDIT","Trans-continental Transit / Embassy Salon","A complete decision in raw unbleached natural cloth.","Composed with generous chest ease to allow dramatic motion.","Unstructured architectural ease with tailored rigor.","Unstructured Double-Breasted Raw Flax Trench",680,"420gsm Organic Raw Flax","Fluid Pleated Wide-Leg Tropical Wool Trousers",340,"290gsm High-Twist Tropical Wool","https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop","https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop","Active","False"\n' +
      '"THE NOCTURNE RITUAL","Season I: The Inaugural Wardrobe","EDIT","Private Dinner / Nocturnal Salon","Architectural weight rendered in smoked black silk.","Rich smoked umber and obsidian drape designed for dusk.","Smoked obsidian silk worn without synthetic shoulder pad tension.","Smoked Mulberry Silk Evening Robe",720,"380gsm Heavyweight Mulberry Silk","Obsidian High-Twist Relaxed Trousers",360,"310gsm Italian Tropical Wool","https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop","https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop","Active","False"';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'metamorphoo_notion_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Current Storefront to Notion CSV
  const handleExportStorefrontToNotionCSV = () => {
    const allLooks = [...catalog.customLaunchLooks, ...catalog.customArchiveLooks];
    const header =
      'Look Name,Season,Tier,Occasion,Statement Quote,Thesis,One Rule Broken,Primary Piece,Primary Piece Price,Primary Composition,Secondary Piece,Secondary Piece Price,Secondary Composition,Hero Image,Secondary Image,Status,Archive\n';

    const rows = allLooks
      .map((l) => {
        const p1 = l.items[0] || { name: 'Garment 01', price: 250, composition: '100% Natural Fibre' };
        const p2 = l.items[1] || { name: 'Garment 02', price: 200, composition: '100% Natural Fibre' };
        return `"${l.name.replace(/"/g, '""')}","${l.season.replace(/"/g, '""')}","${l.tier}","${l.occasion.replace(/"/g, '""')}","${l.statementQuote.replace(/"/g, '""')}","${l.longThesis.replace(/"/g, '""')}","${l.oneRuleBroken.replace(/"/g, '""')}","${p1.name.replace(/"/g, '""')}",${p1.price},"${p1.composition.replace(/"/g, '""')}","${p2.name.replace(/"/g, '""')}",${p2.price},"${p2.composition.replace(/"/g, '""')}","${l.heroImage}","${l.galleryImages?.[1]?.url || l.heroImage}","${l.status === 'vaulted' ? 'Vaulted' : 'Active'}","${l.seasonCode === 'ARCHIVE_VAULT' ? 'True' : 'False'}"`;
      })
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `metamorphoo_notion_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyNotionGuide = () => {
    const guide = `# METAMORPHOO Notion Database Setup Guide

Create a new Database table in your Notion Workspace named "Metamorphoo Collection", with the following properties:

1. **Look Name** (Title) — e.g. "THE MEDITERRANEAN EMBASSY"
2. **Season** (Select) — e.g. "Season I: The Inaugural Wardrobe"
3. **Tier** (Select) — "EDIT" | "ARCHIVE" | "ORIGINAL"
4. **Occasion** (Text) — e.g. "Trans-continental Transit / Embassy Salon"
5. **Statement Quote** (Text) — e.g. "A complete decision in raw unbleached natural cloth."
6. **Thesis** (Text) — Editorial rationale and setting description
7. **One Rule Broken** (Text) — e.g. "Unstructured ease with tailored rigor"
8. **Primary Piece** (Text) — Outerwear / Main piece name
9. **Primary Piece Price** (Number) — e.g. 680
10. **Primary Composition** (Text) — e.g. "420gsm Organic Raw Flax & Silk"
11. **Secondary Piece** (Text) — Trouser / Secondary piece name
12. **Secondary Piece Price** (Number) — e.g. 340
13. **Secondary Composition** (Text) — e.g. "290gsm High-Twist Tropical Wool"
14. **Hero Image** (URL or Files) — High-res editorial photo URL
15. **Secondary Image** (URL or Files) — Detail / tactile photo URL
16. **Status** (Select) — "Active" | "Vaulted"
17. **Archive** (Checkbox or Select) — "True" if placing in Archive Vault

Connect your database in Metamorphoo Atelier Studio by entering your Notion Database ID and Internal Integration Token!`;

    navigator.clipboard.writeText(guide);
    setCopiedNotionGuide(true);
    setTimeout(() => setCopiedNotionGuide(false), 3000);
  };

  // Add empty piece to manual form
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
      silhouette: p.silhouette || 'Fluid Architectural',
      image: p.image || heroImage,
      sizes: Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ['S', 'M', 'L'],
      description: p.description || 'Mastercrafted garment for complete ensemble harmony.',
      curationNote: p.curationNote || 'Approved under Metamorphoo editorial standard.',
      pinLocation: p.pinLocation || {
        x: 35 + ((idx * 20) % 40),
        y: 25 + ((idx * 25) % 50),
      },
      fitGuidance: {
        cut: (p.silhouette as any) || 'Fluid Architectural',
        modelStats: p.modelStats || "Model is 188cm / 6'2\", wearing Size L",
        drapeWeight: (p.drapeWeight as any) || 'Heavyweight Archival (340-420gsm)',
        recommendedSizing: p.recommendedSizing || 'True to size for relaxed silhouette.',
        measurementsSummary: p.measurementsSummary
          ? {
              chestOrWaist: p.measurementsSummary.chestOrWaist || '118cm (Chest)',
              length: p.measurementsSummary.length || '114cm',
              hemOrOpening: p.measurementsSummary.hemOrOpening || '52cm',
            }
          : undefined,
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
      status: isArchivedSection ? 'vaulted' : 'active',
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
      editionTotal: editionTotal ? Number(editionTotal) : undefined,
      allocatedCount: 0,
      dropTimestamp: isTimedDropEnabled && dropDateText ? new Date(dropDateText).getTime() : undefined,
      vipPassword: isVipLockEnabled && vipPassword.trim() ? vipPassword.trim() : undefined,
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
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 sm:px-12 py-5 bg-[var(--bg-surface)]/95 border-b border-[var(--border-subtle)]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full border border-[var(--color-sand)] flex items-center justify-center text-[var(--color-sand)] bg-[var(--bg-canvas)]">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <span className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-[var(--color-sand)] block">
                METAMORPHOO PRIVATE DESK
              </span>
              <h2 className="font-cormorant text-2xl uppercase tracking-wider text-[var(--text-primary)]">
                ATELIER CURATOR & NOTION STUDIO
              </h2>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="hidden md:flex items-center space-x-1.5 bg-[var(--bg-canvas)] p-1 border border-[var(--border-subtle)]">
            <button
              onClick={() => setActiveTab('notion')}
              className={`px-3.5 py-1.5 font-montserrat text-[10px] uppercase tracking-[0.2em] transition-colors flex items-center space-x-1.5 ${
                activeTab === 'notion'
                  ? 'bg-[var(--text-primary)] text-[var(--bg-surface)] font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Database className="w-3 h-3 text-[var(--color-sand)]" />
              <span>Notion Live Sync</span>
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-3.5 py-1.5 font-montserrat text-[10px] uppercase tracking-[0.2em] transition-colors ${
                activeTab === 'create'
                  ? 'bg-[var(--text-primary)] text-[var(--bg-surface)] font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              + Quick Look Builder
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-3.5 py-1.5 font-montserrat text-[10px] uppercase tracking-[0.2em] transition-colors ${
                activeTab === 'manage'
                  ? 'bg-[var(--text-primary)] text-[var(--bg-surface)] font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Catalog & JSON ({catalog.customLaunchLooks.length + catalog.customArchiveLooks.length})
            </button>
            <button
              onClick={() => setActiveTab('governance')}
              className={`px-3.5 py-1.5 font-montserrat text-[10px] uppercase tracking-[0.2em] transition-colors ${
                activeTab === 'governance'
                  ? 'bg-[var(--text-primary)] text-[var(--bg-surface)] font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Doctrine
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {/* Palette Switcher in Studio Header */}
            <button
              onClick={() => themeStore.toggleTheme()}
              className="px-2.5 py-1.5 border border-[var(--border-subtle)] hover:border-[var(--border-medium)] bg-[var(--bg-canvas)] text-[var(--text-primary)] font-montserrat text-[9px] uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
              title="Toggle Bone / Obsidian view"
            >
              {theme === 'obsidian' ? (
                <>
                  <Moon className="w-3 h-3 text-[var(--color-sand)]" />
                  <span className="hidden sm:inline">OBSIDIAN MODE</span>
                </>
              ) : (
                <>
                  <Sun className="w-3 h-3 text-[var(--color-rust)]" />
                  <span className="hidden sm:inline">BONE MODE</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus:outline-none flex items-center space-x-2"
            >
              <span className="font-montserrat text-[10px] uppercase tracking-[0.25em] hidden sm:inline-block">
                CLOSE
              </span>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="md:hidden flex border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <button
            onClick={() => setActiveTab('notion')}
            className={`flex-1 py-3 text-center font-montserrat text-[9px] uppercase tracking-wider ${
              activeTab === 'notion' ? 'text-[var(--text-primary)] border-b-2 border-[var(--color-sand)] font-medium' : 'text-[var(--text-muted)]'
            }`}
          >
            Notion Sync
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-3 text-center font-montserrat text-[9px] uppercase tracking-wider ${
              activeTab === 'create' ? 'text-[var(--text-primary)] border-b-2 border-[var(--color-sand)]' : 'text-[var(--text-muted)]'
            }`}
          >
            Upload
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex-1 py-3 text-center font-montserrat text-[9px] uppercase tracking-wider ${
              activeTab === 'manage' ? 'text-[var(--text-primary)] border-b-2 border-[var(--color-sand)]' : 'text-[var(--text-muted)]'
            }`}
          >
            Catalog
          </button>
          <button
            onClick={() => setActiveTab('governance')}
            className={`flex-1 py-3 text-center font-montserrat text-[9px] uppercase tracking-wider ${
              activeTab === 'governance' ? 'text-[var(--text-primary)] border-b-2 border-[var(--color-sand)]' : 'text-[var(--text-muted)]'
            }`}
          >
            Doctrine
          </button>
        </div>

        {/* Tab 0: NOTION LIVE SYNC & MANAGEMENT (RECOMMENDED & PREFERRED) */}
        {activeTab === 'notion' && (
          <div className="max-w-5xl mx-auto px-6 sm:px-12 py-10 space-y-10">
            {/* Notion Hero Intro */}
            <div className="p-8 bg-[var(--bg-surface)] border border-[var(--border-medium)] relative overflow-hidden space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 bg-[var(--color-rust)]/20 text-[var(--color-rust)] border border-[var(--color-rust)]/30 text-[9px] font-montserrat uppercase tracking-[0.25em] font-medium">
                      RECOMMENDED WORKFLOW
                    </span>
                    <span className="text-[10px] font-montserrat text-[var(--color-sand)]">
                      $0.00 ZERO-COST ARCHITECTURE
                    </span>
                  </div>
                  <h3 className="font-cormorant text-3xl sm:text-4xl text-[var(--text-primary)] font-light uppercase tracking-wider">
                    Notion Collection Management & Live Sync
                  </h3>
                  <p className="font-montserrat text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                    Manage all Metamorphoo lookbook collections, garment prices, fabrics, and photography directly inside your familiar Notion workspace. Update rows in Notion to publish instantly to the storefront without touching code.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleDownloadNotionTemplate}
                    className="px-4 py-2.5 bg-[var(--text-primary)] hover:bg-[var(--text-primary)]/90 text-[var(--bg-surface)] font-montserrat text-[10px] uppercase tracking-[0.22em] font-semibold flex items-center justify-center space-x-2 transition-colors"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>DOWNLOAD NOTION TEMPLATE</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportStorefrontToNotionCSV}
                    className="px-4 py-2.5 border border-[var(--border-medium)] hover:border-[var(--color-sand)] text-[var(--text-primary)] font-montserrat text-[10px] uppercase tracking-[0.22em] flex items-center justify-center space-x-2 transition-colors"
                  >
                    <ArrowDownToLine className="w-3.5 h-3.5 text-[var(--color-sand)]" />
                    <span>EXPORT STOREFRONT TO NOTION</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sync Feedback Banner */}
            {notionSyncResult && (
              <div
                className={`p-4 border font-montserrat text-xs flex items-start justify-between gap-4 ${
                  notionSyncResult.success
                    ? 'bg-[var(--bg-surface)] border-[#25D366] text-[#25D366]'
                    : 'bg-[var(--bg-surface)] border-[var(--color-rust)] text-[var(--color-rust)]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  {notionSyncResult.success ? (
                    <Check className="w-4 h-4 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 shrink-0" />
                  )}
                  <span>{notionSyncResult.message}</span>
                </div>
                <button
                  onClick={() => setNotionSyncResult(null)}
                  className="text-[10px] opacity-70 hover:opacity-100 uppercase tracking-wider"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Direct Notion API Connection Box */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-6">
                <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-5">
                  <div className="border-b border-[var(--border-subtle)] pb-3 flex items-center justify-between">
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--color-sand)] block font-medium">
                      STEP 1 · NOTION API INTEGRATION
                    </span>
                    <span className="text-[9px] font-montserrat text-[var(--text-muted)]">
                      Instant Live Fetch
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)] block mb-1.5">
                        NOTION INTERNAL INTEGRATION SECRET (API TOKEN)
                      </label>
                      <input
                        type="password"
                        value={notionApiKey}
                        onChange={(e) => setNotionApiKey(e.target.value)}
                        placeholder="secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        className="w-full bg-[var(--bg-canvas)] border border-[var(--border-medium)] px-4 py-2.5 text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--text-primary)]"
                      />
                      <span className="text-[9px] text-[var(--text-muted)] font-montserrat mt-1 block">
                        Obtain in 10 seconds at <a href="https://www.notion.so/my-integrations" target="_blank" rel="noreferrer" className="text-[var(--color-sand)] underline">notion.so/my-integrations</a>
                      </span>
                    </div>

                    <div>
                      <label className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)] block mb-1.5">
                        NOTION DATABASE ID OR DATABASE URL
                      </label>
                      <input
                        type="text"
                        value={notionDbId}
                        onChange={(e) => setNotionDbId(e.target.value)}
                        placeholder="e.g. 1a2b3c4d5e6f7a8b9c0d or full Notion database URL"
                        className="w-full bg-[var(--bg-canvas)] border border-[var(--border-medium)] px-4 py-2.5 text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--text-primary)]"
                      />
                      <span className="text-[9px] text-[var(--text-muted)] font-montserrat mt-1 block">
                        Found in your Notion database share URL (the 32-character string between / and ?v=)
                      </span>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                      <button
                        type="button"
                        onClick={handleLiveNotionSync}
                        disabled={notionSyncing || (!notionApiKey.trim() && !rawNotionTableText.trim())}
                        className="w-full sm:w-auto px-6 py-3 bg-[var(--color-sand)] hover:opacity-90 disabled:opacity-40 text-[var(--bg-canvas)] font-montserrat text-xs uppercase tracking-[0.22em] font-semibold transition-colors flex items-center justify-center space-x-2"
                      >
                        {notionSyncing ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>SYNCING FROM NOTION...</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>SYNC FROM NOTION NOW</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveNotionCreds}
                        className="text-[10px] font-montserrat uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-[var(--text-primary)] underline py-2"
                      >
                        Save Credentials
                      </button>
                    </div>
                  </div>
                </div>

                {/* Direct Notion Table Paste Fallback (Zero Config) */}
                <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                  <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--color-sand)] block font-medium">
                      STEP 2 (OPTIONAL) · PASTE NOTION TABLE / JSON DIRECTLY
                    </span>
                    <span className="text-[9px] font-montserrat text-[var(--text-muted)]">
                      Zero-API-Key Path
                    </span>
                  </div>

                  <textarea
                    rows={4}
                    value={rawNotionTableText}
                    onChange={(e) => setRawNotionTableText(e.target.value)}
                    placeholder='Paste Notion JSON export, look manifest, or table text here...'
                    className="w-full bg-[var(--bg-canvas)] border border-[var(--border-medium)] px-4 py-3 text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--text-primary)] resize-none"
                  />

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleLiveNotionSync()}
                      disabled={!rawNotionTableText.trim()}
                      className="px-4 py-2 bg-[var(--bg-elevated)] hover:bg-[var(--border-medium)] disabled:opacity-40 text-[var(--text-primary)] font-montserrat text-[10px] uppercase tracking-[0.2em] transition-colors"
                    >
                      PARSE & SYNC PASTED PAYLOAD
                    </button>

                    <button
                      type="button"
                      onClick={() => setRawNotionTableText('')}
                      className="text-[9px] font-montserrat text-[var(--text-muted)] hover:text-[var(--color-rust)] uppercase"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              {/* Notion Field Guide & 1-Click Setup */}
              <div className="lg:col-span-5 space-y-6">
                <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                  <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--color-sand)] font-medium">
                      NOTION TABLE PROPERTIES
                    </span>
                    <button
                      onClick={handleCopyNotionGuide}
                      className="text-[9px] font-montserrat uppercase tracking-wider text-[var(--color-sand)] hover:text-[var(--text-primary)] flex items-center space-x-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedNotionGuide ? 'COPIED!' : 'COPY SCHEMA'}</span>
                    </button>
                  </div>

                  <ul className="space-y-2 text-[10px] font-montserrat text-[var(--text-secondary)]">
                    <li className="flex items-start justify-between border-b border-[var(--border-subtle)] pb-1.5">
                      <span className="font-medium text-[var(--text-primary)]">Look Name</span>
                      <span className="text-[var(--color-sand)]">Title</span>
                    </li>
                    <li className="flex items-start justify-between border-b border-[var(--border-subtle)] pb-1.5">
                      <span className="font-medium text-[var(--text-primary)]">Season</span>
                      <span className="text-[var(--color-sand)]">Select / Text</span>
                    </li>
                    <li className="flex items-start justify-between border-b border-[var(--border-subtle)] pb-1.5">
                      <span className="font-medium text-[var(--text-primary)]">Tier</span>
                      <span className="text-[var(--color-sand)]">EDIT | ARCHIVE</span>
                    </li>
                    <li className="flex items-start justify-between border-b border-[var(--border-subtle)] pb-1.5">
                      <span className="font-medium text-[var(--text-primary)]">Occasion</span>
                      <span className="text-[var(--color-sand)]">Text</span>
                    </li>
                    <li className="flex items-start justify-between border-b border-[var(--border-subtle)] pb-1.5">
                      <span className="font-medium text-[var(--text-primary)]">One Rule Broken</span>
                      <span className="text-[var(--color-rust)]">Required Doctrine</span>
                    </li>
                    <li className="flex items-start justify-between border-b border-[var(--border-subtle)] pb-1.5">
                      <span className="font-medium text-[var(--text-primary)]">Primary Piece & Price</span>
                      <span className="text-[var(--color-sand)]">Text & Number</span>
                    </li>
                    <li className="flex items-start justify-between border-b border-[var(--border-subtle)] pb-1.5">
                      <span className="font-medium text-[var(--text-primary)]">Secondary Piece & Price</span>
                      <span className="text-[var(--color-sand)]">Text & Number</span>
                    </li>
                    <li className="flex items-start justify-between">
                      <span className="font-medium text-[var(--text-primary)]">Hero Image</span>
                      <span className="text-[var(--color-sand)]">URL or Files</span>
                    </li>
                  </ul>

                  <div className="pt-2">
                    <p className="text-[9px] font-montserrat text-[var(--text-muted)] leading-relaxed">
                      Tip: Clicking &quot;Download Notion Template&quot; gives you a pre-filled CSV you can import into Notion in 1 second.
                    </p>
                  </div>
                </div>

                {/* Staging Status Summary */}
                <div className="p-6 bg-[var(--bg-canvas)] border border-[var(--border-medium)] space-y-3">
                  <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--color-sand)] block font-medium">
                    STOREFRONT LIVE STATS
                  </span>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                      <div className="font-cormorant text-2xl text-[var(--text-primary)] font-light">
                        {catalog.customLaunchLooks.length}
                      </div>
                      <div className="font-montserrat text-[8px] uppercase tracking-widest text-[var(--text-muted)]">
                        Active Looks
                      </div>
                    </div>
                    <div className="p-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                      <div className="font-cormorant text-2xl text-[var(--text-primary)] font-light">
                        {catalog.customArchiveLooks.length}
                      </div>
                      <div className="font-montserrat text-[8px] uppercase tracking-widest text-[var(--text-muted)]">
                        Vaulted Looks
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
                        HEX COLORS (COMMA SEPARATED)
                      </label>
                      <input
                        type="text"
                        value={paletteColorsText}
                        onChange={(e) => setPaletteColorsText(e.target.value)}
                        placeholder="#E8E0D5, #1A1611, #C4623A"
                        className="w-full bg-[var(--bg-canvas)] border border-[var(--border-medium)] px-4 py-3 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)]"
                      />
                    </div>
                  </div>

                  {/* Drop Scheduling & VIP Exclusivity Parameters */}
                  <div className="pt-4 border-t border-[var(--border-subtle)] space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
                      <div>
                        <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--color-sand)] block font-medium">
                          DROP SCHEDULING & VIP ALLOCATION CONTROLS
                        </span>
                        <p className="font-montserrat text-[10px] text-[var(--text-muted)] mt-0.5">
                          Optional: Toggle timed countdowns or password gates. Default is instant public availability.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Toggle 1: Timed Countdown Drop */}
                      <div className="p-4 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-montserrat text-[9px] uppercase tracking-wider text-[var(--text-primary)] font-medium">
                            TIMED COUNTDOWN DROP
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsTimedDropEnabled(!isTimedDropEnabled)}
                            className={`px-2.5 py-1 text-[9px] font-montserrat uppercase tracking-wider transition-colors border ${
                              isTimedDropEnabled
                                ? 'bg-[var(--color-sand)] text-[var(--bg-canvas)] border-[var(--color-sand)] font-bold'
                                : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-medium)] hover:text-[var(--text-primary)]'
                            }`}
                          >
                            {isTimedDropEnabled ? 'COUNTDOWN ON' : 'OFF (IMMEDIATE)'}
                          </button>
                        </div>
                        {isTimedDropEnabled && (
                          <div className="pt-2 space-y-1">
                            <label className="font-montserrat text-[8px] uppercase tracking-widest text-[var(--text-muted)] block">
                              SCHEDULED DROP DATE & TIME *
                            </label>
                            <input
                              type="datetime-local"
                              required={isTimedDropEnabled}
                              value={dropDateText}
                              onChange={(e) => setDropDateText(e.target.value)}
                              className="w-full bg-[var(--bg-surface)] border border-[var(--border-medium)] px-3 py-2 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)]"
                            />
                          </div>
                        )}
                      </div>

                      {/* Toggle 2: VIP Invitation Password Gate */}
                      <div className="p-4 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-montserrat text-[9px] uppercase tracking-wider text-[var(--text-primary)] font-medium">
                            VIP INVITATION LOCK
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsVipLockEnabled(!isVipLockEnabled)}
                            className={`px-2.5 py-1 text-[9px] font-montserrat uppercase tracking-wider transition-colors border ${
                              isVipLockEnabled
                                ? 'bg-[var(--color-rust)] text-[#F5EFE4] border-[var(--color-rust)] font-bold'
                                : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-medium)] hover:text-[var(--text-primary)]'
                            }`}
                          >
                            {isVipLockEnabled ? 'VIP GATED ON' : 'OFF (PUBLIC)'}
                          </button>
                        </div>
                        {isVipLockEnabled && (
                          <div className="pt-2 space-y-1">
                            <label className="font-montserrat text-[8px] uppercase tracking-widest text-[var(--text-muted)] block">
                              VIP ALLOCATION KEY / PASSWORD *
                            </label>
                            <input
                              type="text"
                              required={isVipLockEnabled}
                              value={vipPassword}
                              onChange={(e) => setVipPassword(e.target.value)}
                              placeholder="e.g. MΦ-INVITE-2026"
                              className="w-full bg-[var(--bg-surface)] border border-[var(--border-medium)] px-3 py-2 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)]"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Numbered Edition Quantity Limit (Optional) */}
                    <div className="space-y-1">
                      <label className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)] block">
                        NUMBERED EDITION QUANTITY LIMIT (OPTIONAL)
                      </label>
                      <input
                        type="number"
                        value={editionTotal}
                        onChange={(e) => setEditionTotal(e.target.value)}
                        placeholder="e.g. 50 (leave blank for standard atelier allocation)"
                        className="w-full bg-[var(--bg-canvas)] border border-[var(--border-medium)] px-3 py-2.5 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)]"
                      />
                    </div>
                  </div>

                  {/* Imagery URLs */}
                  <div className="space-y-4 pt-2 border-t border-[var(--border-subtle)]">
                    <div className="space-y-1">
                      <label className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)] block">
                        HERO EDITORIAL PHOTOGRAPHY URL *
                      </label>
                      <input
                        type="url"
                        required
                        value={heroImage}
                        onChange={(e) => setHeroImage(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-[var(--bg-canvas)] border border-[var(--border-medium)] px-4 py-3 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)] block">
                        SECONDARY / TACTILE PHOTOGRAPHY URL
                      </label>
                      <input
                        type="url"
                        value={secondaryImage}
                        onChange={(e) => setSecondaryImage(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-[var(--bg-canvas)] border border-[var(--border-medium)] px-4 py-3 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)]"
                      />
                    </div>
                  </div>
                </div>

                {/* Garment Pieces Section */}
                <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6">
                  <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                    <div>
                      <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--color-sand)] block">
                        ENSEMBLE PIECES ({pieces.length})
                      </span>
                      <h3 className="font-cormorant text-2xl text-[var(--text-primary)] uppercase tracking-wider">
                        Garment Breakdown & Hotspots
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddPiece}
                      className="px-3 py-1.5 bg-[var(--bg-canvas)] hover:bg-[var(--border-medium)] border border-[var(--border-medium)] text-[var(--text-primary)] text-xs font-montserrat uppercase tracking-wider flex items-center space-x-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Piece</span>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {pieces.map((piece, idx) => (
                      <div
                        key={piece.id}
                        className={`p-4 bg-[var(--bg-canvas)] border transition-colors space-y-4 relative ${
                          activePinPieceIndex === idx
                            ? 'border-[var(--color-sand)] ring-1 ring-[var(--color-sand)]'
                            : 'border-[var(--border-subtle)]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[var(--color-sand)] font-medium">
                              PIECE 0{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => setActivePinPieceIndex(idx)}
                              className={`text-[8px] font-montserrat uppercase tracking-widest px-2 py-0.5 border ${
                                activePinPieceIndex === idx
                                  ? 'bg-[var(--color-sand)] text-[var(--bg-canvas)] font-bold border-[var(--color-sand)]'
                                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
                              }`}
                            >
                              📍 PIN: ({piece.pinLocation?.x ?? 40}%, {piece.pinLocation?.y ?? 40}%) {activePinPieceIndex === idx ? '· ACTIVE (CLICK PHOTO)' : '· POSITION'}
                            </button>
                          </div>
                          {pieces.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemovePiece(idx)}
                              className="text-[var(--text-muted)] hover:text-[var(--color-rust)] transition-colors p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
                              placeholder="e.g. Raw Flax Kimono Jacket"
                              className="w-full bg-[var(--bg-surface)] border border-[var(--border-medium)] px-3 py-2 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)]"
                            />
                          </div>

                          <div>
                            <label className="font-montserrat text-[8px] uppercase tracking-widest text-[var(--text-muted)] block mb-1">
                              CATEGORY
                            </label>
                            <select
                              value={piece.category}
                              onChange={(e) => handleUpdatePiece(idx, 'category', e.target.value)}
                              className="w-full bg-[var(--bg-surface)] border border-[var(--border-medium)] px-3 py-2 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)]"
                            >
                              {['Shirt', 'Trousers', 'Shoes', 'Watch', 'Fragrance', 'Accessory', 'Jacket', 'Knitwear', 'Eyewear'].map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="font-montserrat text-[8px] uppercase tracking-widest text-[var(--text-muted)] block mb-1">
                              PRICE (USD) *
                            </label>
                            <input
                              type="number"
                              required
                              value={piece.price}
                              onChange={(e) => handleUpdatePiece(idx, 'price', Number(e.target.value))}
                              className="w-full bg-[var(--bg-surface)] border border-[var(--border-medium)] px-3 py-2 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)]"
                            />
                          </div>

                          <div>
                            <label className="font-montserrat text-[8px] uppercase tracking-widest text-[var(--text-muted)] block mb-1">
                              NATURAL COMPOSITION *
                            </label>
                            <input
                              type="text"
                              required
                              value={piece.composition}
                              onChange={(e) => handleUpdatePiece(idx, 'composition', e.target.value)}
                              placeholder="e.g. 380gsm Unbleached Italian Linen"
                              className="w-full bg-[var(--bg-surface)] border border-[var(--border-medium)] px-3 py-2 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)]"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="font-montserrat text-[8px] uppercase tracking-widest text-[var(--text-muted)] block">
                              AVAILABLE SIZES
                            </label>
                            {/* Size Presets */}
                            <div className="flex items-center space-x-1">
                              <span className="text-[8px] font-montserrat text-[var(--text-muted)] uppercase">Presets:</span>
                              {[
                                { label: 'S-XL', val: ['S', 'M', 'L', 'XL'] },
                                { label: '30-36', val: ['30', '32', '34', '36'] },
                                { label: '46-52', val: ['46', '48', '50', '52'] },
                                { label: 'One Size', val: ['ONE SIZE'] },
                                { label: 'Bespoke', val: ['CUSTOM ATELIER BESPOKE'] },
                              ].map((preset) => (
                                <button
                                  key={preset.label}
                                  type="button"
                                  onClick={() => handleUpdatePiece(idx, 'sizes', preset.val)}
                                  className="px-1.5 py-0.5 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[7px] font-mono hover:border-[var(--color-sand)] text-[var(--text-secondary)]"
                                >
                                  {preset.label}
                                </button>
                              ))}
                            </div>
                          </div>
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

                        {/* Rich Textile & Material Narrative */}
                        <div className="space-y-1 pt-1 border-t border-[var(--border-subtle)]">
                          <label className="font-montserrat text-[8px] uppercase tracking-widest text-[var(--text-muted)] block">
                            MATERIAL NARRATIVE & WEAVE DETAILS
                          </label>
                          <textarea
                            rows={2}
                            value={piece.description || ''}
                            onChange={(e) => handleUpdatePiece(idx, 'description', e.target.value)}
                            placeholder="e.g. 420gsm Organic Raw Flax & Mulberry Silk Weft. Hand-sewn horn buttons with invisible blind stitching."
                            className="w-full bg-[var(--bg-surface)] border border-[var(--border-medium)] px-3 py-2 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)] resize-none"
                          />
                        </div>

                        {/* Curation Note & Styling Guidance */}
                        <div className="space-y-1">
                          <label className="font-montserrat text-[8px] uppercase tracking-widest text-[var(--text-muted)] block">
                            CURATION & STYLING NOTE (ANI CHISOM DIRECTIVE)
                          </label>
                          <input
                            type="text"
                            value={piece.curationNote || ''}
                            onChange={(e) => handleUpdatePiece(idx, 'curationNote', e.target.value)}
                            placeholder="e.g. Cut with generous chest ease to allow dramatic, unstudied motion. Pair with open collar."
                            className="w-full bg-[var(--bg-surface)] border border-[var(--border-medium)] px-3 py-2 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)]"
                          />
                        </div>

                        {/* Fit, Drape Weight & Model Specs */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-[var(--border-subtle)]">
                          <div className="space-y-1">
                            <label className="font-montserrat text-[8px] uppercase tracking-widest text-[var(--text-muted)] block">
                              CUT / SILHOUETTE
                            </label>
                            <input
                              type="text"
                              value={piece.silhouette || ''}
                              onChange={(e) => handleUpdatePiece(idx, 'silhouette', e.target.value)}
                              placeholder="e.g. Fluid Architectural"
                              className="w-full bg-[var(--bg-surface)] border border-[var(--border-medium)] px-3 py-2 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)]"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-montserrat text-[8px] uppercase tracking-widest text-[var(--text-muted)] block">
                              DRAPE WEIGHT & DENSITY
                            </label>
                            <input
                              type="text"
                              value={piece.drapeWeight || ''}
                              onChange={(e) => handleUpdatePiece(idx, 'drapeWeight', e.target.value)}
                              placeholder="e.g. 420gsm Heavyweight Archival"
                              className="w-full bg-[var(--bg-surface)] border border-[var(--border-medium)] px-3 py-2 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)]"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-montserrat text-[8px] uppercase tracking-widest text-[var(--text-muted)] block">
                              MODEL SPECIFICATIONS
                            </label>
                            <input
                              type="text"
                              value={piece.modelStats || ''}
                              onChange={(e) => handleUpdatePiece(idx, 'modelStats', e.target.value)}
                              placeholder="e.g. Model is 188cm / 6ft 2in, wearing Size L"
                              className="w-full bg-[var(--bg-surface)] border border-[var(--border-medium)] px-3 py-2 text-xs text-[var(--text-primary)] font-montserrat focus:outline-none focus:border-[var(--text-primary)]"
                            />
                          </div>
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

              {/* Live Preview Card with Interactive Pin Placer (Right Column) */}
              <div className="space-y-6">
                <div className="sticky top-24 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-montserrat text-[9px] uppercase tracking-[0.25em] text-[var(--color-sand)] font-medium">
                      VISUAL PIN PLACER & PREVIEW
                    </span>
                    <span className="font-montserrat text-[9px] text-[var(--text-muted)]">
                      {activePinPieceIndex !== null ? `Placing Piece 0${activePinPieceIndex + 1}` : 'Click to place'}
                    </span>
                  </div>

                  <div className="bg-[var(--bg-surface)] border border-[var(--border-medium)] overflow-hidden shadow-2xl">
                    <div
                      onClick={(e) => {
                        const targetIndex = activePinPieceIndex !== null ? activePinPieceIndex : 0;
                        if (targetIndex >= pieces.length) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const xPercent = Math.max(5, Math.min(95, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
                        const yPercent = Math.max(5, Math.min(95, Math.round(((e.clientY - rect.top) / rect.height) * 100)));
                        handleUpdatePiece(targetIndex, 'pinLocation', { x: xPercent, y: yPercent });
                      }}
                      className="relative aspect-[3/4] w-full bg-[var(--bg-canvas)] cursor-crosshair group/canvas"
                      title="Click anywhere to place garment hotspot pin"
                    >
                      {heroImage ? (
                        <EditorialImage
                          src={heroImage}
                          alt="Look preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] text-xs">
                          No Image Provided
                        </div>
                      )}

                      {/* Visual Pins on Image */}
                      {pieces.map((p, pIdx) => {
                        const pin = p.pinLocation || { x: 35 + ((pIdx * 20) % 40), y: 25 + ((pIdx * 25) % 50) };
                        const isActive = activePinPieceIndex === pIdx;
                        return (
                          <div
                            key={p.id}
                            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivePinPieceIndex(pIdx);
                            }}
                            className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                          >
                            <div className={`flex items-center justify-center w-6 h-6 rounded-full border text-[9px] font-mono font-bold shadow-lg transition-transform ${
                              isActive
                                ? 'bg-[var(--color-rust)] text-[#F5EFE4] border-[#F5EFE4] scale-125 ring-2 ring-[var(--color-sand)]'
                                : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-medium)] hover:scale-110'
                            }`}>
                              0{pIdx + 1}
                            </div>
                          </div>
                        );
                      })}

                      <div className="absolute top-4 left-4 bg-[var(--bg-canvas)]/90 backdrop-blur-md px-3 py-1 border border-[var(--border-subtle)] text-[9px] font-montserrat uppercase tracking-[0.2em] text-[var(--text-primary)]">
                        CLICK IMAGE TO POSITION PIN
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
