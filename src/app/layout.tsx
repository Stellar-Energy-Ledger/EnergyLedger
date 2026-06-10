import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EnergyLedger — P2P Renewable Energy Trading",
  description:
    "Trade tokenized renewable energy peer-to-peer on the Stellar blockchain. Solar panel owners sell surplus kWh directly to neighbors via Soroban smart contracts.",
  keywords: ["energy trading", "blockchain", "Stellar", "Soroban", "solar", "renewable", "DeFi"],
  openGraph: {
    title: "EnergyLedger",
    description: "P2P renewable energy trading on Stellar",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
