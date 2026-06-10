"use client";
import { useState, useCallback } from "react";
import { getXLMBalance, buildPayment, signWithFreighter, submitTx } from "@/lib/stellar";
import { mintEnergyCredits, buyListing, retireCredits, getTokenBalance } from "@/lib/soroban";
import { useWalletStore } from "@/store/walletStore";

// ── Generic async hook ─────────────────────────────────────────────────────
function useAsync<T, Args extends unknown[]>(fn: (...args: Args) => Promise<T>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async (...args: Args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn(...args);
      setData(result);
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [fn]);

  return { loading, error, data, execute };
}

// ── XLM balance ─────────────────────────────────────────────────────────────
export function useXLMBalance() {
  const { address } = useWalletStore();
  return useAsync(async () => {
    if (!address) throw new Error("Wallet not connected");
    return getXLMBalance(address);
  });
}

// ── kWh token balance ────────────────────────────────────────────────────────
export function useTokenBalance() {
  const { address } = useWalletStore();
  return useAsync(async () => {
    if (!address) throw new Error("Wallet not connected");
    return getTokenBalance(address, address);
  });
}

// ── Mint energy credits ──────────────────────────────────────────────────────
export function useMintCredits() {
  const { address } = useWalletStore();
  return useAsync(async (kWh: number) => {
    if (!address) throw new Error("Wallet not connected");
    const { tx } = await mintEnergyCredits(address, kWh);
    const signed = await signWithFreighter(tx.toXDR());
    return submitTx(signed);
  });
}

// ── Buy listing ──────────────────────────────────────────────────────────────
export function useBuyListing() {
  const { address } = useWalletStore();
  return useAsync(async (listingId: string, kWh: number) => {
    if (!address) throw new Error("Wallet not connected");
    const { tx } = await buyListing(address, listingId, kWh);
    const signed = await signWithFreighter(tx.toXDR());
    return submitTx(signed);
  });
}

// ── Retire credits ───────────────────────────────────────────────────────────
export function useRetireCredits() {
  const { address } = useWalletStore();
  return useAsync(async (kWh: number) => {
    if (!address) throw new Error("Wallet not connected");
    const { tx } = await retireCredits(address, kWh);
    const signed = await signWithFreighter(tx.toXDR());
    return submitTx(signed);
  });
}

// ── P2P settlement payment ───────────────────────────────────────────────────
export function useP2PPayment() {
  const { address } = useWalletStore();
  return useAsync(async (to: string, xlmAmount: string, memo?: string) => {
    if (!address) throw new Error("Wallet not connected");
    const xdr = await buildPayment(address, to, xlmAmount, memo);
    const signed = await signWithFreighter(xdr);
    return submitTx(signed);
  });
}
