import { Look } from './types';

export const LAUNCH_LOOKS: Look[] = [
  {
    id: 'look-1',
    slug: 'the-sovereign',
    name: 'THE SOVEREIGN',
    subName: 'Look 01 — Flagship Power',
    occasion: 'Boardroom, Private Gallery Opening, Diplomatic Reception',
    paletteDescription: 'Ivory + Near-Black with Subtle Bone Patina',
    paletteColors: ['#F5EFE4', '#1A1611', '#E8E0D5', '#3D352B'],
    statementQuote: 'The room notices before you speak.',
    longThesis:
      'A study in quiet dominance. The silhouette trades aggressive angularity for relaxed, heavyweight draping. The oversized double-pleated trouser grounds the posture, while the hand-finished silk-cotton tunic shirt softens the neckline.',
    tier: 'EDIT',
    season: 'Saison Premier',
    oneRuleBroken:
      'Precision chest tailoring contrasted against an exaggerated, wide-sweep fluid hem.',
    heroImage:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      {
        url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85',
        caption: 'Full Silhouette — Natural morning light in quiet terrazzo gallery',
        type: 'full',
      },
      {
        url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85',
        caption: 'Fabric Texture — 380gsm dry wool-linen weave drape',
        type: 'texture',
      },
      {
        url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85',
        caption: 'Detail Context — Minimalist obsidian dial and signet edge',
        type: 'accessory',
      },
      {
        url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1200&q=85',
        caption: 'Second Angle — Mid-stride with natural shoulder structure',
        type: 'second_angle',
      },
    ],
    items: [
      {
        id: 'sov-01',
        name: 'Silk-Cotton Pleated Tunic Shirt',
        category: 'Shirt',
        price: 340,
        currency: 'USD',
        composition: '70% Muga Silk, 30% Long-Staple Egyptian Cotton (210gsm)',
        tier: 'EDIT',
        origin: 'Porto / Northern Portugal Atelier',
        silhouette: 'Relaxed body with structured French placket and drop shoulder',
        image:
          'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=85',
        sizes: ['S', 'M', 'L', 'XL'],
        description:
          'Cut generously through the body to create fluid movement when in motion. Finished with concealed mother-of-pearl buttons and soft band collar.',
        curationNote:
          'Selected by METAMORPHOO. Curated to standard. Natural drape eliminates any synthetic tension.',
        pinLocation: { x: 50, y: 32 },
      },
      {
        id: 'sov-02',
        name: 'Wide-Leg High-Waist Wool Trousers',
        category: 'Trousers',
        price: 460,
        currency: 'USD',
        composition: '85% Tropical Virgin Wool, 15% Mulberry Silk (340gsm)',
        tier: 'EDIT',
        origin: 'Biella Mill, Northern Italy',
        silhouette: 'Deep double forward pleats, 24cm hem opening, side adjusters',
        image:
          'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=800&q=85',
        sizes: ['46 (30)', '48 (32)', '50 (34)', '52 (36)'],
        description:
          'Constructed without belt loops for an uninterrupted architectural waistline. Heavyweight drape breaks cleanly over the shoe.',
        curationNote:
          'Selected by METAMORPHOO. Curated to standard. The baggy proportion is disciplined and intentional.',
        pinLocation: { x: 48, y: 64 },
      },
      {
        id: 'sov-03',
        name: 'Hand-Burnished Calfskin Loafers',
        category: 'Shoes',
        price: 520,
        currency: 'USD',
        composition: 'Full-Grain Box Calf Leather, Vegetable-Tanned Leather Sole',
        tier: 'EDIT',
        origin: 'Almansa, Spain',
        silhouette: 'Slightly elongated almond toe with Goodyear-welted channeled sole',
        image:
          'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=85',
        sizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45'],
        description:
          'Hand-patinated to a deep espresso tone that catches amber highlights in low ambient light. Memory foam-cushioned insole.',
        curationNote:
          'Selected by METAMORPHOO. Curated to standard. Soft break-in with museum-grade leather luster.',
        pinLocation: { x: 52, y: 92 },
      },
      {
        id: 'sov-04',
        name: 'Minimalist Obsidian Dial Dress Watch',
        category: 'Watch',
        price: 680,
        currency: 'USD',
        composition: '38mm Brushed Stainless Steel, Black Onyx Dial, Alligator-Embossed Calf Strap',
        tier: 'EDIT',
        origin: 'Geneva / Bespoke Horology Partner',
        silhouette: 'Ultra-thin 6.8mm case profile with two-hand minimalist layout',
        image:
          'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=85',
        sizes: ['One Size (38mm)'],
        description:
          'Deconstructs the watch into pure form: no numerals, no logo on the face, only two rhodium-plated leaf hands gliding over polished natural obsidian.',
        curationNote:
          'Selected by METAMORPHOO. Curated to standard. Unbranded dial upholds the quiet luxury doctrine.',
        pinLocation: { x: 38, y: 48 },
      },
      {
        id: 'sov-05',
        name: 'Vetiver & Smoked Bergamot Extract',
        category: 'Fragrance',
        price: 210,
        currency: 'USD',
        composition: 'Extrait de Parfum (30% Oil Concentration) — 50ml',
        tier: 'EDIT',
        origin: 'Grasse, France',
        silhouette: 'Smoked Haitian vetiver, Calabrian bergamot, Spanish cistus labdanum',
        image:
          'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=85',
        sizes: ['50ml Extrait'],
        description:
          'Opens with crisp citrus before settling into an earthy, aristocratic resin that stays within a 2-foot aura.',
        curationNote:
          'Selected by METAMORPHOO. Curated to standard. Never sweet; clean dry woods.',
        pinLocation: { x: 62, y: 44 },
      },
    ],
  },
  {
    id: 'look-2',
    slug: 'the-nocturne',
    name: 'THE NOCTURNE',
    subName: 'Look 02 — Evening Intimacy',
    occasion: 'Intimate Dinner, Midnight Salon, Private Collector Event',
    paletteDescription: 'Near-Black + Deep Charcoal with Burnt Sienna Accents',
    paletteColors: ['#1A1611', '#2A241E', '#C4623A', '#E8E0D5'],
    statementQuote: 'Composure in low light.',
    longThesis:
      'Designed for spaces where lighting is an afterthought and shadow is the medium. The matte texture of raw silk absorbs direct illumination while the carnelian stone captures candle flickers.',
    tier: 'EDIT',
    season: 'Saison Premier',
    oneRuleBroken:
      'A formal evening palette worn with an unstructured camp-collar shirt and no neckwear.',
    heroImage:
      'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      {
        url: 'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?auto=format&fit=crop&w=1200&q=85',
        caption: 'Full Silhouette — Nightfall against Lisbon limestone facade',
        type: 'full',
      },
      {
        url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1200&q=85',
        caption: 'Fabric Texture — Matte raw-silk slub texture',
        type: 'texture',
      },
      {
        url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
        caption: 'Accessory — Raw carnelian signet mounted in antiqued brass',
        type: 'accessory',
      },
    ],
    items: [
      {
        id: 'noc-01',
        name: 'Midnight Raw-Silk Camp Collar Shirt',
        category: 'Shirt',
        price: 380,
        currency: 'USD',
        composition: '100% Noil Raw Silk (240gsm)',
        tier: 'EDIT',
        origin: 'Como, Italy',
        silhouette: 'Relaxed fit with retro Cuban collar and straight split hem',
        image:
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=85',
        sizes: ['S', 'M', 'L', 'XL'],
        description:
          'Woven from unrefined raw silk that offers a nubby, tactile surface with matte light absorption. Extremely breathable during warm nocturnal hours.',
        curationNote: 'Selected by METAMORPHOO. Curated to standard.',
        pinLocation: { x: 50, y: 35 },
      },
      {
        id: 'noc-02',
        name: 'Charcoal Double-Pleated Fluid Slacks',
        category: 'Trousers',
        price: 440,
        currency: 'USD',
        composition: '90% High-Twist Wool, 10% Cashmere',
        tier: 'EDIT',
        origin: 'Biella, Italy',
        silhouette: 'High rise, dramatic front drape, uncuffed floor-sweeping hem',
        image:
          'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=85',
        sizes: ['46 (30)', '48 (32)', '50 (34)', '52 (36)'],
        description:
          'High-twist yarn resists creasing after hours of sitting. Generous cut through thigh tapers imperceptibly toward the ankle.',
        curationNote: 'Selected by METAMORPHOO. Curated to standard.',
        pinLocation: { x: 48, y: 65 },
      },
      {
        id: 'noc-03',
        name: 'Midnight Suede Venetian Slippers',
        category: 'Shoes',
        price: 490,
        currency: 'USD',
        composition: 'French Calf Suede Upper, Quilted Silk Lining, Leather Sole',
        tier: 'EDIT',
        origin: 'Veneto, Italy',
        silhouette: 'Grosgrain-trimmed topline with low stacked wooden heel',
        image:
          'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=85',
        sizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44'],
        description:
          'Classic Venetian slipper reimagined for indoor-outdoor ease. Ultra-supple suede molds immediately to the foot.',
        curationNote: 'Selected by METAMORPHOO. Curated to standard.',
        pinLocation: { x: 52, y: 92 },
      },
      {
        id: 'noc-04',
        name: 'Raw Carnelian Signet Ring',
        category: 'Accessory',
        price: 260,
        currency: 'USD',
        composition: 'Solid 925 Sterling Silver with Heavy Oxidized Patina & Natural Carnelian',
        tier: 'EDIT',
        origin: 'Lagos Silversmith Guild',
        silhouette: 'Substantial cushion-cut table with unpolished stone inclusions',
        image:
          'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85',
        sizes: ['US 8', 'US 9', 'US 10', 'US 11'],
        description:
          'A burnt orange carnelian gemstone uncut at the facets, offering raw ancient stone energy against blackened silver.',
        curationNote: 'Selected by METAMORPHOO. Curated to standard.',
        pinLocation: { x: 40, y: 55 },
      },
      {
        id: 'noc-05',
        name: 'Dark Amber & Leather Absolu',
        category: 'Fragrance',
        price: 230,
        currency: 'USD',
        composition: 'Extrait de Parfum — 50ml Glass Flacon with Solid Brass Stopper',
        tier: 'EDIT',
        origin: 'Milan, Italy',
        silhouette: 'Burnt Birch tar, Black vanilla pod, Frankincense, Cistus',
        image:
          'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=85',
        sizes: ['50ml Extrait'],
        description:
          'Resinous, hypnotic, and unyielding. The scent develops over 14 hours into an intimate skin-contact whisper.',
        curationNote: 'Selected by METAMORPHOO. Curated to standard.',
        pinLocation: { x: 62, y: 48 },
      },
    ],
  },
  {
    id: 'look-3',
    slug: 'the-heir',
    name: 'THE HEIR',
    subName: 'Look 03 — Daytime Provenance',
    occasion: 'Brunch on the Terrace, Long Transit, Sunday Architectural Walk',
    paletteDescription: 'Sand + Olive Drab with Warm Ivory Understones',
    paletteColors: ['#C9B89A', '#5A624E', '#F5EFE4', '#1A1611'],
    statementQuote: 'Elegance unhurried by time.',
    longThesis:
      'The most approachable register in the Wardrobe. It projects the nonchalance of inherited comfort: garments that have existed in cedar chests for generations, washed repeatedly until soft.',
    tier: 'EDIT',
    season: 'Saison Premier',
    oneRuleBroken:
      'Heavy desert linen popover paired with woven leather mule slides without socks.',
    heroImage:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      {
        url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
        caption: 'Full Silhouette — Golden afternoon along Mediterranean stone courtyard',
        type: 'full',
      },
      {
        url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=85',
        caption: 'Fabric Texture — Unbleached 320gsm artisanal flax linen',
        type: 'texture',
      },
      {
        url: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1200&q=85',
        caption: 'Accessory — Hand-polished Japanese acetate tortoiseshell frames',
        type: 'accessory',
      },
    ],
    items: [
      {
        id: 'heir-01',
        name: 'Desert Sand Heavy Linen Popover',
        category: 'Shirt',
        price: 290,
        currency: 'USD',
        composition: '100% Normandy Flax Linen (320gsm)',
        tier: 'EDIT',
        origin: 'Guimarães, Portugal',
        silhouette: 'Three-button popover placket, generous body volume, rounded cuffs',
        image:
          'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=85',
        sizes: ['S', 'M', 'L', 'XL'],
        description:
          'Pre-washed with volcanic stones to break the initial stiffness. Retains weight without clinging to skin.',
        curationNote: 'Selected by METAMORPHOO. Curated to standard.',
        pinLocation: { x: 50, y: 35 },
      },
      {
        id: 'heir-02',
        name: 'Olive Relaxed Tailored Slacks',
        category: 'Trousers',
        price: 360,
        currency: 'USD',
        composition: '75% Cotton Twill, 25% Belgian Linen (280gsm)',
        tier: 'EDIT',
        origin: 'Naples, Italy',
        silhouette: 'Single reverse pleat, elasticated back waistband with internal drawstring',
        image:
          'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=85',
        sizes: ['46 (30)', '48 (32)', '50 (34)', '52 (36)'],
        description:
          'Blends formal bespoke drape with casual comfort. Color is garment-dyed to achieve a dusty olive hue.',
        curationNote: 'Selected by METAMORPHOO. Curated to standard.',
        pinLocation: { x: 48, y: 65 },
      },
      {
        id: 'heir-03',
        name: 'Hand-Woven Leather Slip-ons',
        category: 'Shoes',
        price: 410,
        currency: 'USD',
        composition: 'Vegetable-Tanned Vacchetta Leather, Hand-Braided Weave',
        tier: 'EDIT',
        origin: 'Florence, Italy',
        silhouette: 'Slip-on mule silhouette with unlined leather comfort',
        image:
          'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=85',
        sizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44'],
        description:
          'Each pair takes 8 hours of hand-weaving. Provides air circulation while maintaining structured refinement.',
        curationNote: 'Selected by METAMORPHOO. Curated to standard.',
        pinLocation: { x: 52, y: 92 },
      },
      {
        id: 'heir-04',
        name: 'Vintage Panto Tortoiseshell Sunglasses',
        category: 'Eyewear',
        price: 310,
        currency: 'USD',
        composition: '8mm Cured Takiron Cellulose Acetate, Mineral Green Glass Lenses',
        tier: 'EDIT',
        origin: 'Fukui, Japan',
        silhouette: 'Keyhole bridge, 5-barrel custom riveted hinges',
        image:
          'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=85',
        sizes: ['One Size (47-22-145)'],
        description:
          'Custom green mineral glass lenses offer 100% UV protection and high clarity without polarization distortion.',
        curationNote: 'Selected by METAMORPHOO. Curated to standard.',
        pinLocation: { x: 50, y: 18 },
      },
      {
        id: 'heir-05',
        name: 'Neroli & Sun-Warmed Cedar Scent',
        category: 'Fragrance',
        price: 195,
        currency: 'USD',
        composition: 'Eau de Parfum (22% Concentration) — 50ml',
        tier: 'EDIT',
        origin: 'Seville / Grasse',
        silhouette: 'Orange Blossom, Bitter Petitgrain, Moroccan Cedarwood',
        image:
          'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=85',
        sizes: ['50ml EDP'],
        description:
          'Evokes afternoon sun beating down on ancient cedar beams and flowering citrus trees.',
        curationNote: 'Selected by METAMORPHOO. Curated to standard.',
        pinLocation: { x: 62, y: 44 },
      },
    ],
  },
  {
    id: 'look-4',
    slug: 'the-attache',
    name: 'THE ATTACHE',
    subName: 'Look 04 — Diplomatic Transit',
    occasion: 'International Delegation, Private Terminal, High-Stakes Treaty',
    paletteDescription: 'Bone + Midnight Navy with Polished Brass',
    paletteColors: ['#E8E0D5', '#0F1A2E', '#1A1611', '#C9B89A'],
    statementQuote: 'Authority carried with quiet grace.',
    longThesis:
      'Engineered for crossing borders without losing posture. The bone-white structured poplin provides instant clarity against the midnight navy trousers.',
    tier: 'EDIT',
    season: 'Saison Premier',
    oneRuleBroken:
      'A formal diplomatic silhouette accented with an unclasped solid brass artisan folio.',
    heroImage:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      {
        url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85',
        caption: 'Full Silhouette — Overcast light in modern consular pavilion',
        type: 'full',
      },
      {
        url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1200&q=85',
        caption: 'Fabric Texture — 140/2 two-ply Egyptian giza cotton weave',
        type: 'texture',
      },
      {
        url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85',
        caption: 'Accessory — Bridle leather diplomat folio with solid brass clasp',
        type: 'accessory',
      },
    ],
    items: [
      {
        id: 'att-01',
        name: 'Structured Bone Poplin Shirt',
        category: 'Shirt',
        price: 310,
        currency: 'USD',
        composition: '100% Giza 87 Egyptian Cotton (140/2 Compact Yarn)',
        tier: 'EDIT',
        origin: 'Milan, Italy',
        silhouette: 'Semi-spread semi-fused collar, clean French front',
        image:
          'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=85',
        sizes: ['S', 'M', 'L', 'XL'],
        description:
          'Crisp bone hue rather than stark optical white. Retains sharp collar roll without constriction.',
        curationNote: 'Selected by METAMORPHOO. Curated to standard.',
        pinLocation: { x: 50, y: 34 },
      },
      {
        id: 'att-02',
        name: 'Midnight Navy Relaxed Pleated Trousers',
        category: 'Trousers',
        price: 430,
        currency: 'USD',
        composition: '100% High-Twist Merino Wool Crepe (310gsm)',
        tier: 'EDIT',
        origin: 'Biella, Italy',
        silhouette: 'Double forward pleats, tapered ankle, side buckled tabs',
        image:
          'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=85',
        sizes: ['46 (30)', '48 (32)', '50 (34)', '52 (36)'],
        description:
          'A deep midnight navy that shifts into black in dim lighting. Naturally resistant to travel wrinkles.',
        curationNote: 'Selected by METAMORPHOO. Curated to standard.',
        pinLocation: { x: 48, y: 64 },
      },
      {
        id: 'att-03',
        name: 'Box-Calf Oxford Brogues',
        category: 'Shoes',
        price: 540,
        currency: 'USD',
        composition: 'French Box Calf, Oak-Bark Tanned Leather Soles',
        tier: 'EDIT',
        origin: 'Northamptonshire, England',
        silhouette: 'Closed lacing, subtle micro-perforated toe medallion',
        image:
          'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=85',
        sizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45'],
        description:
          'Hand-built on a legacy last that balances formal toe posture with arch support for extended walking.',
        curationNote: 'Selected by METAMORPHOO. Curated to standard.',
        pinLocation: { x: 52, y: 92 },
      },
      {
        id: 'att-04',
        name: 'Bridle Leather Diplomatic Folio',
        category: 'Accessory',
        price: 480,
        currency: 'USD',
        composition: 'English Sedgwick Bridle Leather, Solid Sand-Cast Brass Lock',
        tier: 'EDIT',
        origin: 'Walsall, UK',
        silhouette: 'Slim single-gusset document case with suede-lined interior',
        image:
          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=85',
        sizes: ['One Size (38 x 28 x 4 cm)'],
        description:
          'Waxed bridle leather that develops an amber patina with use. Holds a 14-inch laptop and treaty documents.',
        curationNote: 'Selected by METAMORPHOO. Curated to standard.',
        pinLocation: { x: 38, y: 55 },
      },
      {
        id: 'att-05',
        name: 'Dry Iris & Hinoki Wood Essence',
        category: 'Fragrance',
        price: 215,
        currency: 'USD',
        composition: 'Extrait de Parfum — 50ml Glass Flacon',
        tier: 'EDIT',
        origin: 'Kyoto / Grasse',
        silhouette: 'Florentine Orris Butter, Japanese Hinoki Cypress, Papyrus',
        image:
          'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=85',
        sizes: ['50ml Extrait'],
        description:
          'Powdery dry iris wrapped in the solemn architecture of sacred cypress wood.',
        curationNote: 'Selected by METAMORPHOO. Curated to standard.',
        pinLocation: { x: 62, y: 44 },
      },
    ],
  },
  {
    id: 'look-5',
    slug: 'the-meridian',
    name: 'THE MERIDIAN',
    subName: 'Look 05 — Port & Horizon',
    occasion: 'Yacht Deck, Seaside Villa Dinner, Outdoor Classical Concert',
    paletteDescription: 'Warm Ivory + Mediterranean Sand + Subdued Ochre',
    paletteColors: ['#F5EFE4', '#C9B89A', '#C4623A', '#3D352B'],
    statementQuote: 'Warm stone and open horizons.',
    longThesis:
      'Inspired by the maritime trade routes connecting West Africa with Southern Europe. The open-stitch crochet polo permits sea breezes to circulate continuously.',
    tier: 'EDIT',
    season: 'Saison Premier',
    oneRuleBroken:
      'Intricate crochet knit texture matched against raw malachite gemstone wristwear.',
    heroImage:
      'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      {
        url: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1200&q=85',
        caption: 'Full Silhouette — Sunlit harbor terrace with natural sea breeze',
        type: 'full',
      },
      {
        url: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=1200&q=85',
        caption: 'Fabric Texture — Open-weave waffle crochet in unbleached organic cotton',
        type: 'texture',
      },
      {
        url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
        caption: 'Accessory — Raw African malachite cuff with hand-chiseled silver finials',
        type: 'accessory',
      },
    ],
    items: [
      {
        id: 'mer-01',
        name: 'Ecru Open-Weave Crochet Polo',
        category: 'Knitwear',
        price: 320,
        currency: 'USD',
        composition: '100% Organic Pima Cotton Knit (Open Waffle Stitch)',
        tier: 'EDIT',
        origin: 'Lima, Peru / Finished in Lisbon',
        silhouette: 'Relaxed collarless neckline, ribbed hem, breathable open gauge',
        image:
          'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=800&q=85',
        sizes: ['S', 'M', 'L', 'XL'],
        description:
          'Hand-framed knit featuring geometric ventilation motifs inspired by traditional architecture.',
        curationNote: 'Selected by METAMORPHOO. Curated to standard.',
        pinLocation: { x: 50, y: 35 },
      },
      {
        id: 'mer-02',
        name: 'Ochre-Tinted Brushed Chinos',
        category: 'Trousers',
        price: 340,
        currency: 'USD',
        composition: '98% Cotton Drill, 2% Elastane (Peach-Skin Finish, 300gsm)',
        tier: 'EDIT',
        origin: 'Casablanca, Morocco',
        silhouette: 'Straight leg, mid-rise, subtle inward front pleat',
        image:
          'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=800&q=85',
        sizes: ['46 (30)', '48 (32)', '50 (34)', '52 (36)'],
        description:
          'Dyed with natural earth pigments to create a warm, sun-faded ochre sand tone that softens with each wear.',
        curationNote: 'Selected by METAMORPHOO. Curated to standard.',
        pinLocation: { x: 48, y: 65 },
      },
      {
        id: 'mer-03',
        name: 'Vegetable-Tanned Mule Slides',
        category: 'Shoes',
        price: 380,
        currency: 'USD',
        composition: 'Cuoio Naturale Leather, Hand-Formed Anatomical Footbed',
        tier: 'EDIT',
        origin: 'Mallorca, Spain',
        silhouette: 'Open-back slide with crossover leather wide band',
        image:
          'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=85',
        sizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44'],
        description:
          'Untreated leather will darken to a rich golden cognac through exposure to sunlight and natural skin oils.',
        curationNote: 'Selected by METAMORPHOO. Curated to standard.',
        pinLocation: { x: 52, y: 92 },
      },
      {
        id: 'mer-04',
        name: 'Raw Malachite Beaded Silver Cuff',
        category: 'Accessory',
        price: 240,
        currency: 'USD',
        composition: 'Natural Congo Malachite Spheres, 925 Sterling Silver Terminals',
        tier: 'EDIT',
        origin: 'Lagos, Nigeria',
        silhouette: 'Flexible wire cable cuff with emerald-veined malachite spheres',
        image:
          'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85',
        sizes: ['M (17-19cm)', 'L (19-21cm)'],
        description:
          'Vivid banded green malachite brings natural geological contrast to the neutral linen tones.',
        curationNote: 'Selected by METAMORPHOO. Curated to standard.',
        pinLocation: { x: 38, y: 52 },
      },
      {
        id: 'mer-05',
        name: 'Fig Leaf & Sea Salt Cologne',
        category: 'Fragrance',
        price: 185,
        currency: 'USD',
        composition: 'Eau de Cologne Fortified (18% Concentration) — 100ml',
        tier: 'EDIT',
        origin: 'Marseille, France',
        silhouette: 'Crushed Wild Fig Leaf, Marine Salt, Sunlit Driftwood',
        image:
          'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=85',
        sizes: ['100ml EDC'],
        description:
          'Crisp, green sap and salty spray that invigorates without overpowering intimate conversation.',
        curationNote: 'Selected by METAMORPHOO. Curated to standard.',
        pinLocation: { x: 62, y: 44 },
      },
    ],
  },
  {
    id: 'look-6',
    slug: 'the-consul',
    name: 'THE CONSUL',
    subName: 'Look 06 — Gala & Distinction',
    occasion: 'State Gala, Grand Opera Premiere, Private Honors Banquet',
    paletteDescription: 'Deep Midnight Navy + Bone with Gold Accents',
    paletteColors: ['#0F1A2E', '#F5EFE4', '#1A1611', '#C9B89A'],
    statementQuote: 'Distinction without declaration.',
    longThesis:
      'The highest register of evening formality. Unshackled from rigid Victorian stiffness, the double-breasted jacket uses an unlined shoulder and floating canvas to drape naturally.',
    tier: 'EDIT',
    season: 'Saison Premier',
    oneRuleBroken:
      'Full gala black-tie elegance worn with bone fluid trousers instead of conventional matching navy pants.',
    heroImage:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      {
        url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85',
        caption: 'Full Silhouette — Grand marble stairway under warm chandelier lighting',
        type: 'full',
      },
      {
        url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85',
        caption: 'Fabric Texture — Midnight barathea wool with silk grosgrain peak lapel',
        type: 'texture',
      },
      {
        url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85',
        caption: 'Accessory — Vintage guilloché rose gold dial timepiece',
        type: 'accessory',
      },
    ],
    items: [
      {
        id: 'con-01',
        name: 'Midnight Heavy Drape Double-Breasted Jacket',
        category: 'Jacket',
        price: 780,
        currency: 'USD',
        composition: '100% Escorial Wool with Silk Grosgrain Lapels (380gsm)',
        tier: 'EDIT',
        origin: 'Savile Row trained master tailor, Naples workshop',
        silhouette: '6x2 button stance, unpadded natural shoulder, high armhole',
        image:
          'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=85',
        sizes: ['46 (36R)', '48 (38R)', '50 (40R)', '52 (42R)', '54 (44R)'],
        description:
          'Cut from rare Escorial wool that provides natural crimp and elasticity. Moves with the body without buckling.',
        curationNote: 'Selected by METAMORPHOO. Curated to standard.',
        pinLocation: { x: 50, y: 35 },
      },
      {
        id: 'con-02',
        name: 'Bone White Fluid Pleated Trousers',
        category: 'Trousers',
        price: 450,
        currency: 'USD',
        composition: '70% Wool, 30% Silk Crepe (320gsm)',
        tier: 'EDIT',
        origin: 'Biella, Italy',
        silhouette: 'Twin deep reverse pleats, 25cm generous hem line',
        image:
          'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=800&q=85',
        sizes: ['46 (30)', '48 (32)', '50 (34)', '52 (36)'],
        description:
          'The deliberate rule-breaker: pairing bone fluid trousers with midnight black-tie creates unforgettable contrast.',
        curationNote: 'Selected by METAMORPHOO. Curated to standard.',
        pinLocation: { x: 48, y: 68 },
      },
      {
        id: 'con-03',
        name: 'Handmade Patent Leather Opera Pumps',
        category: 'Shoes',
        price: 580,
        currency: 'USD',
        composition: 'Mirrored Patent Calfskin, Grosgrain Flat Bow, Red Leather Lining',
        tier: 'EDIT',
        origin: 'Montegranaro, Italy',
        silhouette: 'Low-cut vamp with hand-stitched grosgrain evening ribbon',
        image:
          'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=85',
        sizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45'],
        description:
          'Classic black-tie footwear refined with a contemporary softened toe curve for effortless dignity.',
        curationNote: 'Selected by METAMORPHOO. Curated to standard.',
        pinLocation: { x: 52, y: 92 },
      },
      {
        id: 'con-04',
        name: 'Vintage Guilloché Gold Dress Watch',
        category: 'Watch',
        price: 890,
        currency: 'USD',
        composition: '18k Yellow Gold Plated 36mm Case, Hand-Turned Silver Guilloché Dial',
        tier: 'EDIT',
        origin: 'La Chaux-de-Fonds, Switzerland',
        silhouette: 'Ultra-thin manual mechanical winding movement with Breguet numerals',
        image:
          'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=85',
        sizes: ['One Size (36mm)'],
        description:
          'The 36mm proportion honors traditional gala codes. Guilloché dial radiates light under chandelier chandeliers.',
        curationNote: 'Selected by METAMORPHOO. Curated to standard.',
        pinLocation: { x: 38, y: 50 },
      },
      {
        id: 'con-05',
        name: 'Santal & Oud Imperial Absolu',
        category: 'Fragrance',
        price: 280,
        currency: 'USD',
        composition: 'Extrait de Parfum (35% Oil Concentration) — 50ml Solid Crystal Bottle',
        tier: 'EDIT',
        origin: 'Grasse, France',
        silhouette: 'Mysore Sandalwood, Aged Assam Agarwood, Taif Rose, Myrrh',
        image:
          'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=85',
        sizes: ['50ml Extrait'],
        description:
          'Rich, creamy aged sandalwood layered over aristocratic dark resins. Royal without being ostentatious.',
        curationNote: 'Selected by METAMORPHOO. Curated to standard.',
        pinLocation: { x: 62, y: 44 },
      },
    ],
  },
];

