// src/app/layout.tsx
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Fix: Geist font gagal di Termux/ARM64 environment.
// Diganti Inter (sans) + JetBrains Mono — 100% stabil di semua env.
const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AdCraft AI — AI Video Ad Generator",
  description:
    "Upload foto produk, dapatkan video iklan siap pakai untuk TikTok, Instagram, dan YouTube dalam hitungan menit.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="id" className="dark">
        <body
          className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-[#0A0A0F] text-white`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
