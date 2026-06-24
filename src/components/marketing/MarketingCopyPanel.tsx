"use client";
// src/components/marketing/MarketingCopyPanel.tsx

import { useState } from "react";
import { useCreationStore } from "@/store/creation";
import { Copy, Check } from "lucide-react";

export function MarketingCopyPanel() {
  const { marketingCopy } = useCreationStore();
  const [copied, setCopied] = useState<string | null>(null);

  if (!marketingCopy) return null;

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const sections = [
    {
      category: "TikTok",
      color: "from-pink-500/20 to-red-500/20",
      border: "border-pink-500/20",
      items: [
        { label: "Caption", key: "tiktokCaption", text: marketingCopy.tiktokCaption },
        { label: "Hooks", key: "tiktokHooks", text: marketingCopy.tiktokHooks.join("\n\n") },
        { label: "Hashtags", key: "tiktokHashtags", text: marketingCopy.tiktokHashtags.join(" ") },
      ],
    },
    {
      category: "Marketplace",
      color: "from-orange-500/20 to-yellow-500/20",
      border: "border-orange-500/20",
      items: [
        { label: "Shopee Title", key: "shopeeTitle", text: marketingCopy.shopeeTitle },
        { label: "Tokopedia Title", key: "tokopediaTitle", text: marketingCopy.tokopediaTitle },
        { label: "Product Description", key: "productDesc", text: marketingCopy.productDesc },
      ],
    },
    {
      category: "Ads & Social",
      color: "from-blue-500/20 to-cyan-500/20",
      border: "border-blue-500/20",
      items: [
        { label: "Facebook Ads", key: "facebookAdsCopy", text: marketingCopy.facebookAdsCopy },
        { label: "Instagram Caption", key: "instagramCaption", text: marketingCopy.instagramCaption },
        { label: "WhatsApp Message", key: "whatsappMessage", text: marketingCopy.whatsappMessage },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">Marketing Copy</h3>
        <span className="text-xs text-white/30">
          {marketingCopy.language === "INDONESIAN" ? "🇮🇩 Bahasa Indonesia" : "🇺🇸 English"}
        </span>
      </div>

      {sections.map((section) => (
        <div key={section.category} className={`bg-gradient-to-br ${section.color} border ${section.border} rounded-xl p-5 space-y-4`}>
          <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider">
            {section.category}
          </h4>
          {section.items.map((item) => (
            <div key={item.key} className="bg-black/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-white/50">{item.label}</span>
                <button
                  onClick={() => copy(item.text, item.key)}
                  className="flex items-center gap-1 text-xs text-white/30 hover:text-white/70 transition-colors"
                >
                  {copied === item.key ? (
                    <><Check className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400">Copied</span></>
                  ) : (
                    <><Copy className="w-3 h-3" />Copy</>
                  )}
                </button>
              </div>
              <p className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
