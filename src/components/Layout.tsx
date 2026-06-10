import { ReactNode } from "react";
import Navbar from "./Navbar";
import AnimatedBackground from "./AnimatedBackground";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid-bg relative">
      <AnimatedBackground />
      <Navbar />
      <main className="relative z-10 pt-16">{children}</main>
    </div>
  );
}
