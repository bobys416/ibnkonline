import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/app/providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://ibnk.online"),
  title: "iBNK | Ab Har Dukaan, Bank Samaan — Online Marketplace",
  description:
    "Shop iBNK for everyday low prices across electronics, fashion, grocery, home essentials and more. Ab har dukaan, bank samaan.",
  icons: {
    icon: "/images/logo/ibnk-icon-square.png",
    shortcut: "/images/logo/ibnk-icon-square.png",
    apple: "/images/logo/ibnk-icon-square.png",
  },
  openGraph: {
    title: "iBNK | Ab Har Dukaan, Bank Samaan",
    description: "Shop online with confidence at iBNK — everyday low prices, fast delivery, and secure payments.",
    url: "https://ibnk.online",
    siteName: "iBNK",
    images: [
      {
        url: "/images/logo/ibnk-logo.png",
        width: 1200,
        height: 630,
        alt: "iBnK - Ab har dukaan, bank samaan",
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
