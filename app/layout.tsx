import type { Metadata } from 'next';
import { Outfit, Libre_Baskerville } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const serif = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Equip2Lead Coaching',
  description:
    'Personalised diagnostic coaching across Leadership, Ministry, Marriage, Entrepreneurship, and Personal Development.',
  keywords: [
    'coaching',
    'leadership',
    'diagnostic coaching',
    'AI coach',
    'personal development',
    'ministry',
    'marriage',
  ],
  openGraph: {
    title: 'Equip2Lead Coaching',
    description: 'Personalised diagnostic coaching. 12-week plans, 24/7 AI coach.',
    url: 'https://app.equip2lead.coach',
    type: 'website',
    images: [{ url: 'https://equip2lead.coach/og-image.png', width: 1200, height: 630 }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${outfit.variable} ${serif.variable}`}>
      <body className="min-h-screen bg-bg antialiased font-sans">{children}</body>
    </html>
  );
}
