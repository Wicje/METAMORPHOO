import { NextRequest, NextResponse } from 'next/server';

interface NotionPropertyRichText {
  type?: string;
  rich_text?: Array<{ plain_text: string }>;
  title?: Array<{ plain_text: string }>;
  select?: { name: string };
  multi_select?: Array<{ name: string }>;
  number?: number;
  url?: string;
  files?: Array<{ name: string; file?: { url: string }; external?: { url: string } }>;
  status?: { name: string };
  checkbox?: boolean;
}

function extractText(prop?: NotionPropertyRichText): string {
  if (!prop) return '';
  if (prop.title && prop.title.length > 0) {
    return prop.title.map((t) => t.plain_text).join('');
  }
  if (prop.rich_text && prop.rich_text.length > 0) {
    return prop.rich_text.map((t) => t.plain_text).join('');
  }
  if (prop.select) {
    return prop.select.name || '';
  }
  if (prop.status) {
    return prop.status.name || '';
  }
  if (prop.url) {
    return prop.url;
  }
  return '';
}

function extractNumber(prop?: NotionPropertyRichText, fallback = 0): number {
  if (!prop) return fallback;
  if (typeof prop.number === 'number') return prop.number;
  const txt = extractText(prop).replace(/[^0-9.]/g, '');
  const parsed = parseFloat(txt);
  return isNaN(parsed) ? fallback : parsed;
}

