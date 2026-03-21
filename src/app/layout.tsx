import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from 'sonner';
import { LayoutResizer } from "@/components/LayoutResizer"; // Importe o novo componente

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sanches Móveis",
  description: "Loja de Móveis e Decoração",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-gray-50`}>
        <CartProvider>
          {/* HEADER PÚBLICO: Só aparece na loja */}
          <LayoutResizer type="public">
            <Header />
          </LayoutResizer>

          <main className="flex-1">
            {children}
          </main>

          {/* FOOTER PÚBLICO: Só aparece na loja */}
          <LayoutResizer type="public">
            <Footer />
          </LayoutResizer>

          <Toaster position="top-right" richColors />
        </CartProvider>
      </body>
    </html>
  );
}