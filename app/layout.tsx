import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const heading = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const accent = Playfair_Display({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["italic", "normal"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.blendnsizzle.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Blend N Sizzle | Coffee, Protein Shakes & Healthy Eats in Belleville",
    template: "%s | Blend N Sizzle",
  },
  description:
    "Made for cravings and built for goals. Discover premium coffee, protein shakes, lower-sugar drinks and flavorful healthy food at Blend N Sizzle in Belleville, Ontario.",
  openGraph: {
    title: "Blend N Sizzle | Coffee, Protein Shakes & Healthy Eats in Belleville",
    description:
      "Made for cravings and built for goals. Premium coffee, protein shakes and lower-sugar options opening soon in Belleville, Ontario.",
    url: siteUrl,
    siteName: "Blend N Sizzle",
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blend N Sizzle | Coffee, Protein Shakes & Healthy Eats",
    description: "Made for Cravings. Built for Goals. Opening soon in Belleville, Ontario.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${heading.variable} ${accent.variable} ${body.variable} bg-ivory text-charcoal antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
