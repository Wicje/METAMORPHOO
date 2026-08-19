# METAMORPHOO (MΦ) — MAISON OPERATIONS & PRIVATE SETUP GUIDE

> **CONFIDENTIAL ATELIER REFERENCE**  
> This guide outlines how to manage looks, publish new drops, configure global image hosting (Google Drive, Cloudinary, ImgBB, Local), and connect Notion as your $0 global database.

---

## 1. Quick Reference & Secret Admin Access

The public website has **zero visible admin buttons** so your luxury clients and buyers experience an immaculate, high-fashion storefront.

### How to Open the Secret Atelier Desk:
* **Option A (Keyboard Shortcut):** Press **`Shift + Alt + A`** anywhere on the website.
* **Option B (Private URL):** Open `yourwebsite.com/?admin=true` in your browser.

---

## 2. Image Hosting Guide (Google Drive, Instagram & Free CDNs)

Luxury fashion presentation requires permanent, high-resolution photography that never breaks or expires.

### A. Using Google Drive (Recommended for Personal Photo Libraries)
Google Drive is great if your lookbook photos are in a shared Drive folder.

1. Upload your editorial photo to Google Drive.
2. Right-click the photo → **Share** → Set General Access to **"Anyone with the link can view"**.
3. Copy the link:
   ```
   https://drive.google.com/file/d/1AbC2DeF3GhI4JkLmNoPqRsTuVwXyZ/view?usp=sharing
   ```
4. Copy the **FILE ID** (the long string between `/d/` and `/view`):
   `1AbC2DeF3GhI4JkLmNoPqRsTuVwXyZ`
5. Convert it into the **Direct High-Resolution CDN URL**:
   ```
   https://lh3.googleusercontent.com/d/1AbC2DeF3GhI4JkLmNoPqRsTuVwXyZ
   ```
   *(This URL is pre-configured in `next.config.ts` and loads with full Next.js image optimization and automatic caching).*

---

### B. Using Instagram (Important Notice)
> [!WARNING]  
> **Direct Instagram image URLs expire after 48–72 hours** because Instagram attaches temporary security tokens to protect user privacy.

* **Best Practice:** Download your high-res original photos from Instagram or your camera, and paste them into:
  1. **Google Drive** (using the method above), or
  2. **ImgBB** / **Cloudinary** (permanent lifetime hosting, zero cost).

---

### C. Using Free Lifetime Image Hosts (Fastest & Zero Setup)

