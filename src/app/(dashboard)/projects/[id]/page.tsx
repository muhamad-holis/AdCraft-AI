// src/app/(dashboard)/projects/[id]/page.tsx
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Film } from "lucide-react";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();
  const user = await prisma.user.findUnique({ where: { clerkId: userId! } });
  if (!user) notFound();

  const project = await prisma.project.findUnique({
    where: { id: id, userId: user.id },
    include: {
      script: true,
      storyboard: { include: { scenes: { orderBy: { order: "asc" } } } },
      videos: { include: { exports: true } },
      marketingCopy: true,
    },
  });

  if (!project) notFound();

  const FORMAT_LABELS: Record<string, string> = {
    TIKTOK_916: "TikTok 9:16",
    INSTAGRAM_11: "Instagram 1:1",
    YOUTUBE_169: "YouTube 16:9",
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/projects"
          className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-white/60" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">{project.productName}</h1>
          <p className="text-white/40 text-xs mt-0.5">
            {new Date(project.createdAt).toLocaleDateString("id-ID", {
              weekday: "long", day: "numeric", month: "long", year: "numeric",
            })}
          </p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 capitalize">
          {project.style.replace("_", " ").toLowerCase()}
        </span>
      </div>

      {/* Product info */}
      <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5 flex gap-5">
        {project.imageUrl && (
          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-black/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 space-y-1">
          <p className="text-sm font-semibold text-white">{project.productName}</p>
          <p className="text-sm text-white/50 leading-relaxed">{project.productDesc}</p>
          <p className="text-xs text-white/30">Target: {project.targetAudience}</p>
        </div>
      </div>

      {/* Script */}
      {project.script && (
        <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white">Script</h2>
          <div className="grid gap-3">
            <ScriptBlock label="Headline" value={project.script.headline} />
            <ScriptBlock label="Hook" value={project.script.hook} />
            <ScriptBlock label="Voiceover" value={project.script.voiceover} multiline />
            <ScriptBlock label="CTA" value={project.script.cta} />
          </div>
        </div>
      )}

      {/* Videos */}
      {project.videos.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white">Generated Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {project.videos.map((v) => (
              <div key={v.id} className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden">
                <div className="aspect-video bg-black/40 flex items-center justify-center">
                  {v.url ? (
                    <video src={v.url} controls className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center space-y-2">
                      <Film className="w-8 h-8 text-white/20 mx-auto" />
                      <p className="text-xs text-white/30">
                        {v.status === "COMPLETED" ? "Video ready" : v.status.toLowerCase()}
                      </p>
                      {v.status !== "COMPLETED" && v.status !== "FAILED" && (
                        <div className="w-24 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
                          <div
                            className="h-full bg-violet-500 rounded-full animate-pulse"
                            style={{ width: `${v.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="text-xs text-white/50">
                    {FORMAT_LABELS[v.format] ?? v.format}
                  </span>
                  {v.url && (
                    <a
                      href={v.url}
                      download
                      className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Marketing Copy */}
      {project.marketingCopy && (
        <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white">Marketing Copy</h2>
          <div className="grid gap-3">
            <CopyBlock label="TikTok Caption" value={project.marketingCopy.tiktokCaption} />
            <CopyBlock label="Shopee Title" value={project.marketingCopy.shopeeTitle} />
            <CopyBlock label="Tokopedia Title" value={project.marketingCopy.tokopediaTitle} />
            <CopyBlock label="Facebook Ads" value={project.marketingCopy.facebookAdsCopy} />
            <CopyBlock label="WhatsApp" value={project.marketingCopy.whatsappMessage} multiline />
          </div>
        </div>
      )}
    </div>
  );
}

function ScriptBlock({
  label, value, multiline,
}: { label: string; value: string; multiline?: boolean }) {
  return (
    <div>
      <p className="text-xs text-white/30 mb-1">{label}</p>
      <div className="bg-white/5 rounded-lg px-4 py-3">
        <p className={`text-sm text-white/80 ${multiline ? "whitespace-pre-wrap leading-relaxed" : ""}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

function CopyBlock({
  label, value, multiline,
}: { label: string; value: string; multiline?: boolean }) {
  return (
    <div>
      <p className="text-xs text-white/30 mb-1">{label}</p>
      <div className="bg-white/5 rounded-lg px-4 py-3">
        <p className={`text-sm text-white/70 ${multiline ? "whitespace-pre-wrap leading-relaxed" : ""}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
