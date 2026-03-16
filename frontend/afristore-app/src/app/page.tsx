// ─────────────────────────────────────────────────────────────
// app/page.tsx — Marketplace browse page
// ─────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import { useMarketplace } from "@/hooks/useMarketplace";
import { ListingCard } from "@/components/ListingCard";
import { Listing } from "@/lib/contract";
import { Search, RefreshCw } from "lucide-react";

type FilterStatus = "All" | "Active" | "Sold";

export default function MarketplacePage() {
  const { listings, isLoading, error, refresh } = useMarketplace();
  const [filter, setFilter] = useState<FilterStatus>("Active");
  const [search, setSearch] = useState("");

  const filtered = listings.filter((l: Listing) => {
    const statusMatch = filter === "All" || l.status === filter;
    const searchMatch =
      search.trim() === "" ||
      l.metadata_cid.toLowerCase().includes(search.toLowerCase()) ||
      l.artist.toLowerCase().includes(search.toLowerCase());
    return statusMatch && searchMatch;
  });

  return (
    <div>
      {/* Hero */}
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-display font-bold text-gray-900">
          African Art Marketplace
        </h1>
        <p className="mt-3 text-lg text-gray-500 max-w-xl mx-auto">
          Discover and collect authentic African artwork. Every purchase is
          recorded on the Stellar blockchain.
        </p>
      </section>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative max-w-sm flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by artist or CID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-4 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          {(["All", "Active", "Sold"] as FilterStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === s
                  ? "bg-brand-500 text-white"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {s}
            </button>
          ))}

          <button
            onClick={refresh}
            disabled={isLoading}
            className="ml-2 rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            title="Refresh listings"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* State messages */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Grid */}
      {isLoading && listings.length === 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-2xl bg-gray-100"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-gray-400">
          <span className="text-5xl">🖼️</span>
          <p className="mt-4 text-lg font-medium">No listings found</p>
          <p className="text-sm mt-1">
            {filter === "Active"
              ? "Be the first to list artwork."
              : "Try changing the filter."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((listing: Listing) => (
            <ListingCard
              key={listing.listing_id}
              listing={listing}
              onPurchased={refresh}
            />
          ))}
        </div>
      )}
    </div>
  );
}
