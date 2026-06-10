import GlassCard from "./GlassCard";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  color?: "neon" | "electric";
}

export default function StatCard({ label, value, sub, icon: Icon, color = "neon" }: StatCardProps) {
  const c = color === "neon" ? "var(--color-neon)" : "var(--color-electric)";
  return (
    <GlassCard hover className="flex items-start gap-4">
      <div className="p-2 rounded-lg" style={{ background: `${c}18` }}>
        <Icon size={20} style={{ color: c }} />
      </div>
      <div>
        <p className="text-xs text-slate-400 mb-1">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </GlassCard>
  );
}
