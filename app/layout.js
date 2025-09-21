import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
} from "@clerk/nextjs";
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Launchapp - Convert Websites to Mobile Apps",
  description: "Transform any website into a professional mobile app in minutes. No coding required.",
  keywords: "mobile app builder, website to app, android app generator, web to mobile, no code app builder",
  authors: [{ name: "Launchapp Team" }],
  creator: "Launchapp",
  publisher: "Launchapp",
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://web2app-ten.vercel.app/',
    title: 'Launchapp - Transform Websites into Mobile Apps',
    description: 'Convert any website into a professional mobile app in minutes. No coding required.',
    siteName: 'Launchapp',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Launchapp - Website to Mobile App Converter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Launchapp - Transform Websites into Mobile Apps',
    description: 'Convert any website into a professional mobile app in minutes. No coding required.',
    images: ['/twitter-image.jpg'],
    creator: '@launchapp',
  },
  verification: {
    google: 'your-google-site-verification-code',
  },
  alternates: {
    canonical: 'https://web2app-ten.vercel.app/',
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

          {/* AdSense Script - Required for ad serving */}
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3648081589447801"
            crossOrigin="anonymous"
          ></script>

          {/* SEO Meta Tags */}
          <meta name="keywords" content="mobile app builder, website to app, android app generator, web to mobile, no code app builder, app creator, mobile app development" />
          <meta name="author" content="Launchapp Team" />
          <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
          <meta name="googlebot" content="index, follow" />
          <meta name="bingbot" content="index, follow" />

          {/* Canonical URL */}
          <link rel="canonical" href="https://web2app-ten.vercel.app/" />

          {/* Structured Data for SEO */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "Launchapp",
                "description": "Transform any website into a professional mobile app in minutes. No coding required.",
                "url": "https://web2app-ten.vercel.app/",
                "applicationCategory": "DeveloperApplication",
                "operatingSystem": "Android",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "creator": {
                  "@type": "Organization",
                  "name": "Launchapp Team"
                }
              })
            }}
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
