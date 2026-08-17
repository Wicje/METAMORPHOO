# METAMORPHOO (MΦ)

> **A curated world of complete sartorial decisions · Directed by Ani Chisom**  
> *Lagos · Lisbon · Milan*

---

## 🏛️ Brand Overview & Manifesto

**METAMORPHOO** is a cinematic luxury digital maison dedicated to the doctrine of complete sartorial decisions. Rather than presenting isolated, fragmented garments, METAMORPHOO curates and manufactures holistic, sovereign ensembles designed for effortless elegance, fluid drape, and uncompromising natural fibre integrity.

### The Three Core Pillars

1. **100% Natural Fibre Integrity**: Strictly mulberry silks, virgin wools, organic raw linens, cashmeres, and sea-island cottons. Zero synthetic tension.
2. **The One-Rule-Broken Doctrine**: Every ensemble intentionally breaks exactly one classical tailoring convention (e.g., raw selvedge edging under double-faced silk, undone mother-of-pearl cuffs, or architectural slub textures) to impart effortless dynamism.
3. **Complete Decision Curation**: Every piece in a look is engineered to exist in perfect aesthetic dialogue with one another, allowing clients to acquire either an entire head-to-toe ensemble or individual components.

---

## ✨ Features & Architecture

### 1. The Wardrobe (Season I: The Inaugural Wardrobe)
- **Cinematic Look Showcase**: High-resolution editorial photography presented with fluid horizontal snapping and vertical detail viewing.
- **Garment Breakdown Overlay**: Real-time inspection of individual pieces composing the look, including fabric weight (gsm), origin atelier, and sizing.
- **Acquire Complete Look**: One-click acquisition of the entire ensemble directly into the wardrobe cart.

### 2. Archive Vault & EDIT Directory
- **Archive Vault**: Historical record and past season capsules with private allocation inquiry channels.
- **EDIT Standard Directory**: Categorized directory filtering looks by occasion, silhouette (Structured, Fluid, Draped), and fibre composition.

### 3. ORIGINALS (Phase 02 In-House Manufacture)
- **Numbered Private Capsules**: Manufactured in strictly limited runs (editions of 30, 50, 75) across Como, Guimarães, and Lagos.
- **The Hairline MΦ Monogram**: Discreet, tone-on-tone identification at the inner hem without exterior branding.
- **Priority Access Registry**: Pre-release allocation registration with instant WhatsApp concierge confirmation.

### 4. The House & Provenance
- **Maison Philosophy**: Comprehensive manifesto on natural fibres, drape, and sartorial composure.
- **Founder & Creative Direction**: Background and vision of Ani Chisom.
- **Concierge Correspondence**: Dedicated inquiry dispatch for press, private clients, and bespoke atelier appointments.

### 5. Dual Chromatic Palette Architecture
- **Bone Linen (Light)**: Organic unbleached flax, alabaster canvas, deep espresso typography, and burnt terracotta accents.
- **Smoked Obsidian (Dark)**: Deep charcoal undertones, smoked umber canvas, muted sand typography, and nocturnal salon atmosphere.
- **Global Controller**: Managed via the *Sartorial Chromatic Palette* selector in the global footer and synchronized across all views.

### 6. Private Client Ledger & Multi-Currency Bag
- **Private Client Ledger**: Client-side reactive persistence for bookmarking ensembles and individual pieces.
- **Multi-Currency Settlement**: Live price conversion across **USD ($)**, **EUR (€)**, **GBP (£)**, **NGN (₦)**, **JPY (¥)**, and **CAD ($)**.
- **Direct Concierge WhatsApp Checkout**: Formatted dispatch payload routing orders directly to the private concierge desk.

### 7. Atelier Curator Studio & Notion Live Sync Suite
- **Notion Database Integration**: Server-side API endpoint (`/app/api/notion/sync/route.ts`) querying Notion databases to ingest looks, garments, prices, and fabric compositions dynamically.
- **Zero-Config CSV/JSON Fallback**: Ingestion engine supporting manual paste of catalog JSON or CSV data.
- **Template Download & Catalog Export**: One-click export of the storefront to Notion CSV format, plus downloadable Notion database templates.
- **Discreet Access**: Accessible via the unobtrusive `[ ATELIER DESK ]` trigger in the global footer.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15+ (App Router, Server Actions, Route Handlers) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 & PostCSS |
| **Animations** | Motion (`motion/react`) |
| **Iconography** | Lucide React |
| **Typography** | Cormorant Garamond (Headings) & Montserrat (Body/Mono) |
| **State Persistence** | Reactive Stores with `useSyncExternalStore` & `localStorage` |

