// src/app/(dashboard)/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import {
  Film, Sparkles, Clock, TrendingUp,
  ArrowRight, Plus
} from "lucide-react";

async function getDashboardData(clerkId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      projects: {
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { videos: true },
      },
    },
  });
  return user;
}

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = userId ? await getDashboardData(userId) : null;

  const stats = [
    {
      label: "Total Videos",
      value: user?.totalVideos ?? 0,
      icon: Film,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      label: "Credits Left",
      value: user?.credits ?? 0,
      icon: Sparkles,
      color: "text-fuchsia-400",
      bg: "bg-fuchsia-500/10",
    },
    {
      label: "Projects",
      value: user?.projects?.length ?? 0,
      icon: Clock,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Plan",
      value: user?.plan ?? "FREE",
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
  ];

  const STATUS_COLORS: Record<string, string> = {
    COMPLETED: "text-emerald-400 bg-emerald-500/10",
    GENERATING: "text-violet-400 bg-violet-500/10",
    FAILED: "text-red-400 bg-red-500/10",
    DRAFT: "text-white/30 bg-white/5",
    ANALYZING: "text-yellow-400 bg-yellow-500/10",
    SCRIPTING: "text-blue-400 bg-blue-500/10",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-white/40 text-sm mt-0.5">
            Selamat datang kembali 👋
          </p>
        </div>
        <Link
          href="/create"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Buat Video Baru
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-white/[0.03] border border-white/8 rounded-xl p-5"
            >
              <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Credits alert */}
      {(user?.credits ?? 0) <= 1 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-amber-300">
              Kredit hampir habis
            </p>
            <p className="text-xs text-amber-300/60 mt-0.5">
              Upgrade plan untuk generate lebih banyak video.
            </p>
          </div>
          <Link
            href="/settings"
            className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 transition-colors"
          >
            Upgrade
          </Link>
        </div>
      )}

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Project Terbaru</h2>
          <Link
            href="/projects"
            className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
          >
            Lihat semua <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {!user?.projects?.length ? (
          <div className="bg-white/[0.03] border border-dashed border-white/10 rounded-xl p-12 text-center">
            <Film className="w-8 h-8 text-white/20 mx-auto mb-3" />
            <p className="text-sm text-white/40">Belum ada project</p>
            <Link
              href="/create"
              className="inline-flex items-center gap-1.5 mt-3 text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              <Plus className="w-3 h-3" />
              Buat video pertamamu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="bg-white/[0.03] border border-white/8 rounded-xl p-5 hover:border-white/15 hover:bg-white/[0.05] transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                    <Film className="w-5 h-5 text-violet-400" />
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      STATUS_COLORS[project.status] ?? "text-white/30 bg-white/5"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors line-clamp-1">
                  {project.productName}
                </h3>
                <p className="text-xs text-white/40 mt-1 line-clamp-2">
                  {project.productDesc}
                </p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                  <span className="text-xs text-white/20">
                    {new Date(project.createdAt).toLocaleDateString("id-ID")}
                  </span>
                  <span className="text-xs text-white/30">
                    {project.videos.length} video
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
