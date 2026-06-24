"use client";
// src/components/script/ScriptEditor.tsx

import { useCreationStore } from "@/store/creation";

function ScriptField({
  label, value, accent, multiline,
}: { label: string; value: string; accent: string; multiline?: boolean }) {
  const accents: Record<string, string> = {
    violet: "border-violet-500/20 bg-violet-500/5",
    fuchsia: "border-fuchsia-500/20 bg-fuchsia-500/5",
    emerald: "border-emerald-500/20 bg-emerald-500/5",
    blue: "border-blue-500/20 bg-blue-500/5",
  };

  return (
    <div>
      <p className="text-xs text-white/30 mb-1.5">{label}</p>
      <div className={`border rounded-lg px-4 py-3 ${accents[accent] ?? ""}`}>
        <p className={`text-sm text-white/90 ${multiline ? "whitespace-pre-wrap leading-relaxed" : ""}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

export function ScriptEditor() {
  const { script, analysis } = useCreationStore();
  if (!script) return null;

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">Generated Script</h3>
        {analysis && (
          <span className="text-xs bg-violet-500/15 text-violet-300 border border-violet-500/20 px-2 py-1 rounded-full">
            {analysis.category}
          </span>
        )}
      </div>

      <div className="grid gap-4">
        <ScriptField label="Headline" value={script.headline} accent="violet" />
        <ScriptField label="Hook (Opening 3 seconds)" value={script.hook} accent="fuchsia" />
        <ScriptField label="Voiceover Script" value={script.voiceover} accent="violet" multiline />
        <ScriptField label="Call-to-Action" value={script.cta} accent="emerald" />
        <ScriptField label="Marketing Angle" value={script.marketingAngle} accent="blue" />

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-white/30 mb-2">Benefits</p>
            <ul className="space-y-1">
              {script.benefits.map((b, i) => (
                <li key={i} className="text-xs text-white/70 flex items-start gap-1.5">
                  <span className="text-emerald-400 mt-0.5">✓</span>{b}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-white/30 mb-2">Pain Points</p>
            <ul className="space-y-1">
              {script.painPoints.map((p, i) => (
                <li key={i} className="text-xs text-white/70 flex items-start gap-1.5">
                  <span className="text-red-400 mt-0.5">×</span>{p}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-white/30 mb-2">Hashtags</p>
            <div className="flex flex-wrap gap-1">
              {script.hashtags.slice(0, 6).map((h, i) => (
                <span key={i} className="text-xs text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded-full">
                  {h}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
