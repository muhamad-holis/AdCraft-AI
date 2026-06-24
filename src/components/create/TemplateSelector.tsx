"use client";
// src/components/create/TemplateSelector.tsx

import { useEffect, useState } from "react";
import { useCreationStore } from "@/store/creation";
import { Sparkles, Lock } from "lucide-react";

interface Template {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  isPremium: boolean;
}

export function TemplateSelector() {
  const { template, setTemplate } = useCreationStore();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/templates")
      .then((r) => r.json())
      .then((d) => setTemplates(d.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 space-y-4">
      <h3 className="text-sm font-medium text-white/70">Template (Opsional)</h3>

      {loading ? (
        <div className="flex gap-3 overflow-x-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-32 h-20 rounded-lg bg-white/5 animate-pulse flex-shrink-0" />
          ))}
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1">
          <button
            onClick={() => setTemplate(null)}
            className={`flex-shrink-0 w-32 rounded-lg border p-3 text-left transition-all ${
              !template
                ? "border-violet-500/40 bg-violet-500/10"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            <Sparkles className="w-4 h-4 text-white/40 mb-2" />
            <p className="text-xs font-medium text-white/70">Tanpa Template</p>
            <p className="text-xs text-white/30 mt-0.5">Custom prompt saja</p>
          </button>

          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.slug)}
              className={`flex-shrink-0 w-32 rounded-lg border p-3 text-left transition-all relative ${
                template === t.slug
                  ? "border-violet-500/40 bg-violet-500/10"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              {t.isPremium && (
                <Lock className="w-3 h-3 text-amber-400 absolute top-2 right-2" />
              )}
              <p className="text-xs font-medium text-white/70 line-clamp-1">{t.name}</p>
              <p className="text-xs text-white/30 mt-0.5 line-clamp-2">{t.description}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
