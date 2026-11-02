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

const SITE_URL = "https://dump-pied.vercel.app";

export const metadata: Metadata = {
  title: "dump — Creative Direction & Athletic Production",
  description:
    "Creative direction and film production for movement, performance, and athleticism.",
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
    title: "dump — Creative Direction & Athletic Production",
    description:
      "Creative direction and film production for movement, performance, and athleticism.",
    url: SITE_URL,
    siteName: "dump",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/images/og/og-image.webp`,
        width: 1376,
        height: 722,
        alt: "Solo cyclist ascending mountain switchback at golden dawn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "dump — Creative Direction & Athletic Production",
    description:
      "Creative direction and film production for movement, performance, and athleticism.",
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
