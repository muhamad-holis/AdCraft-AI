"use client";
// src/components/script/StoryboardView.tsx

import { useCreationStore } from "@/store/creation";

const SCENE_COLORS: Record<string, string> = {
  OPENING: "bg-violet-500/20 text-violet-300",
  PRODUCT_SHOWCASE: "bg-blue-500/20 text-blue-300",
  BENEFITS: "bg-emerald-500/20 text-emerald-300",
  SOCIAL_PROOF: "bg-yellow-500/20 text-yellow-300",
  CTA: "bg-fuchsia-500/20 text-fuchsia-300",
};

export function StoryboardView() {
  const { storyboard } = useCreationStore();
  if (!storyboard) return null;

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">Storyboard</h3>
        <span className="text-xs text-white/30">{storyboard.totalDuration}s total</span>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {storyboard.scenes.map((scene) => (
          <div key={scene.order} className="bg-white/5 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white/40">0{scene.order}</span>
              <span className="text-xs text-white/30">{scene.duration}s</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${SCENE_COLORS[scene.type] ?? ""}`}>
              {scene.type.replace("_", " ")}
            </span>
            <p className="text-xs text-white/60 leading-relaxed line-clamp-3">{scene.description}</p>
            {scene.textOverlay && (
              <p className="text-xs text-violet-300 italic">&quot;{scene.textOverlay}&quot;</p>
            )}
            {scene.cameraMove && (
              <p className="text-xs text-white/20">📷 {scene.cameraMove.replace("_", " ")}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