#### 1. ImgBB (Free, Instant, Permanent)
* Visit [imgbb.com](https://imgbb.com)
* Drag & drop your lookbook photos.
* Under *Auto-delete*, choose **"Don't autodelete"**.
* Copy the **Direct Link** (e.g. `https://i.ibb.co/abcdef/look-01.jpg`).
* Paste directly into Notion or the Curator Studio.

#### 2. Cloudinary (Free 25GB Professional CDN)
* Create a free account at [cloudinary.com](https://cloudinary.com).
* Upload your lookbook photos into a folder named `metamorphoo`.
* Use the permanent secure image URL (e.g. `https://res.cloudinary.com/your-cloud/image/upload/v1/metamorphoo/look-01.jpg`).

---

### D. Local Website Assets (Offline & Zero External Dependencies)
You can store lookbook images directly in the website repository:
1. Place photos into `public/looks/` (e.g. `public/looks/look-01.jpg`).
2. Use the local path anywhere: `/looks/look-01.jpg`.
3. Permanent, ultra-fast, and hosted directly on Vercel's global CDN.

---

## 3. Connecting Notion as Your Free Global Database

Using Notion allows Ani Chisom and the curation bureau to update prices, descriptions, photography, and drops without writing code.

### Step 1: Create a Notion Integration
1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations).
2. Click **"+ New integration"**.
3. Name it `Metamorphoo Atelier Integration`.
4. Click **Save** and copy the **Internal Integration Secret** (`secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`).

### Step 2: Create or Import the Notion Database
1. Open the secret Atelier Desk (`Shift + Alt + A`).
2. Click **"DOWNLOAD NOTION TEMPLATE"** to download `metamorphoo_notion_template.csv`.
3. In Notion, create a new page, click **Import** → select the CSV file.
4. Notion will build a database table with all columns ready:
   * `Look Name` (Title: e.g. *THE SOVEREIGN FLUIDITY* or *1980s Deadstock Linen Camp Shirt*)
   * `Placement` (Select: *Wardrobe & Directory*, *Directory Only*, or *Archive Vault*)
   * `Category` (Select: *Jacket*, *Shirt*, *Trousers*, *Knitwear*, *Shoes*, *Accessory*, *Fragrance*, *Eyewear*)
   * `Season` (Select: *Season I: The Inaugural Wardrobe*)
   * `Tier` (Select: *EDIT*, *ORIGINALS*, *ATELIER*)
   * `Occasion` (Text)
   * `One Rule Broken` (Text)
   * `Statement Quote` (Text)
   * `Long Thesis` (Text)
   * `Hero Image` (URL / File)
   * `Secondary Image` (URL / File)
   * `Primary Piece` (Text: e.g. *Unstructured Double-Breasted Trench*)
   * `Primary Piece Price` (Number: e.g. *680*)
   * `Primary Composition` (Text: e.g. *420gsm Organic Raw Flax*)
   * `Secondary Piece` (Text: optional for full 2-piece looks)
   * `Secondary Piece Price` (Number: optional)
   * `Secondary Composition` (Text: optional)
   * `Status` (Select: *active*, *directory_only*, or *vaulted*)
   * `Drop Date` (Date / Text: optional e.g. *2026-10-01T18:00*)
   * `VIP Key` (Text: optional e.g. *MΦ-VIP-2026*)
   * `Edition Limit` (Number: optional e.g. *50*)

### Example: How Your Notion Table Looks in Real Life

| Look Name | Placement | Category | Hero Image | Primary Piece | Price | Composition | Where It Appears |
|---|---|---|---|---|---|---|---|
| **THE SOVEREIGN FLUIDITY** | `Wardrobe & Directory` | `Jacket` | `https://...` | Raw Flax Trench Coat | `680` | 420gsm Organic Raw Flax | **Both Runway & Directory** |
| **VINTAGE DEADSTOCK SILK SHIRT** | `Directory Only` | `Shirt` | `https://...` | 1980s Sandwashed Silk Shirt | `290` | 100% Mulberry Silk | **Directory Only (No Runway)** |
| **THE OBSIDIAN TUXEDO (SOLD)** | `Archive Vault` | `Jacket` | `https://...` | Smoked Wool Evening Robe | `920` | 320gsm High-Twist Wool | **Archive Vault Only** |

### Step 3: Grant Access to Your Database
1. In your Notion database, click the **`•••`** menu (top right).
2. Click **Connect to** → Select `Metamorphoo Atelier Integration`.

### Step 4: Copy the Database ID
Look at your Notion database URL:
```
https://www.notion.so/myworkspace/a1b2c3d4e5f678901234567890abcdef?v=12345...
```
The **Database ID** is the 32-character string before `?v=`:
`a1b2c3d4e5f678901234567890abcdef`

---

## 4. Environment Variables Configuration

Create a file named `.env.local` in your project root (or set these in your **Vercel Project Settings → Environment Variables**):

```env
# 1. Base URL for SEO & OpenGraph Social Share Cards
APP_URL=https://metamorphoo.com

# 2. WhatsApp Concierge Direct Number (Include Country Code, No '+' or spaces)
# Example for Nigeria: 2348012345678 | UK: 447123456789 | Portugal: 351912345678
NEXT_PUBLIC_CONCIERGE_WHATSAPP=2348123456789

# 3. Concierge Notification Email
NEXT_PUBLIC_CONCIERGE_EMAIL=concierge@metamorphoo.com

# 4. Optional: Resend API Key for Automated Email Receipts (resend.com)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 5. Notion Free Headless CMS Database
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=a1b2c3d4e5f678901234567890abcdef
```

---

## 5. Daily Operations: Publishing a New Collection Drop

### Workflow 1: Via Notion (Zero Code)
1. Add a new row in your Notion table.
2. Fill in the Look Name, hero image link (Google Drive / ImgBB / Cloudinary), pieces, prices, and fabric GSMs.
3. If it is a timed drop, enter the `Drop Date` (e.g. `2026-10-15T18:00`).
4. If it is a private VIP drop, enter the `VIP Key` (e.g. `MΦ-VIP-LISBON`).
5. Set `Status` to `active` (or `vaulted` if adding to the archive vault).
6. Press **`Shift + Alt + A`** on the website and click **`SYNC FROM NOTION NOW`** (or let the server auto-sync).

### Workflow 2: Via Secret Curator Studio (`Shift + Alt + A`)
1. Press **`Shift + Alt + A`** to open the Curator Studio.
2. Switch to the **`Create New Look`** tab.
3. Fill out the Look form.
4. Click on the live preview image on the right to position garment hotspot pins (`01`, `02`) interactively.
5. Click **`PUBLISH LOOK TO LIVE CATALOG`**.

---

## 6. How Orders & Allocations Flow

```
Client Clicks "INITIATE ALLOCATION" in Bag
              │
              ▼
1. Generates Formal Allocation Reference (e.g. MΦ-ALLOC-849201)
2. Saves persistent client record to Private Ledger
3. Dispatches email notification to concierge@metamorphoo.com
4. Opens direct WhatsApp conversation with pre-filled Sartorial Manifest:
   - Client details & delivery address
   - Requested pieces, sizes, and currency
   - Sovereign ensemble notes
```

---

## 7. Keyboard Shortcuts Cheat Sheet

| Key | Action |
|---|---|
| **`J`** or **`↓`** | Next Look on runway |
| **`K`** or **`↑`** | Previous Look on runway |
| **`ESC`** | Close all open modals & drawers |
| **`T`** | Toggle Chromatic Palette (*Bone Linen* ↔ *Smoked Obsidian*) |
| **`B`** | Open / Close Wardrobe Bag |
| **`L`** | Open / Close Private Client Ledger |
| **`?`** | Open Keyboard Navigation HUD |
| **`Shift + Alt + A`** | Open Secret Atelier & Notion Desk |

---

*Directed by Ani Chisom · Metamorphoo Curatorial Bureau · Lagos · Lisbon · Milan*
