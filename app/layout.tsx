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
  title: 'METAMORPHOO — The Wardrobe',
  description:
    'The METAMORPHOO website is not a store. It is a wardrobe — a curated world of complete decisions, presented cinematically.',
  openGraph: {
    title: 'METAMORPHOO — The Wardrobe',
    description: 'A curated world of complete decisions, presented cinematically.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${montserrat.variable} scroll-smooth`}>
      <body className="bg-[#1A1611] text-[#E8E0D5] antialiased selection:bg-[#C4623A] selection:text-[#F5EFE4]">
        {children}
      </body>
    </html>
  );
}
