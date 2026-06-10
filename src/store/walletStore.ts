import { create } from "zustand";

interface WalletState {
  address: string | null;
  balance: string;
  network: string;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    freighter?: any;
  }
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  balance: "0",
  network: "testnet",
  connecting: false,

  connect: async () => {
    set({ connecting: true });
    try {
      if (typeof window !== "undefined" && window.freighter) {
        const addr = await window.freighter.getPublicKey();
        set({ address: addr, connecting: false });
      } else {
        // Mock for dev without Freighter
        set({
          address: "GDEMO...STELLAR",
          connecting: false,
        });
      }
    } catch {
      set({ connecting: false });
    }
  },

  disconnect: () => set({ address: null, balance: "0" }),
}));

interface EnergyStore {
  listings: EnergyListing[];
  myCredits: number;
  addListing: (l: EnergyListing) => void;
  removeListing: (id: string) => void;
}

export interface EnergyListing {
  id: string;
  seller: string;
  kWh: number;
  pricePerKWh: number; // in XLM
  source: "solar" | "wind" | "hydro";
  location: string;
  expiresAt: number;
}

export const useEnergyStore = create<EnergyStore>((set) => ({
  listings: [],
  myCredits: 0,
  addListing: (l) => set((s) => ({ listings: [...s.listings, l] })),
  removeListing: (id) => set((s) => ({ listings: s.listings.filter((x) => x.id !== id) })),
}));
