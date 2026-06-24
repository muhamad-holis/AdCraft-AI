// src/app/(dashboard)/projects/page.tsx
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import { Film, Plus, Search } from "lucide-react";

export default async function ProjectsPage() {
  const { userId } = await auth();

  const user = await prisma.user.findUnique({ where: { clerkId: userId! } });
  const projects = user
    ? await prisma.project.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: { videos: true, script: true },
      })
    : [];

  const STATUS_COLORS: Record<string, string> = {
    COMPLETED: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    GENERATING: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    FAILED: "text-red-400 bg-red-500/10 border-red-500/20",
    DRAFT: "text-white/30 bg-white/5 border-white/10",
    ANALYZING: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    SCRIPTING: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Projects</h1>
          <p className="text-white/40 text-sm mt-0.5">{projects.length} project</p>
        </div>
        <Link
          href="/create"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Buat Baru
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white/[0.03] border border-dashed border-white/10 rounded-xl p-16 text-center">
          <Film className="w-10 h-10 text-white/20 mx-auto mb-4" />
          <p className="text-white/50 font-medium">Belum ada project</p>
          <p className="text-white/30 text-sm mt-1 mb-4">Upload foto produk dan buat video pertamamu</p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/15 border border-violet-500/25 text-violet-300 text-sm hover:bg-violet-500/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Buat Video Pertama
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden hover:border-white/15 hover:bg-white/[0.05] transition-all group"
            >
              {/* Thumbnail */}
              <div className="relative w-full aspect-video bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 flex items-center justify-center">
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt={p.productName} className="w-full h-full object-cover" />
                ) : (
                  <Film className="w-8 h-8 text-white/20" />
                )}
                <span
                  className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full border ${
                    STATUS_COLORS[p.status] ?? ""
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors line-clamp-1">
                  {p.productName}
                </h3>
                <p className="text-xs text-white/40 line-clamp-2">{p.productDesc}</p>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-xs text-white/20">
                    {new Date(p.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/30">{p.videos.length} video</span>
                    <span className="text-xs text-white/20 capitalize">{p.style.toLowerCase().replace("_", " ")}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
