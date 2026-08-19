import type { Metadata } from 'next';
import { Cormorant_Garamond, Montserrat } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || 'https://metamorphoo.com'),
  title: 'METAMORPHOO (MΦ) — A Curated World of Complete Decisions',
  description:
    'METAMORPHOO is a cinematic luxury digital maison dedicated to complete sartorial decisions. 100% natural fibre integrity. Zero synthetic tension. Lagos · Lisbon · Milan.',
  keywords: ['Metamorphoo', 'Luxury Sartorial', 'Natural Fibres', 'Ani Chisom', 'Maison', 'Bespoke Wardrobe'],
  authors: [{ name: 'Ani Chisom & Metamorphoo Bureau' }],
  openGraph: {
    title: 'METAMORPHOO (MΦ) — Complete Sartorial Decisions',
    description:
      'A curated world of sovereign ensembles crafted in 100% natural fibres. Directed by Ani Chisom.',
    url: 'https://metamorphoo.com',
    siteName: 'METAMORPHOO',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'METAMORPHOO Cinematic Wardrobe',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'METAMORPHOO — Complete Sartorial Decisions',
    description: 'A curated world of complete decisions. Directed by Ani Chisom.',
    images: ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${montserrat.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('metamorphoo_palette_theme');
                  var theme = (saved === 'bone' || saved === 'obsidian') ? saved : 'obsidian';
                  var root = document.documentElement;
                  root.setAttribute('data-theme', theme);
                  if (theme === 'bone') {
                    root.classList.add('theme-bone');
                    root.classList.remove('theme-obsidian');
                  } else {
                    root.classList.add('theme-obsidian');
                    root.classList.remove('theme-bone');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-[var(--bg-canvas)] text-[var(--text-primary)] antialiased selection:bg-[var(--color-rust)] selection:text-[#F5EFE4] transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
