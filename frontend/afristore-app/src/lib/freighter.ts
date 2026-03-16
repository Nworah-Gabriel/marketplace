// ─────────────────────────────────────────────────────────────
// lib/freighter.ts — Freighter browser wallet helpers
// ─────────────────────────────────────────────────────────────

import {
  getPublicKey,
  isConnected,
  signTransaction,
  setAllowed,
  getNetworkDetails,
} from "@stellar/freighter-api";

export interface FreighterAccount {
  publicKey: string;
  networkPassphrase: string;
}

// ── Detect wallet ─────────────────────────────────────────────

/**
 * Returns true if the Freighter extension is installed in this browser.
 */
export async function isFreighterInstalled(): Promise<boolean> {
  try {
    const connected = await isConnected();
    return connected.isConnected;
  } catch {
    return false;
  }
}

// ── Connect wallet ────────────────────────────────────────────

/**
 * Requests access to Freighter and returns the public key + network.
 * Opens the Freighter popup if not yet allowed.
 */
export async function connectFreighter(): Promise<FreighterAccount> {
  const allowed = await setAllowed();
  if (!allowed.isAllowed) {
    throw new Error("Freighter access was denied by the user.");
  }

  const keyResult = await getPublicKey();
  if (keyResult.error) {
    throw new Error(`Freighter key error: ${keyResult.error}`);
  }

  const networkResult = await getNetworkDetails();
  if (networkResult.error) {
    throw new Error(`Freighter network error: ${networkResult.error}`);
  }

  return {
    publicKey: keyResult.publicKey,
    networkPassphrase: networkResult.networkPassphrase,
  };
}

// ── Sign a transaction XDR ────────────────────────────────────

/**
 * Asks Freighter to sign a transaction XDR string.
 * Returns the signed XDR string ready for submission.
 */
export async function signWithFreighter(
  txXdr: string,
  networkPassphrase: string
): Promise<string> {
  const result = await signTransaction(txXdr, { networkPassphrase });
  if (result.error) {
    throw new Error(`Freighter sign error: ${result.error}`);
  }
  return result.signedTxXdr;
}

// ── Get connected public key ──────────────────────────────────

/**
 * Returns the currently connected public key, or null if not connected.
 */
export async function getConnectedPublicKey(): Promise<string | null> {
  try {
    const connected = await isConnected();
    if (!connected.isConnected) return null;
    const keyResult = await getPublicKey();
    return keyResult.error ? null : keyResult.publicKey;
  } catch {
    return null;
  }
}
