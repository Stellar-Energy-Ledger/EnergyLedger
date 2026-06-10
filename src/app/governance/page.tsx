"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Vote, Plus, CheckCircle, Clock, Users } from "lucide-react";
import Layout from "@/components/Layout";
import GlassCard from "@/components/GlassCard";

interface Proposal {
  id: string;
  title: string;
  description: string;
  yes: number;
  no: number;
  total: number;
  status: "active" | "passed" | "failed";
  ends: string;
  author: string;
}

const PROPOSALS: Proposal[] = [
  {
    id: "p1",
    title: "Reduce Marketplace Fee from 1% to 0.5%",
    description: "Lowering fees will encourage more small producers in rural communities to participate.",
    yes: 6800, no: 1200, total: 8000,
    status: "active", ends: "3 days", author: "GBSOL…1A2B",
  },
  {
    id: "p2",
    title: "Add Hydro Energy Source Support",
    description: "Extend the token contract to accept hydroelectric production data as a valid energy source.",
    yes: 9200, no: 400, total: 9600,
    status: "passed", ends: "Ended", author: "GHYD…9X7Z",
  },
  {
    id: "p3",
    title: "Introduce Carbon Credit NFTs",
    description: "Issue NFT-based carbon certificates for retired energy credits to enable carbon markets.",
    yes: 3100, no: 4200, total: 7300,
    status: "failed", ends: "Ended", author: "GENV…3Q1W",
  },
  {
    id: "p4",
    title: "Community Grant Pool — Q3 2026",
    description: "Allocate 500 XLM from protocol fees to fund solar panel installations in Kenya.",
    yes: 4400, no: 300, total: 4700,
    status: "active", ends: "6 days", author: "GCMT…5C6D",
  },
];

const STATUS_STYLE = {
  active: "text-[var(--color-electric)] bg-[rgba(0,212,255,0.1)]",
  passed: "text-[var(--color-neon)] bg-[rgba(0,255,136,0.1)]",
  failed: "text-red-400 bg-red-500/10",
};

export default function GovernancePage() {
  const [votes, setVotes] = useState<Record<string, "yes" | "no">>({});
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  function castVote(id: string, vote: "yes" | "no") {
    if (votes[id]) return;
    setVotes({ ...votes, [id]: vote });
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black mb-1">
            Community <span className="gradient-text">Governance</span>
          </h1>
          <p className="text-slate-400 mb-8">
            Vote on protocol changes and sustainability initiatives
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Active Proposals", value: "2", icon: Clock },
            { label: "Total Voters", value: "3,840", icon: Users },
            { label: "Proposals Passed", value: "18", icon: CheckCircle },
          ].map((s) => (
            <GlassCard key={s.label} hover className="text-center py-3">
              <s.icon size={20} className="mx-auto mb-2 text-[var(--color-neon)]" />
              <p className="text-xl font-black text-white">{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </GlassCard>
          ))}
        </div>

        {/* New proposal button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowNew(!showNew)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-neon)] text-black font-bold text-sm"
          >
            <Plus size={16} /> New Proposal
          </button>
        </div>

        {/* New proposal form */}
        {showNew && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6">
            <GlassCard neon>
              <h3 className="font-bold text-white mb-4">Submit Proposal</h3>
              <input
                type="text"
                placeholder="Proposal title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full glass border border-[rgba(0,255,136,0.2)] rounded-lg px-3 py-2 text-white bg-transparent outline-none focus:border-[var(--color-neon)] mb-3"
              />
              <textarea
                placeholder="Description…"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                rows={3}
                className="w-full glass border border-[rgba(0,255,136,0.2)] rounded-lg px-3 py-2 text-white bg-transparent outline-none focus:border-[var(--color-neon)] mb-3 resize-none"
              />
              <div className="flex gap-3">
                <button onClick={() => setShowNew(false)} className="flex-1 py-2 rounded-lg glass border border-[rgba(255,255,255,0.1)] text-slate-400 text-sm">Cancel</button>
                <button
                  disabled={!newTitle || !newDesc}
                  className="flex-1 py-2 rounded-lg bg-[var(--color-neon)] text-black font-bold text-sm disabled:opacity-40"
                  onClick={() => { alert("Proposal submitted (mock)"); setShowNew(false); }}
                >
                  Submit On-Chain
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Proposals */}
        <div className="space-y-5">
          {PROPOSALS.map((p, i) => {
            const yesPct = Math.round((p.yes / p.total) * 100);
            const voted = votes[p.id];
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <GlassCard hover>
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                    <h3 className="font-bold text-white text-base">{p.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[p.status]}`}>{p.status}</span>
                      {p.status === "active" && (
                        <span className="text-xs text-slate-500 flex items-center gap-1"><Clock size={10} /> {p.ends}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">{p.description}</p>

                  {/* Vote bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--color-neon)]">Yes {yesPct}%</span>
                      <span className="text-red-400">No {100 - yesPct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-red-500/20 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-[var(--color-neon)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${yesPct}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{p.total.toLocaleString()} votes cast</p>
                  </div>

                  {p.status === "active" && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => castVote(p.id, "yes")}
                        disabled={!!voted}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          voted === "yes"
                            ? "bg-[var(--color-neon)] text-black"
                            : "glass border border-[rgba(0,255,136,0.3)] text-[var(--color-neon)] hover:bg-[rgba(0,255,136,0.08)]"
                        } disabled:opacity-60`}
                      >
                        {voted === "yes" ? "✓ Voted Yes" : "Vote Yes"}
                      </button>
                      <button
                        onClick={() => castVote(p.id, "no")}
                        disabled={!!voted}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          voted === "no"
                            ? "bg-red-500 text-white"
                            : "glass border border-red-500/30 text-red-400 hover:bg-red-500/10"
                        } disabled:opacity-60`}
                      >
                        {voted === "no" ? "✓ Voted No" : "Vote No"}
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-slate-600 mt-3 font-mono">by {p.author}</p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