function extractUrlOrImage(prop?: NotionPropertyRichText): string {
  if (!prop) return '';
  if (prop.url) return prop.url;
  if (prop.files && prop.files.length > 0) {
    const f = prop.files[0];
    return f.file?.url || f.external?.url || '';
  }
  return extractText(prop);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { apiKey, databaseId, manualCsvText, manualJsonText } = body;

    // 1. Direct Notion API fetch if apiKey & databaseId provided
    if (apiKey && databaseId) {
      const cleanDbId = databaseId.replace(/-/g, '').trim();
      const notionRes = await fetch(`https://api.notion.com/v1/databases/${cleanDbId}/query`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page_size: 100,
        }),
      });

      if (!notionRes.ok) {
        const errText = await notionRes.text();
        return NextResponse.json(
          {
            error: `Notion API responded with status ${notionRes.status}`,
            details: errText,
          },
          { status: notionRes.status }
        );
      }

      const notionData = await notionRes.json();
      const results = notionData.results || [];

      // Map Notion Pages into structured Metamorphoo Looks
      const parsedLooks = results.map((page: any, index: number) => {
        const props = page.properties || {};
        
        // Match standard or custom Notion property names gracefully
        const name =
          extractText(props['Look Name']) ||
          extractText(props['Name']) ||
          extractText(props['Title']) ||
          `LOOK 0${index + 1}`;
        const subName =
          extractText(props['Sub Name']) ||
          extractText(props['Subtitle']) ||
          'THE SARTORIAL COMPOSITION';
        const season =
          extractText(props['Season']) || 'Season I: The Inaugural Wardrobe';
        const tier = (extractText(props['Tier']) || 'EDIT').toUpperCase();
        const occasion =
          extractText(props['Occasion']) ||
          'Trans-continental Transit / Embassy Salon';
        const statementQuote =
          extractText(props['Statement Quote']) ||
          extractText(props['Quote']) ||
          'A complete decision in raw unbleached natural cloth.';
        const longThesis =
          extractText(props['Thesis']) ||
          extractText(props['Description']) ||
          'Formulated under Metamorphoo curatorial discipline.';
        const oneRuleBroken =
          extractText(props['One Rule Broken']) ||
          'Unstructured architectural ease with tailored rigor.';
        const status =
          extractText(props['Status']).toLowerCase() === 'vaulted'
            ? 'vaulted'
            : 'active';
        const isArchive =
          extractText(props['Archive']).toLowerCase() === 'true' ||
          status === 'vaulted' ||
          extractText(props['Vault']).toLowerCase() === 'true';

        const heroImage =
          extractUrlOrImage(props['Hero Image']) ||
          extractUrlOrImage(props['Image']) ||
          extractUrlOrImage(props['Cover']) ||
          'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop';
        
        const secondaryImage =
          extractUrlOrImage(props['Secondary Image']) ||
          extractUrlOrImage(props['Detail Image']) ||
          heroImage;

        // Try extracting structured items JSON or build default items
        let items: any[] = [];
        const rawItemsText = extractText(props['Pieces JSON'] || props['Items JSON'] || props['Garments']);
        if (rawItemsText) {
          try {
            items = JSON.parse(rawItemsText);
          } catch {
            // not valid JSON
          }
        }

        if (!items || items.length === 0) {
          // Build standard default pieces if not explicitly supplied as JSON
          const defaultPrice1 = extractNumber(props['Primary Piece Price'], 680);
          const defaultPrice2 = extractNumber(props['Secondary Piece Price'], 340);
          const defaultPieceName1 = extractText(props['Primary Piece']) || `${name} Primary Robe / Outerwear`;
          const defaultPieceName2 = extractText(props['Secondary Piece']) || `${name} Tailored Trouser`;

          items = [
            {
              id: `notion-item-${page.id}-1`,
              name: defaultPieceName1,
              category: 'Jacket',
              price: defaultPrice1,
              currency: 'USD',
              composition: extractText(props['Primary Composition']) || '420gsm Organic Raw Flax & Mulberry Silk',
              tier: tier === 'ARCHIVE' ? 'ARCHIVE' : 'EDIT',
              origin: 'Atelier Metamorphoo Certified Allocation',
              silhouette: 'Fluid Architectural',
              image: heroImage,
              sizes: ['S', 'M', 'L', 'XL'],
              description: 'Hand-sewn horn buttons with invisible blind stitching.',
              curationNote: 'Cut with generous chest ease to allow dramatic, unstudied motion.',
              pinLocation: { x: 42, y: 35 },
              fitGuidance: {
                cut: 'Fluid Architectural',
                modelStats: "Model is 188cm / 6'2\", wearing Size L",
                drapeWeight: 'Medium Drape (240-300gsm)',
                recommendedSizing: 'True to size for relaxed silhouette.',
              },
              provenance: {
                condition: 'Atelier Curated Standard',
                inspectionBy: 'Ani Chisom & Curatorial Bureau',
                authenticationStandard: '100% Natural Fibre Integrity · Zero Synthetic Tension',
                packaging: 'Archival Breathable Cotton Travel Garment Case + Cedar Block',
              },
              isAvailable: true,
            },
            {
              id: `notion-item-${page.id}-2`,
              name: defaultPieceName2,
              category: 'Trousers',
              price: defaultPrice2,
              currency: 'USD',
              composition: extractText(props['Secondary Composition']) || '290gsm High-Twist Tropical Wool',
              tier: tier === 'ARCHIVE' ? 'ARCHIVE' : 'EDIT',
              origin: 'Atelier Metamorphoo Certified Allocation',
              silhouette: 'Structured Tailored',
              image: secondaryImage,
              sizes: ['30', '32', '34', '36'],
              description: 'Double reverse pleats, extended tab waistband.',
              curationNote: 'Engineered with clean drop to fall cleanly without synthetic stiffness.',
              pinLocation: { x: 50, y: 65 },
              fitGuidance: {
                cut: 'Structured Tailored',
                modelStats: "Model is 188cm / 6'2\", wearing Size 32",
                drapeWeight: 'Substantial Drape (290gsm)',
                recommendedSizing: 'True to size.',
              },
              provenance: {
                condition: 'Atelier Curated Standard',
                inspectionBy: 'Ani Chisom & Curatorial Bureau',
                authenticationStandard: '100% Natural Fibre Integrity',
                packaging: 'Archival Garment Case',
              },
              isAvailable: true,
            },
          ];
        }

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        return {
          id: `notion-look-${page.id}`,
          notionPageId: page.id,
          slug,
          name: name.toUpperCase(),
          subName,
          occasion,
          paletteDescription: extractText(props['Palette']) || 'Warm Alabaster, Smoked Umber & Tuscan Terracotta',
          paletteColors: ['#E8E0D5', '#1A1611', '#C4623A'],
          statementQuote,
          longThesis,
          tier: tier as any,
          season,
          seasonCode: isArchive ? 'ARCHIVE_VAULT' : 'SEASON_I',
          status: status as any,
          oneRuleBroken,
          heroImage,
          galleryImages: [
            { url: heroImage, caption: `${name} — Full editorial portrait`, type: 'full' },
            { url: secondaryImage, caption: `${name} — Tactile angle`, type: 'second_angle' },
          ],
          items,
          isArchive,
        };
      });

      return NextResponse.json({
        success: true,
        source: 'notion_api',
        totalSynced: parsedLooks.length,
        looks: parsedLooks,
      });
    }

    // 2. Manual CSV / JSON Parse
    if (manualJsonText) {
      const parsed = JSON.parse(manualJsonText);
      const looks = Array.isArray(parsed) ? parsed : parsed.looks || parsed.launchLooks || [];
      return NextResponse.json({
        success: true,
        source: 'manual_json',
        totalSynced: looks.length,
        looks,
      });
    }

    return NextResponse.json(
      {
        error: 'Missing Notion credentials (apiKey & databaseId) or raw table payload.',
      },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Failed to synchronize with Notion database',
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
