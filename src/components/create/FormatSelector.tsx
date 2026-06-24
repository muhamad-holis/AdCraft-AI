"use client";
// src/components/create/FormatSelector.tsx

import { useCreationStore } from "@/store/creation";
import type { VideoFormat, VideoResolution } from "@/types";
import { cn } from "@/lib/utils";

const FORMATS: { id: VideoFormat; label: string; ratio: string; icon: string }[] = [
  { id: "TIKTOK_916", label: "TikTok", ratio: "9:16", icon: "📱" },
  { id: "INSTAGRAM_11", label: "Instagram", ratio: "1:1", icon: "📷" },
  { id: "YOUTUBE_169", label: "YouTube", ratio: "16:9", icon: "🖥️" },
];

const RESOLUTIONS: { id: VideoResolution; label: string }[] = [
  { id: "FHD_1080P", label: "1080P" },
  { id: "QHD_2K", label: "2K" },
  { id: "UHD_4K", label: "4K" },
];

export function FormatSelector() {
  const { formats, resolution, toggleFormat, setResolution } = useCreationStore();

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 space-y-5">
      <h3 className="text-sm font-medium text-white/70">Output Formats</h3>

      <div className="flex gap-3">
        {FORMATS.map((f) => (
          <button
            key={f.id}
            onClick={() => toggleFormat(f.id)}
            className={cn(
              "flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
              formats.includes(f.id)
                ? "border-violet-500/40 bg-violet-500/10 text-white"
                : "border-white/10 text-white/40 hover:border-white/20"
            )}
          >
            <span className="text-xl">{f.icon}</span>
            <span className="text-xs font-medium">{f.label}</span>
            <span className="text-xs text-white/30">{f.ratio}</span>
          </button>
        ))}
      </div>

      <div>
        <p className="text-xs text-white/40 mb-2">Resolution</p>
        <div className="flex gap-2">
          {RESOLUTIONS.map((r) => (
            <button
              key={r.id}
              onClick={() => setResolution(r.id)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-medium border transition-all",
                resolution === r.id
                  ? "border-violet-500/40 bg-violet-500/10 text-violet-300"
                  : "border-white/10 text-white/40 hover:border-white/20"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