export const BRAND_STORY = {
  foundingStatement:
    'METAMORPHOO is not a store. It is a wardrobe — a curated world of complete decisions, presented cinematically. We do not ask the client to assemble outfits from disparate racks; we present the complete resolution of form, texture, and proportion. Each look is already made. You say yes or no to the whole picture.',
  philosophy: 'Your dressing is as important as the room.',
  philosophyExpanded:
    'In old port cities and sovereign salons from Lagos to Lisbon to Milan, presence is never earned through shouting logos or trend-chasing. It is felt in the weight of unbleached linen, the relaxed volume of a double-pleated trouser, and the deliberate rule broken with purpose.',
  houseStructure: [
    {
      tier: 'EDIT',
      title: 'Curated External Pieces',
      description:
        'Selected across global workshops and heritage mills. Filtered relentlessly against the METAMORPHOO standard for fabric honesty, silhouette discipline, and unbranded quiet prestige.',
      status: 'Live at Launch',
    },
    {
      tier: 'ORIGINALS',
      title: 'Manufactured by METAMORPHOO',
      description:
        'Bespoke garments manufactured in limited numbered editions. Marked solely with the hairline MΦ monogram in Bone tone. Crafted from proprietary textiles developed in Portugal and Italy.',
      status: 'Phase 2 Preview',
    },
    {
      tier: 'ATELIER',
      title: 'Private Haute Commission',
      description:
        'Individual sartorial commissions tailored directly for heads of state, diplomats, and cultural arbiters. One-of-one private fittings by invitation.',
      status: 'Private Inquiries Only',
    },
  ],
  founder: {
    name: 'Ani Chisom',
    title: 'Founder & Creative Director',
    bio:
      'Architect of the METAMORPHOO aesthetic. Bridging the sartorial heritage of West African ceremonial poise with Mediterranean architectural minimalism, Ani Chisom established METAMORPHOO to liberate clients from the fatigue of micro-consumption into the clarity of complete wardrobe decisions.',
  },
  editorialManifesto: {
    rule: 'Every look is a proper noun with "The" as a prefix, always. The word itself sounds inherited — like a title, a place, a figure. Never descriptive. Never functional.',
    criteria: [
      'Single word (two at maximum — never a phrase)',
      'Sounds like it already existed before the brand — inherited, not invented',
      'Implies a character or position, not a product category',
      'Feels equally at home in Lagos, Lisbon, and Milan',
    ],
    oneRuleBrokenPrinciple:
      'Every look observes old money conventions — and breaks exactly one. Whether proportion (tailored shirt + exaggerated baggy trouser), texture (silk tux with raw stone ring), or shoes slightly unexpected, this is where the rebellious edge lives.',
  },
};
