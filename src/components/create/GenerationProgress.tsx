"use client";
// src/components/create/GenerationProgress.tsx

import { useEffect } from "react";
import { useCreationStore } from "@/store/creation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export function GenerationProgress() {
  const { videoJobs, formats, updateVideoJob } = useCreationStore();

  useEffect(() => {
    const pending = videoJobs.filter((j) => j.status !== "completed" && j.status !== "failed");
    if (!pending.length) return;

    const interval = setInterval(async () => {
      for (const job of pending) {
        try {
          const res = await fetch(`/api/video/status/${job.jobId}`);
          const data = await res.json();
          if (res.ok) {
            updateVideoJob(job.jobId, {
              status: data.data.status,
              progress: data.data.progress,
              videoUrl: data.data.videoUrl,
            });
          }
        } catch {
          // ignore transient errors, will retry next tick
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [videoJobs, updateVideoJob]);

  const FORMAT_LABELS: Record<string, string> = {
    TIKTOK_916: "TikTok 9:16",
    INSTAGRAM_11: "Instagram 1:1",
    YOUTUBE_169: "YouTube 16:9",
  };

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 space-y-4">
      <h3 className="text-sm font-medium text-white/70">Generation Progress</h3>
      <div className="space-y-3">
        {videoJobs.map((job, i) => (
          <div key={job.jobId} className="flex items-center gap-4">
            <div className="w-28 text-xs text-white/40">
              {FORMAT_LABELS[formats[i]] ?? `Format ${i + 1}`}
            </div>
            <div className="flex-1 bg-white/5 rounded-full h-1.5">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500"
                style={{ width: `${job.progress}%` }}
              />
            </div>
            <div className="w-24 flex items-center gap-1.5">
              {job.status === "completed" ? (
                <><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /><span className="text-xs text-emerald-400">Done</span></>
              ) : job.status === "failed" ? (
                <><XCircle className="w-3.5 h-3.5 text-red-400" /><span className="text-xs text-red-400">Failed</span></>
              ) : (
                <><Loader2 className="w-3.5 h-3.5 text-violet-400 animate-spin" /><span className="text-xs text-violet-400">{job.progress}%</span></>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
