"use client";
// src/components/create/VoiceSelector.tsx

import { useCreationStore } from "@/store/creation";
import type { VoiceGender, Language, MusicMood } from "@/types";
import { cn } from "@/lib/utils";

export function VoiceSelector() {
  const {
    voiceGender, voiceLanguage, musicMood,
    setVoiceGender, setVoiceLanguage, setMusicMood,
  } = useCreationStore();

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 space-y-5">
      <h3 className="text-sm font-medium text-white/70">Voice & Music</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-white/40 mb-2">Voice</p>
          <div className="flex gap-2">
            {(["male", "female"] as VoiceGender[]).map((g) => (
              <button
                key={g}
                onClick={() => setVoiceGender(g)}
                className={cn(
                  "flex-1 py-2 rounded-lg text-xs font-medium border transition-all capitalize",
                  voiceGender === g
                    ? "border-violet-500/40 bg-violet-500/10 text-violet-300"
                    : "border-white/10 text-white/40"
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-white/40 mb-2">Language</p>
          <div className="flex gap-2">
            {(["INDONESIAN", "ENGLISH"] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setVoiceLanguage(l)}
                className={cn(
                  "flex-1 py-2 rounded-lg text-xs font-medium border transition-all",
                  voiceLanguage === l
                    ? "border-violet-500/40 bg-violet-500/10 text-violet-300"
                    : "border-white/10 text-white/40"
                )}
              >
                {l === "INDONESIAN" ? "🇮🇩 ID" : "🇺🇸 EN"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs text-white/40 mb-2">Music Mood</p>
        <div className="flex flex-wrap gap-2">
          {(["energetic", "luxury", "emotional", "corporate", "modern", "viral_tiktok"] as MusicMood[]).map((m) => (
            <button
              key={m}
              onClick={() => setMusicMood(m)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize",
                musicMood === m
                  ? "border-violet-500/40 bg-violet-500/10 text-violet-300"
                  : "border-white/10 text-white/40"
              )}
            >
              {m.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
