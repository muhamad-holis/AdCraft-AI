"use client";
// src/components/video/VideoPreview.tsx

import { useCreationStore } from "@/store/creation";
import { VideoPlayer } from "./VideoPlayer";
import { Film } from "lucide-react";

export function VideoPreview({ showExport = false }: { showExport?: boolean }) {
  const { videoJobs, formats } = useCreationStore();

  const completed = videoJobs.filter((j) => j.status === "completed" && j.videoUrl);

  if (!completed.length) {
    return (
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-8 text-center">
        <Film className="w-8 h-8 text-white/20 mx-auto mb-2" />
        <p className="text-sm text-white/40">Video sedang diproses...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {completed.map((job, i) => (
        <VideoPlayer
          key={job.jobId}
          src={job.videoUrl!}
          format={formats[i]?.replace("_", " ")}
        />
      ))}
    </div>
  );
}
