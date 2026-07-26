import type { Metadata, Viewport } from 'next';
import { bodyFont, headingFont } from '@/lib/fonts';
import { SITE } from '@/lib/constants';
import { cn } from '@/lib/utils';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Learn AI Through Play and Creativity`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: SITE.name,
    description: 'Learn AI through play, creativity, coding, and discovery.',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.name,
    description: 'Learn AI through play, creativity, coding, and discovery.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#7148f5',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(headingFont.variable, bodyFont.variable)}>
      <body className="font-body antialiased">
        {/*
          Reveal-on-scroll starts elements at opacity 0 and relies on an
          observer to bring them in. Without JavaScript that observer never
          runs, so the page would be blank — this hands every section straight
          to its final state instead.
        */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>

        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
