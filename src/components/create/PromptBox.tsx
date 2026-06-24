"use client";
// src/components/create/PromptBox.tsx

import { useCreationStore } from "@/store/creation";

const STYLE_PRESETS = [
  "Luxury", "Viral TikTok", "Cinematic", "Emotional",
  "Premium", "Minimalist", "Aggressive Sales", "Direct Response",
];

export function PromptBox() {
  const { customPrompt, setCustomPrompt } = useCreationStore();

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 space-y-4">
      <h3 className="text-sm font-medium text-white/70">Ad Style Prompt</h3>

      <div className="flex flex-wrap gap-2">
        {STYLE_PRESETS.map((preset) => (
          <button
            key={preset}
            onClick={() => setCustomPrompt(preset)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              customPrompt === preset
                ? "border-violet-500/50 bg-violet-500/15 text-violet-300"
                : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"
            }`}
          >
            {preset}
          </button>
        ))}
      </div>

      <textarea
        value={customPrompt}
        onChange={(e) => setCustomPrompt(e.target.value)}
        placeholder="Describe the advertisement style you want... e.g. Create a cinematic luxury product video with dramatic lighting"
        rows={3}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
      />
    </div>
  );
}
