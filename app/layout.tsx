import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
});


export const metadata: Metadata = {
  title: {
    default: 'Ishrealmanime - Watch Anime Freely',
    template: '%s | Ishrealmanime'
  },
  description: "Stream anime freely in HD quality. Watch your favorite anime with ninja-tier performance.",
  keywords: ["anime", "streaming", "ishrealmanime", "free anime", "hd streaming", "anime platform"],
  authors: [{ name: "Ishrealmanime Team" }],
  creator: 'Ishrealmanime',
  publisher: 'Ishrealmanime',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: "Ishrealmanime - Watch Anime Freely",
    description: "Stream anime freely in HD quality with ninja-tier performance.",
    url: 'http://localhost:3000',
    siteName: 'Ishrealmanime',
    type: "website",
    locale: "en_US",
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ishanime - Premium Anime Streaming',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ishanime - Premium Anime Streaming",
    description: "Stream premium anime in HD with subtitles. Legal streaming platform.",
    images: ['/images/twitter-image.jpg'],
    creator: '@ishanime',
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-[#0a0a0a] text-white`}
      >
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 pt-24">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
