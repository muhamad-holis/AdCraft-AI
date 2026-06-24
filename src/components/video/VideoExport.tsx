"use client";
// src/components/video/VideoExport.tsx

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import type { VideoResolution } from "@/types";

interface ExportOption {
  format: string;
  url: string;
  resolution: VideoResolution;
  fileSize: number;
}

const RESOLUTION_LABELS: Record<VideoResolution, string> = {
  FHD_1080P: "1080P",
  QHD_2K: "2K",
  UHD_4K: "4K",
};

export function VideoExport({ exports }: { exports: ExportOption[] }) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (url: string, format: string) => {
    setDownloading(format);
    try {
      const a = document.createElement("a");
      a.href = url;
      a.download = `adcraft-${format}.mp4`;
      a.click();
    } finally {
      setTimeout(() => setDownloading(null), 1000);
    }
  };

  const formatSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="space-y-2">
      {exports.map((exp) => (
        <div
          key={`${exp.format}-${exp.resolution}`}
          className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3"
        >
          <div>
            <p className="text-sm text-white/80">{exp.format}</p>
            <p className="text-xs text-white/30">
              {RESOLUTION_LABELS[exp.resolution]} • {formatSize(exp.fileSize)}
            </p>
          </div>
          <button
            onClick={() => handleDownload(exp.url, exp.format)}
            disabled={downloading === exp.format}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-violet-500/15 border border-violet-500/25 text-violet-300 hover:bg-violet-500/20 transition-colors disabled:opacity-50"
          >
            {downloading === exp.format ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Download className="w-3 h-3" />
            )}
            Download
          </button>
        </div>
      ))}
    </div>
  );
}
