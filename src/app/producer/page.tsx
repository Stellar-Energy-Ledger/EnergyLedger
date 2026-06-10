"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Wind, Droplets, Plus, CheckCircle, Upload, Flame } from "lucide-react";
import Layout from "@/components/Layout";
import GlassCard from "@/components/GlassCard";

const MY_LISTINGS = [
  { id: "1", kWh: 120, source: "solar", price: 0.42, status: "active", sold: 40 },
  { id: "2", kWh: 60, source: "wind", price: 0.38, status: "active", sold: 60 },
  { id: "3", kWh: 200, source: "solar", price: 0.40, status: "expired", sold: 200 },
];

const SOURCE_ICONS = { solar: Sun, wind: Wind, hydro: Droplets };

export default function ProducerPage() {
  const [step, setStep] = useState<"form" | "mint" | "success">("form");
  const [form, setForm] = useState({ kWh: "", source: "solar", price: "", location: "" });

  function handleMint() {
    setStep("mint");
    setTimeout(() => setStep("success"), 2000);
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black mb-1">
            Producer <span className="gradient-text">Panel</span>
          </h1>
          <p className="text-slate-400 mb-8">Tokenize surplus energy and list on the marketplace</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Mint form */}
          <div className="space-y-5">
            <GlassCard neon>
              <h2 className="font-bold text-white mb-5 flex items-center gap-2">
                <Upload size={18} className="text-[var(--color-neon)]" /> Mint Energy Credits
              </h2>

              {step === "success" ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle size={48} className="text-[var(--color-neon)] mx-auto mb-3" />
                  <p className="font-bold text-white text-lg">Credits Minted!</p>
                  <p className="text-slate-400 text-sm mt-1">{form.kWh} kWh tokens created on-chain</p>
                  <button
                    onClick={() => { setStep("form"); setForm({ kWh: "", source: "solar", price: "", location: "" }); }}
                    className="mt-4 px-4 py-2 rounded-lg bg-[var(--color-neon)] text-black font-bold text-sm"
                  >
                    Mint More
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Energy Amount (kWh)</label>
                    <input
                      type="number"
                      value={form.kWh}
                      onChange={(e) => setForm({ ...form, kWh: e.target.value })}
                      className="w-full glass border border-[rgba(0,255,136,0.2)] rounded-lg px-3 py-2 text-white bg-transparent outline-none focus:border-[var(--color-neon)]"
                      placeholder="e.g. 100"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Energy Source</label>
                    <div className="flex gap-2">
                      {(["solar", "wind", "hydro"] as const).map((s) => {
                        const Icon = SOURCE_ICONS[s];
                        return (
                          <button
                            key={s}
                            onClick={() => setForm({ ...form, source: s })}
                            className={`flex-1 py-2 rounded-lg flex flex-col items-center gap-1 text-xs transition-colors capitalize ${
                              form.source === s
                                ? "bg-[rgba(0,255,136,0.15)] border border-[var(--color-neon)] text-[var(--color-neon)]"
                                : "glass border border-[rgba(255,255,255,0.08)] text-slate-400"
                            }`}
                          >
                            <Icon size={16} />
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Listing Price (XLM / kWh)</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="w-full glass border border-[rgba(0,255,136,0.2)] rounded-lg px-3 py-2 text-white bg-transparent outline-none focus:border-[var(--color-neon)]"
                      placeholder="e.g. 0.42"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Location</label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full glass border border-[rgba(0,255,136,0.2)] rounded-lg px-3 py-2 text-white bg-transparent outline-none focus:border-[var(--color-neon)]"
                      placeholder="City, Country"
                    />
                  </div>

                  <button
                    onClick={handleMint}
                    disabled={!form.kWh || !form.price || step === "mint"}
                    className="w-full py-3 rounded-xl bg-[var(--color-neon)] text-black font-bold disabled:opacity-40 flex items-center justify-center gap-2 hover:bg-[var(--color-neon-dim)] transition-colors"
                  >
                    {step === "mint" ? (
                      <><span className="size-4 border-2 border-black/40 border-t-black rounded-full animate-spin" /> Minting…</>
                    ) : (
                      <><Plus size={16} /> Mint &amp; List Credits</>
                    )}
                  </button>
                </div>
              )}
            </GlassCard>

            {/* Burn credits */}
            <GlassCard>
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Flame size={16} className="text-orange-400" /> Retire / Burn Credits
              </h3>
              <p className="text-sm text-slate-400 mb-3">
                Mark consumed energy credits as retired on-chain for carbon accounting.
              </p>
              <button className="w-full py-2 rounded-lg glass border border-orange-500/30 text-orange-400 text-sm hover:bg-orange-500/10 transition-colors">
                Retire Consumed Credits
              </button>
            </GlassCard>
          </div>

          {/* My listings */}
          <div>
            <GlassCard>
              <h2 className="font-bold text-white mb-5">My Listings</h2>
              <div className="space-y-3">
                {MY_LISTINGS.map((l) => {
                  const Icon = SOURCE_ICONS[l.source as keyof typeof SOURCE_ICONS];
                  const pct = Math.round((l.sold / l.kWh) * 100);
                  return (
                    <div key={l.id} className="p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Icon size={16} className="text-[var(--color-neon)]" />
                          <span className="text-sm font-semibold text-white">{l.kWh} kWh</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${l.status === "active" ? "bg-[rgba(0,255,136,0.15)] text-[var(--color-neon)]" : "bg-[rgba(255,255,255,0.08)] text-slate-500"}`}>
                          {l.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{l.price} XLM/kWh · {l.sold} sold</p>
                      <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.06)]">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, background: "linear-gradient(90deg,var(--color-neon),var(--color-electric))" }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{pct}% sold</p>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </Layout>
  );
}
