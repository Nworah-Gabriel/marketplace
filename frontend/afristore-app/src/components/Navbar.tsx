// ─────────────────────────────────────────────────────────────
// components/Navbar.tsx
// ─────────────────────────────────────────────────────────────

"use client";

import Link from "next/link";
import { useWalletContext } from "@/context/WalletContext";
import { Wallet, Store, LayoutDashboard } from "lucide-react";

export function Navbar() {
  const { publicKey, isConnected, isConnecting, connect, disconnect } =
    useWalletContext();

  const shortKey = publicKey
    ? `${publicKey.slice(0, 4)}…${publicKey.slice(-4)}`
    : null;

  return (
    <nav className="sticky top-0 z-50 border-b border-brand-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-display font-bold text-brand-600"
        >
          <span className="text-2xl">🎨</span>
          <span>Afristore</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link
            href="/"
            className="flex items-center gap-1.5 hover:text-brand-600 transition-colors"
          >
            <Store size={16} />
            Marketplace
          </Link>
          {isConnected && (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 hover:text-brand-600 transition-colors"
            >
              <LayoutDashboard size={16} />
              My Dashboard
            </Link>
          )}
        </div>

        {/* Wallet button */}
        <div className="flex items-center gap-3">
          {isConnected ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:block rounded-full bg-brand-100 px-3 py-1 text-xs font-mono text-brand-700">
                {shortKey}
              </span>
              <button
                onClick={disconnect}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connect}
              disabled={isConnecting}
              className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60 transition-colors"
            >
              <Wallet size={16} />
              {isConnecting ? "Connecting…" : "Connect Wallet"}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
