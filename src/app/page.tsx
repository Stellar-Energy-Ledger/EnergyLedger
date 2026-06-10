"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Shield, Globe, TrendingUp, ArrowRight, Sun, Wind, Droplets, Users } from "lucide-react";
import Layout from "@/components/Layout";
import GlassCard from "@/components/GlassCard";

const STATS = [
  { label: "kWh Traded", value: "2.4M+", icon: Zap },
  { label: "Active Traders", value: "12,800", icon: Users },
  { label: "CO₂ Offset (kg)", value: "890K", icon: Globe },
  { label: "Avg Trade Time", value: "4.2s", icon: TrendingUp },
];

const FEATURES = [
  {
    icon: Sun,
    title: "Tokenize Energy",
    desc: "Convert surplus solar & wind production into on-chain kWh tokens via Soroban smart contracts.",
  },
  {
    icon: Shield,
    title: "Escrow Settlement",
    desc: "Automated escrow ensures buyers receive energy credits before XLM is released to sellers.",
  },
  {
    icon: Globe,
    title: "Stellar Speed",
    desc: "Trades settle in ~5 seconds at fractions of a cent — designed for off-grid communities.",
  },
  {
    icon: TrendingUp,
    title: "Real-time Analytics",
    desc: "Track energy production, consumption, revenue, and carbon impact in your live dashboard.",
  },
];

const SOURCES = [
  { icon: Sun, label: "Solar", pct: 68 },
  { icon: Wind, label: "Wind", pct: 22 },
  { icon: Droplets, label: "Hydro", pct: 10 },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

export default function LandingPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="min-h-[92vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <motion.div {...fade(0)} className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-[rgba(0,255,136,0.3)] text-[var(--color-neon)] text-sm">
          <span className="size-2 rounded-full bg-[var(--color-neon)] animate-pulse" />
          Live on Stellar Testnet
        </motion.div>

        <motion.h1 {...fade(0.1)} className="text-5xl md:text-7xl font-black mb-6 leading-tight">
          Trade Renewable Energy{" "}
          <span className="gradient-text">Peer-to-Peer</span>
        </motion.h1>

        <motion.p {...fade(0.2)} className="text-lg text-slate-400 max-w-2xl mb-10">
          Solar panel owners in off-grid communities tokenize surplus kWh and sell directly to neighbors.
          Settled on Stellar in seconds. No middlemen. No waste.
        </motion.p>

        <motion.div {...fade(0.3)} className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/marketplace"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-neon)] text-black font-bold hover:bg-[var(--color-neon-dim)] transition-colors"
          >
            Open Marketplace <ArrowRight size={18} />
          </Link>
          <Link
            href="/producer"
            className="flex items-center gap-2 px-6 py-3 rounded-xl glass border border-[rgba(0,255,136,0.3)] text-white hover:border-[rgba(0,255,136,0.6)] transition-colors"
          >
            Become a Producer
          </Link>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <motion.div key={s.label} {...fade(i * 0.1)}>
              <GlassCard hover className="text-center">
                <s.icon className="mx-auto mb-3 text-[var(--color-neon)]" size={28} />
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-xs text-slate-400 mt-1">{s.label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2 {...fade()} className="text-3xl font-black text-center mb-2">
            Built for <span className="gradient-text">Real Impact</span>
          </motion.h2>
          <motion.p {...fade(0.1)} className="text-center text-slate-400 mb-12">
            Every feature designed for underserved, off-grid energy communities.
          </motion.p>
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} {...fade(i * 0.1)}>
                <GlassCard hover className="flex gap-4">
                  <div className="p-3 rounded-xl bg-[rgba(0,255,136,0.08)] shrink-0">
                    <f.icon className="text-[var(--color-neon)]" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">{f.title}</h3>
                    <p className="text-sm text-slate-400">{f.desc}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Energy sources */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <GlassCard neon>
            <h2 className="text-2xl font-black text-center mb-8 gradient-text">Energy Sources on Network</h2>
            <div className="space-y-5">
              {SOURCES.map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between mb-1.5 text-sm">
                    <span className="flex items-center gap-2 text-slate-300">
                      <s.icon size={16} className="text-[var(--color-neon)]" /> {s.label}
                    </span>
                    <span className="font-mono text-[var(--color-neon)]">{s.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[rgba(255,255,255,0.05)]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg,var(--color-neon),var(--color-electric))" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${s.pct}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 text-center">
        <motion.h2 {...fade()} className="text-4xl font-black mb-4">
          Ready to <span className="gradient-text">Start Trading?</span>
        </motion.h2>
        <motion.p {...fade(0.1)} className="text-slate-400 mb-8 max-w-lg mx-auto">
          Connect your Freighter wallet and join thousands of energy producers and consumers on EnergyLedger.
        </motion.p>
        <motion.div {...fade(0.2)}>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--color-neon)] text-black font-black text-lg hover:bg-[var(--color-neon-dim)] transition-colors"
          >
            Launch App <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgba(0,255,136,0.1)] py-8 px-4 text-center text-slate-500 text-sm">
        <p>© 2026 EnergyLedger · Built on Stellar · Powered by Soroban</p>
      </footer>
    </Layout>
  );
}
