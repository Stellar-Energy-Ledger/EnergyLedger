"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ExternalLink, Zap, CheckCircle, Clock } from "lucide-react";
import Layout from "@/components/Layout";
import GlassCard from "@/components/GlassCard";

const MOCK_TRADES = Array.from({ length: 20 }, (_, i) => ({
  hash: `${Math.random().toString(36).slice(2, 6)}…${Math.random().toString(36).slice(2, 6)}`,
  type: (["mint", "buy", "sell", "retire"] as const)[i % 4],
  kWh: Math.round(20 + Math.random() * 200),
  xlm: +(10 + Math.random() * 80).toFixed(2),
  from: `G${Math.random().toString(36).slice(2, 6).toUpperCase()}…`,
  to: `G${Math.random().toString(36).slice(2, 6).toUpperCase()}…`,
  ledger: 48932000 + i * 7,
  time: `${i * 4 + 1}m ago`,
  status: "confirmed",
}));

const TYPE_COLOR = {
  mint: "text-[var(--color-neon)]",
  buy: "text-[var(--color-electric)]",
  sell: "text-purple-400",
  retire: "text-orange-400",
};

export default function ExplorerPage() {
  const [query, setQuery] = useState("");
  const filtered = query
    ? MOCK_TRADES.filter((t) => t.hash.includes(query) || t.from.includes(query) || t.to.includes(query))
    : MOCK_TRADES;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black mb-1">
            Chain <span className="gradient-text">Explorer</span>
          </h1>
          <p className="text-slate-400 mb-8">Verify on-chain energy trades and smart contract activity</p>
        </motion.div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full glass border border-[rgba(0,255,136,0.2)] rounded-xl pl-10 pr-4 py-3 text-white bg-transparent outline-none focus:border-[var(--color-neon)] placeholder:text-slate-500"
            placeholder="Search by tx hash or address…"
          />
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Trades", value: "48,921" },
            { label: "kWh Tokenized", value: "2.4M" },
            { label: "Active Contracts", value: "3" },
            { label: "Ledger", value: "#48,932,020" },
          ].map((s) => (
            <GlassCard key={s.label} className="text-center py-3">
              <p className="text-lg font-black text-white">{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </GlassCard>
          ))}
        </div>

        {/* Trades table */}
        <GlassCard className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)] text-xs text-slate-400">
                <th className="pb-3 text-left">Tx Hash</th>
                <th className="pb-3 text-left">Type</th>
                <th className="pb-3 text-right">kWh</th>
                <th className="pb-3 text-right">XLM</th>
                <th className="pb-3 text-left hidden md:table-cell">From</th>
                <th className="pb-3 text-left hidden md:table-cell">To</th>
                <th className="pb-3 text-right hidden md:table-cell">Ledger</th>
                <th className="pb-3 text-right">Time</th>
                <th className="pb-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <motion.tr
                  key={t.hash + i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(0,255,136,0.03)] transition-colors"
                >
                  <td className="py-2.5 font-mono text-[var(--color-electric)] flex items-center gap-1">
                    {t.hash}
                    <ExternalLink size={11} className="text-slate-500" />
                  </td>
                  <td className={`capitalize font-semibold ${TYPE_COLOR[t.type]}`}>{t.type}</td>
                  <td className="text-right text-white">{t.kWh}</td>
                  <td className="text-right text-[var(--color-neon)]">{t.xlm}</td>
                  <td className="hidden md:table-cell font-mono text-slate-400 text-xs">{t.from}</td>
                  <td className="hidden md:table-cell font-mono text-slate-400 text-xs">{t.to}</td>
                  <td className="hidden md:table-cell text-right text-slate-500 font-mono text-xs">{t.ledger}</td>
                  <td className="text-right text-slate-500 text-xs">{t.time}</td>
                  <td className="text-center">
                    <span className="inline-flex items-center gap-1 text-[var(--color-neon)] text-xs">
                      <CheckCircle size={11} /> OK
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-slate-500">
              <Clock size={32} className="mx-auto mb-2" />
              No results found
            </div>
          )}
        </GlassCard>

        {/* Contract addresses */}
        <div className="mt-8">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Zap size={16} className="text-[var(--color-neon)]" /> Smart Contracts
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: "Energy Token", addr: process.env.NEXT_PUBLIC_ENERGY_TOKEN_CONTRACT || "Not configured" },
              { name: "Marketplace", addr: process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT || "Not configured" },
              { name: "Escrow", addr: process.env.NEXT_PUBLIC_ESCROW_CONTRACT || "Not configured" },
            ].map((c) => (
              <GlassCard key={c.name} hover className="py-3">
                <p className="text-xs text-slate-400 mb-1">{c.name}</p>
                <p className="font-mono text-xs text-[var(--color-electric)] truncate">{c.addr}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
