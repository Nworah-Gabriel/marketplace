// ------------------------------------------------------------
// types.rs — Listing, ListingStatus, and error definitions
// ------------------------------------------------------------

use soroban_sdk::{contracttype, symbol_short, Address, Bytes, Symbol};

/// Possible states for a marketplace listing.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ListingStatus {
    Active,
    Sold,
    Cancelled,
}

/// A single marketplace listing stored on-chain.
#[contracttype]
#[derive(Clone, Debug)]
pub struct Listing {
    /// Auto-incremented on-chain ID
    pub listing_id: u64,
    /// Stellar address of the artist / seller
    pub artist: Address,
    /// IPFS CID pointing to the artwork metadata JSON
    pub metadata_cid: Bytes,
    /// Price in stroops (1 XLM = 10_000_000 stroops)
    pub price: i128,
    /// Currency symbol — "XLM" for MVP
    pub currency: Symbol,
    /// Current listing status
    pub status: ListingStatus,
    /// Buyer address — populated after purchase
    pub owner: Option<Address>,
    /// Ledger sequence at which the listing was created
    pub created_at: u32,
}

/// Contract-level errors returned as u32 status codes.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MarketplaceError {
    /// Listing does not exist
    ListingNotFound = 1,
    /// Caller is not the artist / owner of the listing
    Unauthorized = 2,
    /// Listing is not in Active state
    ListingNotActive = 3,
    /// Artist cannot buy their own listing
    CannotBuyOwnListing = 4,
    /// Price / amount mismatch
    InvalidAmount = 5,
    /// CID string is empty
    InvalidCid = 6,
    /// Price must be > 0
    InvalidPrice = 7,
}

// Convenience symbol constants — compile-time validated 10-byte symbols.
pub const CURRENCY_XLM: Symbol = symbol_short!("XLM");