---

## 📁 Project Structure

```text
├── app/
│   ├── api/
│   │   ├── notion/
│   │   │   └── sync/
│   │   │       └── route.ts        # Notion API synchronization endpoint
│   │   └── waitlist/
│   │       └── route.ts            # Private capsule allocation endpoint
│   ├── globals.css                 # Dual palette variables (Bone & Obsidian)
│   ├── layout.tsx                  # Root layout & font configuration
│   └── page.tsx                    # Main storefront orchestrator & footer
├── components/
│   ├── ArchiveVaultView.tsx        # Archival capsule showcase
│   ├── ConciergeChatWidget.tsx     # Floating styling concierge
│   ├── CuratorLedgerModal.tsx      # Editorial brief & criteria modal
│   ├── CuratorStudioModal.tsx      # Ingestion & Notion sync desk
│   ├── EditDirectoryView.tsx       # Standard piece directory
│   ├── ItemDetailModal.tsx         # Individual garment deep-dive
│   ├── LedgerModal.tsx             # Saved looks & pieces ledger
│   ├── LookDetailModal.tsx         # Full look inspection modal
│   ├── Navbar.tsx                  # Minimalist luxury navigation bar
│   ├── OriginalsView.tsx           # In-house manufactured capsule
│   ├── TheHouseView.tsx            # Maison story & palette doctrine
│   ├── WardrobeDrawer.tsx          # Multi-currency acquisition bag
│   └── WardrobeScroll.tsx          # Editorial horizontal look stream
├── lib/
│   ├── cart-store.ts               # Wardrobe acquisition bag state
│   ├── catalog-store.ts            # Dynamic catalog & look inventory
│   ├── concierge.ts                # Concierge routing & waitlist logic
│   ├── currency.ts                 # Multi-currency converter & store
│   ├── data.ts                     # Editorial looks, items & house copy
│   ├── ledger-store.ts             # Saved looks/items reactive store
│   ├── theme.ts                    # Bone/Obsidian theme store & sync
│   └── types.ts                    # TypeScript interface definitions
├── metadata.json                   # Application capabilities & metadata
└── package.json                    # Project dependencies & build scripts
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local` to configure environment secrets:

```bash
# Gemini AI API Key (Server-side secret)
GEMINI_API_KEY="your-gemini-api-key"

# Application Base URL
APP_URL="https://your-domain.com"

# Concierge WhatsApp number (international format without + or spaces)
NEXT_PUBLIC_CONCIERGE_WHATSAPP="2348123456789"

# Concierge correspondence email
NEXT_PUBLIC_CONCIERGE_EMAIL="concierge@metamorphoo.com"

# Optional: Default Server-Side Notion Integration
NOTION_API_KEY=""
NOTION_DATABASE_ID=""
```

---

## 📋 Notion Database Schema Setup

To sync your private Notion database with METAMORPHOO, create a Notion database with the following properties:

| Property Name | Notion Property Type | Example Value |
|---|---|---|
| **Name** | Title | The Sovereign Sand Silk Ensembles |
| **Subtitle** | Rich Text | THE SARTORIAL COMPOSITION |
| **Occasion** | Select / Text | Midday Transit / Mediterranean Coast |
| **Season** | Select / Text | Season I: The Inaugural Wardrobe |
| **One Rule Broken** | Rich Text | Raw unhemmed cuff under tailored silk |
| **Statement Quote** | Rich Text | A complete decision in unbleached silk. |
| **Hero Image URL** | URL / Text | `https://images.unsplash.com/...` |
| **Total Price** | Number | 1850 |
| **Tags** | Multi-Select | Mulberry Silk, Sand, Relaxed |
| **Items JSON** | Rich Text (Optional) | `[{"name": "...", "price": 850}]` |

> *Tip: Curators can download a pre-formatted CSV template directly inside the **Atelier Desk** (`CuratorStudioModal.tsx`) for instant database creation.*

---

## 🚀 Development & Build Commands

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Validate TypeScript & ESLint rules
npm run lint

# Build production bundle
npm run build

# Start production server
npm run start
```

---

## 📄 License & Attribution

© 2026 METAMORPHOO BUREAU. All rights reserved. Directed by Ani Chisom.  
Zero Synthetic Tension · Complete Ensemble Harmony.
