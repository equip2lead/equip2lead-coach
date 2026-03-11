import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Equip2Lead — Personalised Coaching by Dr. Denis Ekobena',
  description: 'AI-powered coaching across 5 Pillars and 21 dimensions. Leadership, Ministry, Marriage, Business, and Personal Development.',
  keywords: ['coaching', 'leadership', 'AI coach', 'Dr. Ekobena', 'personal development'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg antialiased">
        {children}
      </body>
    </html>
  );
}
