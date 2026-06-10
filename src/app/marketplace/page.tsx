"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Wind, Droplets, ShoppingCart, TrendingUp, Clock, Filter } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import Layout from "@/components/Layout";
import GlassCard from "@/components/GlassCard";

const MOCK_LISTINGS = [
  { id: "1", seller: "GBSOL…1A2B", kWh: 120, pricePerKWh: 0.42, source: "solar" as const, location: "Nairobi, KE", expires: "2h 14m" },
  { id: "2", seller: "GWND…9X7Z", kWh: 80, pricePerKWh: 0.38, source: "wind" as const, location: "Cape Town, ZA", expires: "5h 50m" },
  { id: "3", seller: "GHYD…3Q1W", kWh: 200, pricePerKWh: 0.35, source: "hydro" as const, location: "Lagos, NG", expires: "1d 2h" },
  { id: "4", seller: "GBSOL…5C6D", kWh: 55, pricePerKWh: 0.45, source: "solar" as const, location: "Manila, PH", expires: "3h 22m" },
  { id: "5", seller: "GWND…8K2L", kWh: 310, pricePerKWh: 0.36, source: "wind" as const, location: "Accra, GH", expires: "6h 00m" },
  { id: "6", seller: "GBSOL…7E8F", kWh: 90, pricePerKWh: 0.44, source: "solar" as const, location: "Jakarta, ID", expires: "4h 10m" },
];

const PRICE_DATA = Array.from({ length: 24 }, (_, i) => ({
  h: `${i}:00`,
  price: +(0.35 + Math.sin(i / 4) * 0.06 + Math.random() * 0.02).toFixed(3),
}));

const TRADES = [
  { id: "tx1", type: "buy", kWh: 50, price: 0.41, time: "2m ago" },
  { id: "tx2", type: "sell", kWh: 120, price: 0.40, time: "5m ago" },
  { id: "tx3", type: "buy", kWh: 30, price: 0.42, time: "12m ago" },
  { id: "tx4", type: "sell", kWh: 200, price: 0.38, time: "18m ago" },
];

const SOURCE_ICONS = { solar: Sun, wind: Wind, hydro: Droplets };
const SOURCE_COLORS = { solar: "#fbbf24", wind: "#60a5fa", hydro: "#34d399" };

export default function MarketplacePage() {
  const [filter, setFilter] = useState<"all" | "solar" | "wind" | "hydro">("all");
  const [buyId, setBuyId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");

  const filtered = filter === "all" ? MOCK_LISTINGS : MOCK_LISTINGS.filter((l) => l.source === filter);

  function handleBuy(id: string) {
    alert(`Buy order submitted for listing ${id} (${amount} kWh) — mock tx`);
    setBuyId(null);
    setAmount("");
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black mb-1"
        >
          Energy <span className="gradient-text">Marketplace</span>
        </motion.h1>
        <p className="text-slate-400 mb-8">Live listings — buy kWh tokens settled via Soroban escrow</p>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column: listings */}
          <div className="lg:col-span-2 space-y-5">
            {/* Filter bar */}
            <div className="flex gap-2 flex-wrap">
              {(["all", "solar", "wind", "hydro"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                    filter === f
                      ? "bg-[var(--color-neon)] text-black"
                      : "glass border border-[rgba(0,255,136,0.2)] text-slate-400 hover:text-white"
                  }`}
                >
                  {f === "all" && <Filter size={12} className="inline mr-1.5" />}
                  {f}
                </button>
              ))}
            </div>

            {/* Listings grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {filtered.map((l, i) => {
                const Icon = SOURCE_ICONS[l.source];
                const color = SOURCE_COLORS[l.source];
                return (
                  <motion.div
                    key={l.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <GlassCard hover className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Icon size={18} style={{ color }} />
                          <span className="text-xs font-mono text-slate-400">{l.seller}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock size={11} /> {l.expires}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <p className="text-2xl font-black text-white">{l.kWh} <span className="text-sm font-normal text-slate-400">kWh</span></p>
                          <p className="text-xs text-slate-500">{l.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-[var(--color-neon)]">{l.pricePerKWh} XLM</p>
                          <p className="text-xs text-slate-500">per kWh</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setBuyId(l.id)}
                        className="w-full py-2 rounded-lg bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.25)] text-[var(--color-neon)] text-sm font-semibold hover:bg-[rgba(0,255,136,0.18)] transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={14} /> Buy Now
                      </button>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right column: chart + trades */}
          <div className="space-y-5">
            {/* Price chart */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-[var(--color-electric)]" />
                <span className="text-sm font-semibold text-slate-300">kWh Price (24h)</span>
              </div>
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={PRICE_DATA}>
                  <defs>
                    <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="h" hide />
                  <YAxis domain={["auto", "auto"]} hide />
                  <Tooltip
                    contentStyle={{ background: "#0a1628", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 8, fontSize: 12 }}
                    formatter={(v) => [`${v} XLM`, "Price"]}
                  />
                  <Area type="monotone" dataKey="price" stroke="#00ff88" strokeWidth={2} fill="url(#pg)" />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>

            {/* Recent trades */}
            <GlassCard>
              <p className="text-sm font-semibold text-slate-300 mb-3">Recent Trades</p>
              <div className="space-y-2">
                {TRADES.map((t) => (
                  <div key={t.id} className="flex justify-between items-center text-xs">
                    <span className={t.type === "buy" ? "text-[var(--color-neon)]" : "text-[var(--color-electric)]"}>
                      {t.type.toUpperCase()}
                    </span>
                    <span className="text-white font-mono">{t.kWh} kWh</span>
                    <span className="text-slate-400">{t.price} XLM</span>
                    <span className="text-slate-500">{t.time}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Buy modal */}
      {buyId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <GlassCard neon className="w-full max-w-sm">
            <h3 className="font-bold text-white mb-4">Purchase Energy Credits</h3>
            <p className="text-sm text-slate-400 mb-4">
              Listing #{buyId} · Escrow via Soroban contract
            </p>
            <label className="block text-xs text-slate-400 mb-1">Amount (kWh)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full glass border border-[rgba(0,255,136,0.3)] rounded-lg px-3 py-2 text-white bg-transparent outline-none mb-4 focus:border-[var(--color-neon)]"
              placeholder="e.g. 50"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setBuyId(null)}
                className="flex-1 py-2 rounded-lg glass border border-[rgba(255,255,255,0.1)] text-slate-400 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleBuy(buyId)}
                disabled={!amount}
                className="flex-1 py-2 rounded-lg bg-[var(--color-neon)] text-black font-bold text-sm disabled:opacity-40"
              >
                Confirm Buy
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </Layout>
  );
}
