import type { Metadata, Viewport } from "next";
import { Jost, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-futura",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-univers",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

const SITE_URL = "https://identity-pied.vercel.app";

export const metadata: Metadata = {
  title: "identity — Brand & Website Studio for Startups",
  description:
    "A small studio for early-stage startups: brand strategy, visual identity, web design and development, from first workshop to launch day.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "identity — Brand & Website Studio for Startups",
    description:
      "A small studio for early-stage startups: brand strategy, visual identity, web design and development, from first workshop to launch day.",
    url: SITE_URL,
    siteName: "identity",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/images/og/og-image.webp`,
        width: 1376,
        height: 722,
        alt: "A designer's desk with a brand board, color swatches, and a laptop showing a website layout",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "identity — Brand & Website Studio for Startups",
    description:
      "A small studio for early-stage startups: brand strategy, visual identity, web design and development, from first workshop to launch day.",
    images: [`${SITE_URL}/images/og/og-image.webp`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jost.variable} ${barlowCondensed.variable} bg-black text-white`}
    >
      <body className="bg-black text-white min-h-screen selection:bg-white selection:text-black overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
