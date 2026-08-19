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
    const body = await req.json().catch(() => ({}));
    const apiKey = body.apiKey || process.env.NOTION_API_KEY || '';
    const databaseId = body.databaseId || process.env.NOTION_DATABASE_ID || '';
    const { manualCsvText, manualJsonText } = body;

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
        const rawPlacement = (
          extractText(props['Placement']) ||
          extractText(props['Display']) ||
          extractText(props['Section']) ||
          ''
        ).toLowerCase();
        const rawStatus = (extractText(props['Status']) || '').toLowerCase();

        let status: 'active' | 'vaulted' | 'directory_only' = 'active';
        if (
          rawStatus === 'vaulted' ||
          rawPlacement.includes('vault') ||
          rawPlacement.includes('archive') ||
          extractText(props['Archive']).toLowerCase() === 'true'
        ) {
          status = 'vaulted';
        } else if (
          rawPlacement.includes('directory') ||
          rawStatus === 'directory_only' ||
          rawPlacement.includes('standalone')
        ) {
          status = 'directory_only';
        }

        const isArchive = status === 'vaulted';

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
          const defaultCategory1 =
            extractText(props['Category']) ||
            extractText(props['Primary Category']) ||
            'Jacket';
          const defaultPrice1 = extractNumber(
            props['Primary Piece Price'] || props['Price'],
            450
          );
          const defaultPieceName1 =
            extractText(props['Primary Piece']) ||
            extractText(props['Piece Name']) ||
            name;
          const rawSizes1 = extractText(props['Primary Sizes'] || props['Sizes']);
          const sizes1 = rawSizes1
            ? rawSizes1.split(',').map((s) => s.trim()).filter(Boolean)
            : ['S', 'M', 'L', 'XL'];
          const cut1 =
            extractText(props['Primary Cut'] || props['Cut'] || props['Silhouette']) ||
            'Fluid Architectural';
          const drape1 =
            extractText(
              props['Primary Drape'] ||
                props['Drape Weight'] ||
                props['Fabric Weight']
            ) || 'Medium Drape (240-300gsm)';
          const model1 =
            extractText(
              props['Primary Model'] ||
                props['Model Stats'] ||
                props['Model Specs']
            ) || "Model is 188cm / 6'2\", wearing Size L for natural drop";
          const desc1 =
            extractText(
              props['Primary Description'] ||
                props['Description'] ||
                props['Material Story'] ||
                props['Fabric Details']
            ) || 'Hand-sewn horn buttons with invisible blind stitching.';
          const note1 =
            extractText(
              props['Primary Curation Note'] ||
                props['Curation Note'] ||
                props['Styling Note']
            ) || 'Cut with generous chest ease to allow dramatic, unstudied motion.';

          items = [
            {
              id: `notion-item-${page.id}-1`,
              name: defaultPieceName1,
              category: defaultCategory1 as any,
              price: defaultPrice1,
              currency: 'USD',
              composition:
                extractText(props['Primary Composition'] || props['Composition']) ||
                '420gsm Organic Raw Flax & Mulberry Silk',
              tier: tier === 'ARCHIVE' ? 'ARCHIVE' : 'EDIT',
              origin: 'Atelier Metamorphoo Certified Allocation',
              silhouette: cut1,
              image: heroImage,
              sizes: sizes1,
              description: desc1,
              curationNote: note1,
              pinLocation: { x: 42, y: 35 },
              fitGuidance: {
                cut: cut1 as any,
                modelStats: model1,
                drapeWeight: drape1 as any,
                recommendedSizing: 'True to size for intended architectural silhouette.',
              },
              provenance: {
                condition: 'Atelier Curated Standard',
                inspectionBy: 'Ani Chisom & Curatorial Bureau',
                authenticationStandard:
                  '100% Natural Fibre Integrity · Zero Synthetic Tension',
                packaging:
                  'Archival Breathable Cotton Travel Garment Case + Cedar Block',
              },
              isAvailable: true,
            },
          ];

          // If a secondary piece is explicitly supplied in Notion, attach it as piece 2
          const secondaryPieceName = extractText(props['Secondary Piece']);
          if (secondaryPieceName && status !== 'directory_only') {
            const rawSizes2 = extractText(props['Secondary Sizes']);
            const sizes2 = rawSizes2
              ? rawSizes2.split(',').map((s) => s.trim()).filter(Boolean)
              : ['30', '32', '34', '36'];
            const cut2 =
              extractText(props['Secondary Cut'] || props['Secondary Silhouette']) ||
              'Structured Tailored';
            const drape2 =
              extractText(props['Secondary Drape'] || props['Secondary Fabric Weight']) ||
              'Substantial Drape (290gsm)';
            const model2 =
              extractText(props['Secondary Model'] || props['Secondary Model Stats']) ||
              "Model is 188cm / 6'2\", wearing Size 32";

            items.push({
              id: `notion-item-${page.id}-2`,
              name: secondaryPieceName,
              category: (extractText(props['Secondary Category']) || 'Trousers') as any,
              price: extractNumber(props['Secondary Piece Price'], 340),
              currency: 'USD',
              composition:
                extractText(props['Secondary Composition']) ||
                '290gsm High-Twist Tropical Wool',
              tier: tier === 'ARCHIVE' ? 'ARCHIVE' : 'EDIT',
              origin: 'Atelier Metamorphoo Certified Allocation',
              silhouette: cut2,
              image: secondaryImage,
              sizes: sizes2,
              description:
                extractText(props['Secondary Description']) ||
                'Double reverse pleats, extended tab waistband.',
              curationNote:
                extractText(props['Secondary Curation Note']) ||
                'Engineered with clean drop to fall cleanly without synthetic stiffness.',
              pinLocation: { x: 50, y: 65 },
              fitGuidance: {
                cut: cut2 as any,
                modelStats: model2,
                drapeWeight: drape2 as any,
                recommendedSizing: 'True to size.',
              },
              provenance: {
                condition: 'Atelier Curated Standard',
                inspectionBy: 'Ani Chisom & Curatorial Bureau',
                authenticationStandard: '100% Natural Fibre Integrity',
                packaging: 'Archival Garment Case',
              },
              isAvailable: true,
            });
          }
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
          editionTotal: extractNumber(props['Edition Total'] || props['Edition Limit'] || props['Quantity Limit'], 0) || undefined,
          allocatedCount: 0,
          dropTimestamp: extractText(props['Drop Date'] || props['Drop Timestamp']) ? new Date(extractText(props['Drop Date'] || props['Drop Timestamp'])).getTime() : undefined,
          vipPassword: extractText(props['VIP Key'] || props['VIP Password'] || props['Invitation Key']) || undefined,
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
    const rawText = (manualCsvText || manualJsonText || '').trim();

    if (rawText) {
      // Check if rawText is JSON
      if (rawText.startsWith('{') || rawText.startsWith('[')) {
        try {
          const parsed = JSON.parse(rawText);
          const looks = Array.isArray(parsed) ? parsed : parsed.looks || parsed.launchLooks || [];
          return NextResponse.json({
            success: true,
            source: 'manual_json',
            totalSynced: looks.length,
            looks,
          });
        } catch {
          // fallback to CSV if JSON parse fails
        }
      }

      // Parse as CSV
      const lines = rawText.split(/\r?\n/).filter((l: string) => l.trim().length > 0);
      if (lines.length > 1) {
        const parseCsvLine = (line: string): string[] => {
          const res: string[] = [];
          let cur = '';
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              if (inQuotes && line[i + 1] === '"') {
                cur += '"';
                i++;
              } else {
                inQuotes = !inQuotes;
              }
            } else if (char === ',' && !inQuotes) {
              res.push(cur.trim());
              cur = '';
            } else {
              cur += char;
            }
          }
          res.push(cur.trim());
          return res;
        };

        const headers = parseCsvLine(lines[0]).map((h: string) => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
        const getCol = (row: string[], nameKeywords: string[], fallback = '') => {
          for (let idx = 0; idx < headers.length; idx++) {
            const h = headers[idx];
            if (nameKeywords.some((kw) => h.includes(kw))) {
              return row[idx] || fallback;
            }
          }
          return fallback;
        };

        const parsedCsvLooks = lines.slice(1).map((line: string, idx: number) => {
          const cols = parseCsvLine(line);
          const name = getCol(cols, ['lookname', 'name', 'title'], `LOOK 0${idx + 1}`);
          const season = getCol(cols, ['season'], 'Season I: The Inaugural Wardrobe');
          const tier = getCol(cols, ['tier'], 'EDIT').toUpperCase();
          const occasion = getCol(cols, ['occasion'], 'Trans-continental Transit / Embassy Salon');
          const quote = getCol(cols, ['statementquote', 'quote'], 'A complete decision in raw unbleached natural cloth.');
          const thesis = getCol(cols, ['thesis', 'description'], 'Formulated under Metamorphoo curatorial discipline.');
          const rule = getCol(cols, ['onerulebroken', 'rule'], 'Unstructured architectural ease with tailored rigor.');
          const status = getCol(cols, ['status'], 'Active').toLowerCase() === 'vaulted' ? 'vaulted' : 'active';
          const isArchive = getCol(cols, ['archive', 'vault'], 'false').toLowerCase() === 'true' || status === 'vaulted';

          const heroImage = getCol(cols, ['heroimage', 'image', 'cover'], 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop');
          const secondaryImage = getCol(cols, ['secondaryimage', 'detailimage'], heroImage);

          const p1Name = getCol(cols, ['primarypiece', 'piece1'], `${name} Primary Garment`);
          const p1Price = parseFloat(getCol(cols, ['primarypieceprice', 'price1'], '680')) || 680;
          const p1Comp = getCol(cols, ['primarycomposition', 'comp1'], '420gsm Organic Raw Flax & Mulberry Silk');

          const p2Name = getCol(cols, ['secondarypiece', 'piece2'], `${name} Tailored Trouser`);
          const p2Price = parseFloat(getCol(cols, ['secondarypieceprice', 'price2'], '340')) || 340;
          const p2Comp = getCol(cols, ['secondarycomposition', 'comp2'], '290gsm High-Twist Tropical Wool');

          const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

          return {
            id: `csv-look-${idx + 1}-${Date.now()}`,
            slug,
            name: name.toUpperCase(),
            subName: 'THE SARTORIAL COMPOSITION',
            occasion,
            paletteDescription: 'Warm Alabaster, Smoked Umber & Tuscan Terracotta',
            paletteColors: ['#E8E0D5', '#1A1611', '#C4623A'],
            statementQuote: quote,
            longThesis: thesis,
            tier: (tier === 'ARCHIVE' ? 'EDIT' : tier) as any,
            season,
            seasonCode: isArchive ? 'ARCHIVE_VAULT' : 'SEASON_I',
            status: status as any,
            oneRuleBroken: rule,
            heroImage,
            galleryImages: [
              { url: heroImage, caption: `${name} — Editorial portrait`, type: 'full' as const },
              { url: secondaryImage, caption: `${name} — Tactile angle`, type: 'second_angle' as const },
            ],
            items: [
              {
                id: `csv-item-${idx + 1}-1`,
                name: p1Name,
                category: 'Jacket' as const,
                price: p1Price,
                currency: 'USD',
                composition: p1Comp,
                tier: 'EDIT' as const,
                origin: 'Atelier Metamorphoo Certified Allocation',
                silhouette: 'Fluid Architectural',
                image: heroImage,
                sizes: ['S', 'M', 'L', 'XL'],
                description: 'Hand-sewn horn buttons with invisible blind stitching.',
                curationNote: 'Cut with generous chest ease to allow dramatic, unstudied motion.',
                pinLocation: { x: 42, y: 35 },
                isAvailable: true,
              },
              {
                id: `csv-item-${idx + 1}-2`,
                name: p2Name,
                category: 'Trousers' as const,
                price: p2Price,
                currency: 'USD',
                composition: p2Comp,
                tier: 'EDIT' as const,
                origin: 'Atelier Metamorphoo Certified Allocation',
                silhouette: 'Structured Tailored',
                image: secondaryImage,
                sizes: ['30', '32', '34', '36'],
                description: 'Double reverse pleats, extended tab waistband.',
                curationNote: 'Engineered with clean drop to fall cleanly without synthetic stiffness.',
                pinLocation: { x: 50, y: 65 },
                isAvailable: true,
              },
            ],
            isArchive,
          };
        });

        return NextResponse.json({
          success: true,
          source: 'manual_csv',
          totalSynced: parsedCsvLooks.length,
          looks: parsedCsvLooks,
        });
      }
    }

    return NextResponse.json(
      {
        error: 'Missing Notion credentials (apiKey & databaseId) or raw table payload (CSV/JSON).',
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

export async function GET() {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!apiKey || !databaseId) {
    return NextResponse.json({
      configured: false,
      message: 'Notion environment variables (NOTION_API_KEY, NOTION_DATABASE_ID) not configured on server.',
    });
  }

  // Trigger server-side fetch with env credentials
  return POST(
    new NextRequest('https://metamorphoo.com/api/notion/sync', {
      method: 'POST',
      body: JSON.stringify({ apiKey, databaseId }),
    })
  );
}
