"use client";
// src/components/create/ProductForm.tsx

import { useCreationStore } from "@/store/creation";

export function ProductForm() {
  const {
    productName, productDesc, targetAudience,
    setProductName, setProductDesc, setTargetAudience,
  } = useCreationStore();

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 space-y-4">
      <h3 className="text-sm font-medium text-white/70">Product Details</h3>

      <div>
        <label className="text-xs text-white/40 mb-1.5 block">Product Name *</label>
        <input
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="e.g. Wireless Earbuds Pro"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 transition-colors"
        />
      </div>

      <div>
        <label className="text-xs text-white/40 mb-1.5 block">Product Description *</label>
        <textarea
          value={productDesc}
          onChange={(e) => setProductDesc(e.target.value)}
          placeholder="e.g. Premium sound quality with active noise cancellation, 30h battery life..."
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
        />
      </div>

      <div>
        <label className="text-xs text-white/40 mb-1.5 block">Target Audience *</label>
        <input
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
          placeholder="e.g. Young professionals aged 22-35"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 transition-colors"
        />
      </div>
    </div>
  );
}
