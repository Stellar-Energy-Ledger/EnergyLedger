"use client";
import { motion } from "framer-motion";
import { Zap, TrendingUp, DollarSign, Activity, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import Layout from "@/components/Layout";
import GlassCard from "@/components/GlassCard";
import StatCard from "@/components/StatCard";
import { useWalletStore } from "@/store/walletStore";

const PRODUCTION_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  produced: Math.round(40 + Math.sin(i / 3) * 15 + Math.random() * 10),
  consumed: Math.round(20 + Math.random() * 10),
}));

const REVENUE_DATA = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  revenue: +(10 + Math.random() * 40).toFixed(1),
}));

const TX_HISTORY = [
  { id: "tx1", type: "sell", kWh: 80, xlm: 33.6, party: "GBUY…3F2A", time: "10m ago", hash: "aab3…f91c" },
  { id: "tx2", type: "buy", kWh: 30, xlm: 12.6, party: "GSEL…9D4B", time: "2h ago", hash: "cd12…aa78" },
  { id: "tx3", type: "sell", kWh: 150, xlm: 60.0, party: "GBUY…7E1C", time: "5h ago", hash: "ef56…bb23" },
  { id: "tx4", type: "buy", kWh: 50, xlm: 21.0, party: "GSEL…2A5D", time: "1d ago", hash: "gh90…cc45" },
];

export default function DashboardPage() {
  const { address, connect } = useWalletStore();

  if (!address) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
          <Zap size={48} className="text-[var(--color-neon)] mb-4" />
          <h2 className="text-2xl font-black mb-2">Connect Your Wallet</h2>
          <p className="text-slate-400 mb-6">Link Freighter to view your energy dashboard.</p>
          <button
            onClick={connect}
            className="px-6 py-3 rounded-xl bg-[var(--color-neon)] text-black font-bold hover:bg-[var(--color-neon-dim)] transition-colors"
          >
            Connect Freighter
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black mb-1">
            Your <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-slate-400 font-mono text-sm mb-8">{address}</p>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="XLM Balance" value="1,240" sub="≈ $248 USD" icon={DollarSign} />
          <StatCard label="kWh Credits" value="420" sub="Tradeable tokens" icon={Zap} color="electric" />
          <StatCard label="Total Revenue" value="89.4 XLM" sub="+12% this month" icon={TrendingUp} />
          <StatCard label="Active Listings" value="3" sub="In marketplace" icon={Activity} color="electric" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Production chart */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard>
              <p className="text-sm font-semibold text-slate-300 mb-4">Energy Production vs Consumption (30 days)</p>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={PRODUCTION_DATA}>
                  <defs>
                    <linearGradient id="prod" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff88" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="cons" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                  <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="produced" stroke="#00ff88" strokeWidth={2} fill="url(#prod)" name="Produced (kWh)" />
                  <Area type="monotone" dataKey="consumed" stroke="#00d4ff" strokeWidth={2} fill="url(#cons)" name="Consumed (kWh)" />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>

            {/* Revenue bar chart */}
            <GlassCard>
              <p className="text-sm font-semibold text-slate-300 mb-4">Monthly Revenue (XLM)</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={REVENUE_DATA}>
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                  <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="revenue" fill="url(#barGrad)" radius={[4, 4, 0, 0]} name="XLM" />
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00ff88" />
                      <stop offset="100%" stopColor="#00d4ff" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>

          {/* Right: transaction history */}
          <div>
            <GlassCard className="h-full">
              <p className="text-sm font-semibold text-slate-300 mb-4">Transaction History</p>
              <div className="space-y-3">
                {TX_HISTORY.map((tx) => (
                  <div key={tx.id} className="flex items-start gap-3 p-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]">
                    <div className={`mt-0.5 p-1.5 rounded-full ${tx.type === "sell" ? "bg-[rgba(0,255,136,0.15)]" : "bg-[rgba(0,212,255,0.15)]"}`}>
                      {tx.type === "sell"
                        ? <ArrowUpRight size={14} className="text-[var(--color-neon)]" />
                        : <ArrowDownLeft size={14} className="text-[var(--color-electric)]" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <span className="text-xs font-semibold text-white capitalize">{tx.type}</span>
                        <span className="text-xs text-slate-500">{tx.time}</span>
                      </div>
                      <p className="text-sm font-bold text-white">{tx.kWh} kWh · <span className="text-[var(--color-neon)]">{tx.xlm} XLM</span></p>
                      <p className="text-xs font-mono text-slate-500 truncate">{tx.hash}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </Layout>
  );
}
