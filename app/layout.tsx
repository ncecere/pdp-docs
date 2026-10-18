import type { Metadata, Viewport } from 'next';
import { Provider } from '@/components/provider';
import { siteUrl } from '@/lib/site';
import './global.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s · Pi Durable Platform docs',
    default: 'Pi Durable Platform docs',
  },
  description:
    'Documentation for Pi Durable Platform, the self-hosted console and API where teams deploy, test and manage durable agents built with Pi: using agents, running a team, administering the platform, operating it and building apps on its API.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  // Open Graph card (public/og.png: drawn from the placeholder mark by
  // `npm run logo -- --placeholder`, or the logo's og-card.png once it exists).
  // Titles and descriptions come from each page's own <title> and description.
  openGraph: {
    type: 'website',
    siteName: 'Pi Durable Platform docs',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Pi Durable Platform documentation',
      },
    ],
  },
  twitter: { card: 'summary_large_image', images: ['/og.png'] },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f8fa' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0d12' },
  ],
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
