// ─────────────────────────────────────────────────────────────
// app/layout.tsx — Root layout
// ─────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/context/WalletContext";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Afristore — African Art on Stellar",
  description:
    "Decentralized marketplace for African art. Buy and sell unique artworks using Stellar blockchain.",
  openGraph: {
    title: "Afristore",
    description: "Decentralized marketplace for African art on Stellar",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <WalletProvider>
          <Navbar />
          <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
          <footer className="mt-16 border-t border-gray-200 bg-white py-8 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Afristore · Built on{" "}
            <a
              href="https://stellar.org"
              className="text-brand-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stellar
            </a>
            {" "}·{" "}
            <a
              href="https://freighter.app"
              className="text-brand-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Freighter Wallet
            </a>
          </footer>
        </WalletProvider>
      </body>
    </html>
  );
}
