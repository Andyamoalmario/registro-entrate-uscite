import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Work_Sans } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import MobileHeader from "@/components/MobileHeader";
import ThemeApplier from "@/components/ThemeApplier";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const workSans = Work_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Saldo | Entrate, uscite e investimenti",
  description: "Il tuo registro personale di entrate, uscite e investimenti",
};

export const viewport: Viewport = {
  themeColor: "#355A70",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${cormorant.variable} ${workSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex">
        <ThemeApplier />
        <Sidebar />
        <div className="flex-1 min-h-screen pb-16 md:pb-0">
          <MobileHeader />
          {children}
        </div>
        <MobileNav />
      </body>
    </html>
  );
}
