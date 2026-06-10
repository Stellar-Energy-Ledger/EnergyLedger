import { clsx } from "clsx";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  neon?: boolean;
}

export default function GlassCard({ children, className, hover, neon }: GlassCardProps) {
  return (
    <div
      className={clsx(
        "glass rounded-xl p-6",
        hover && "transition-all duration-300 hover:border-[rgba(0,255,136,0.4)] hover:shadow-[0_0_30px_rgba(0,255,136,0.08)]",
        neon && "neon-border",
        className
      )}
    >
      {children}
    </div>
  );
}
