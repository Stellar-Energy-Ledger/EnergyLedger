"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Zap, Menu, X } from "lucide-react";
import { clsx } from "clsx";
import { useWalletStore } from "@/store/walletStore";

const NAV = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/producer", label: "Producer" },
  { href: "/explorer", label: "Explorer" },
  { href: "/governance", label: "Governance" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { address, connect, disconnect } = useWalletStore();

  const shortAddr = address ? `${address.slice(0, 4)}…${address.slice(-4)}` : null;

  return (
    <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-[rgba(0,255,136,0.1)]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Zap className="text-[var(--color-neon)]" size={22} />
          <span className="gradient-text">EnergyLedger</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === href
                  ? "text-[var(--color-neon)] bg-[rgba(0,255,136,0.08)]"
                  : "text-slate-400 hover:text-white"
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Wallet button */}
        <div className="hidden md:flex items-center gap-3">
          {address ? (
            <button
              onClick={disconnect}
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-[rgba(0,255,136,0.3)] text-[var(--color-neon)] text-sm font-mono hover:border-[rgba(0,255,136,0.6)] transition-colors"
            >
              <span className="size-2 rounded-full bg-[var(--color-neon)] animate-pulse" />
              {shortAddr}
            </button>
          ) : (
            <button
              onClick={connect}
              className="px-4 py-2 rounded-lg bg-[var(--color-neon)] text-black text-sm font-bold hover:bg-[var(--color-neon-dim)] transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass border-t border-[rgba(0,255,136,0.1)] px-4 py-4 flex flex-col gap-2">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={clsx(
                "px-4 py-2 rounded-lg text-sm font-medium",
                pathname === href ? "text-[var(--color-neon)]" : "text-slate-400"
              )}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={address ? disconnect : connect}
            className="mt-2 px-4 py-2 rounded-lg bg-[var(--color-neon)] text-black text-sm font-bold"
          >
            {address ? shortAddr : "Connect Wallet"}
          </button>
        </div>
      )}
    </nav>
  );
}
