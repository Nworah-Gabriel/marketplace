// ─────────────────────────────────────────────────────────────
// hooks/useWallet.ts — Freighter wallet connection state
// ─────────────────────────────────────────────────────────────

"use client";

import { useState, useCallback, useEffect } from "react";
import {
  connectFreighter,
  getConnectedPublicKey,
  isFreighterInstalled,
} from "@/lib/freighter";

export interface WalletState {
  publicKey: string | null;
  networkPassphrase: string | null;
  isConnected: boolean;
  isInstalled: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export function useWallet(): WalletState {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [networkPassphrase, setNetworkPassphrase] = useState<string | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check install status + auto-reconnect on mount.
  useEffect(() => {
    const init = async () => {
      const installed = await isFreighterInstalled();
      setIsInstalled(installed);
      if (installed) {
        const key = await getConnectedPublicKey();
        if (key) setPublicKey(key);
      }
    };
    init();
  }, []);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const account = await connectFreighter();
      setPublicKey(account.publicKey);
      setNetworkPassphrase(account.networkPassphrase);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setPublicKey(null);
    setNetworkPassphrase(null);
  }, []);

  return {
    publicKey,
    networkPassphrase,
    isConnected: !!publicKey,
    isInstalled,
    isConnecting,
    error,
    connect,
    disconnect,
  };
}
