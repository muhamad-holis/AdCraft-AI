"use client";
// src/app/(dashboard)/brand-kit/page.tsx

import { useEffect, useState } from "react";
import { Upload, Plus, Trash2, Star, Loader2 } from "lucide-react";
import type { VideoStyle } from "@/types";

interface BrandAsset {
  id: string;
  name: string;
  logoUrl: string | null;
  colors: string[];
  fonts: string[];
  ctaText: string | null;
  style: VideoStyle;
  isDefault: boolean;
}

const STYLES: VideoStyle[] = [
  "MODERN", "LUXURY", "VIRAL_TIKTOK", "CINEMATIC",
  "EMOTIONAL", "PREMIUM", "MINIMALIST", "AGGRESSIVE_SALES", "DIRECT_RESPONSE",
];

export default function BrandKitPage() {
  const [assets, setAssets] = useState<BrandAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("/api/brand-kit")
      .then((r) => r.json())
      .then((d) => setAssets(d.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const createNew = async () => {
    setCreating(true);
    try {
      const res = await fetch("/api/brand-kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Brand Baru",
          colors: ["#8B5CF6", "#EC4899"],
          fonts: ["Inter"],
          style: "MODERN",
        }),
      });
      const data = await res.json();
      setAssets((prev) => [...prev, data.data]);
    } finally {
      setCreating(false);
    }
  };

  const updateAsset = async (id: string, patch: Partial<BrandAsset>) => {
    setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
    await fetch(`/api/brand-kit/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
  };

  const deleteAsset = async (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
    await fetch(`/api/brand-kit/${id}`, { method: "DELETE" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-white/30 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Brand Kit</h1>
          <p className="text-white/40 text-sm mt-0.5">
            Simpan identitas brand untuk diterapkan otomatis ke setiap video
          </p>
        </div>
        <button
          onClick={createNew}
          disabled={creating}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Brand Baru
        </button>
      </div>

      {assets.length === 0 ? (
        <div className="bg-white/[0.03] border border-dashed border-white/10 rounded-xl p-16 text-center">
          <p className="text-white/40">Belum ada Brand Kit</p>
          <p className="text-white/30 text-sm mt-1">Buat brand kit untuk branding konsisten di semua video</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assets.map((asset) => (
            <div key={asset.id} className="bg-white/[0.03] border border-white/8 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <input
                  value={asset.name}
                  onChange={(e) => updateAsset(asset.id, { name: e.target.value })}
                  className="bg-transparent text-base font-semibold text-white focus:outline-none border-b border-transparent focus:border-white/20"
                />
                <div className="flex items-center gap-2">
                  {asset.isDefault && (
                    <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full">
                      <Star className="w-3 h-3" />Default
                    </span>
                  )}
                  <button
                    onClick={() => deleteAsset(asset.id)}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/10 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-white/40 hover:text-red-400" />
                  </button>
                </div>
              </div>

              {/* Logo upload */}
              <div>
                <p className="text-xs text-white/30 mb-2">Logo</p>
                <div className="flex items-center gap-3">
                  {asset.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={asset.logoUrl} alt="logo" className="w-14 h-14 rounded-lg object-contain bg-white/5" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-white/5 border border-dashed border-white/10 flex items-center justify-center">
                      <Upload className="w-4 h-4 text-white/20" />
                    </div>
                  )}
                  <button className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/50 hover:border-white/20 transition-colors">
                    Upload Logo
                  </button>
                </div>
              </div>

              {/* Colors */}
              <div>
                <p className="text-xs text-white/30 mb-2">Brand Colors</p>
                <div className="flex items-center gap-2">
                  {asset.colors.map((c, i) => (
                    <input
                      key={i}
                      type="color"
                      value={c}
                      onChange={(e) => {
                        const next = [...asset.colors];
                        next[i] = e.target.value;
                        updateAsset(asset.id, { colors: next });
                      }}
                      className="w-9 h-9 rounded-lg border border-white/10 cursor-pointer bg-transparent"
                    />
                  ))}
                  <button
                    onClick={() => updateAsset(asset.id, { colors: [...asset.colors, "#888888"] })}
                    className="w-9 h-9 rounded-lg border border-dashed border-white/10 flex items-center justify-center text-white/30 hover:text-white/50 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* CTA text */}
              <div>
                <p className="text-xs text-white/30 mb-2">Default CTA</p>
                <input
                  value={asset.ctaText ?? ""}
                  onChange={(e) => updateAsset(asset.id, { ctaText: e.target.value })}
                  placeholder="e.g. Order Sekarang!"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50"
                />
              </div>

              {/* Default style */}
              <div>
                <p className="text-xs text-white/30 mb-2">Style Default</p>
                <div className="flex flex-wrap gap-2">
                  {STYLES.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateAsset(asset.id, { style: s })}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all capitalize ${
                        asset.style === s
                          ? "border-violet-500/40 bg-violet-500/10 text-violet-300"
                          : "border-white/10 text-white/40 hover:border-white/20"
                      }`}
                    >
                      {s.toLowerCase().replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
