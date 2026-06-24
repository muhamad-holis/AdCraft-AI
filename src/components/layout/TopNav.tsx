"use client";
// src/components/layout/TopNav.tsx

import { usePathname } from "next/navigation";
import { Bell, Sparkles } from "lucide-react";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/create": "Create Video",
  "/projects": "My Projects",
  "/templates": "Templates",
  "/brand-kit": "Brand Kit",
  "/settings": "Settings",
};

export function TopNav() {
  const pathname = usePathname();
  const title =
    Object.entries(TITLES).find(([key]) => pathname.startsWith(key))?.[1] ?? "";

  return (
    <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 flex-shrink-0">
      <h1 className="text-sm font-medium text-white/70">{title}</h1>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300">
          <Sparkles className="w-3 h-3" />
          <span>Credits</span>
        </div>
        <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/8 flex items-center justify-center transition-colors">
          <Bell className="w-4 h-4 text-white/50" />
        </button>
      </div>
    </header>
  );
}
