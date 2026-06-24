"use client";
// src/components/layout/Sidebar.tsx

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  LayoutDashboard,
  FolderOpen,
  LayoutTemplate,
  Palette,
  Settings,
  Zap,
} from "lucide-react";

const NAV = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/create", icon: Sparkles, label: "Create Video" },
  { href: "/projects", icon: FolderOpen, label: "My Projects" },
  { href: "/templates", icon: LayoutTemplate, label: "Templates" },
  { href: "/brand-kit", icon: Palette, label: "Brand Kit" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const path = usePathname();

  return (
    <aside className="w-64 bg-[#0D0D14] border-r border-white/5 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">
            AdCraft<span className="text-violet-400">AI</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = path === href || (href !== "/dashboard" && path.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                active
                  ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Create CTA */}
      <div className="p-4 border-t border-white/5">
        <Link
          href="/create"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Sparkles className="w-4 h-4" />
          New Video
        </Link>
      </div>

      {/* User */}
      <div className="p-4 border-t border-white/5 flex items-center gap-3">
        <UserButton fallbackRedirectUrl="/" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-white/40 truncate">Account</p>
        </div>
      </div>
    </aside>
  );
}
