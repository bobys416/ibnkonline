import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/app/providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://IBNK.online"),
  title: "IBNK | Save Money. Live Better. - IBNK.online",
  description:
    "Shop IBNK.online today for Every Day Low Prices. Join IBNK+ for unlimited free delivery from your store & free shipping with no order minimum. Ab har dukaan bank samaan.",
  icons: {
    icon: "/images/logo/ibnk-logo.png",
    shortcut: "/images/logo/ibnk-logo.png",
    apple: "/images/logo/ibnk-logo.png",
  },
  openGraph: {
    title: "IBNK | Save Money. Live Better.",
    description: "Ab har dukaan bank samaan - Shop online at IBNK.online",
    url: "https://IBNK.online",
    siteName: "IBNK.online",
    images: [
      {
        url: "/images/logo/ibnk-logo.png",
        width: 1200,
        height: 630,
        alt: "iBnK - Ab har dukaan bank samaan",
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
      <body className="min-h-full flex flex-col bg-[#f2f4f7] text-[#2e2f32]">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
