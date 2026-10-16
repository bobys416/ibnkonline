import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/app/providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://ibnk.online"),
  title: "iBNK | Discover More. Shop Better. — Online Marketplace",
  description:
    "Shop iBNK for everyday low prices across electronics, fashion, grocery, home essentials and more. Discover More. Shop Better.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/logo/ibnk-icon-square.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/favicon.ico",
    apple: "/images/logo/ibnk-icon-square.png",
  },
  openGraph: {
    title: "iBNK | Discover More. Shop Better.",
    description: "Shop online with confidence at iBNK — everyday low prices, fast delivery, and secure payments.",
    url: "https://ibnk.online",
    siteName: "iBNK",
    images: [
      {
        url: "/images/logo/ibnk-logo.png",
        width: 1200,
        height: 630,
        alt: "iBnK - Discover More. Shop Better.",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#FAFAF7] text-[#172033] antialiased">
        <Providers>
          <Suspense fallback={<div className="h-16 md:h-28" />}>
            <Header />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
