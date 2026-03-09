import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "./context/AppContext";
import Header from "./components/Header";
import { ErrorBoundary } from "./components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: "FreshCart - Farm Fresh Groceries Online",
    template: '%s | FreshCart',
  },
  description: "Shop fresh organic vegetables, fruits, and groceries online. FreshCart delivers farm-fresh products directly to your doorstep with best prices guaranteed.",
  keywords: ["groceries", "fresh vegetables", "fruits", "online shopping", "organic", "farm fresh", "delivery"],
  authors: [{ name: "FreshCart Team" }],
  creator: "FreshCart",
  publisher: "FreshCart",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'FreshCart',
    title: "FreshCart - Fresh Groceries Online",
    description: "Shop fresh organic vegetables, fruits, and groceries online with same-day delivery.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FreshCart - Fresh Groceries',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "FreshCart - Fresh Groceries Online",
    description: "Shop fresh organic vegetables, fruits, and groceries online with same-day delivery.",
    images: ['/twitter-image.png'],
    creator: '@freshcart',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#16a34a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <ErrorBoundary>
          <AppProvider>
            <Header />
            <main role="main" className="max-w-7xl mx-auto pb-20">
              {children}
            </main>
            <footer role="contentinfo" className="bg-gray-900 text-white py-8 mt-20">
              <div className="max-w-7xl mx-auto px-4">
                <p className="text-center text-gray-400">
                  © {new Date().getFullYear()} FreshCart. All rights reserved.
                </p>
              </div>
            </footer>
          </AppProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}