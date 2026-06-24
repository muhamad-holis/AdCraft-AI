"use client";
// src/app/page.tsx
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap, Sparkles, Film, Share2, ArrowRight,
  CheckCircle2, Star, Play
} from "lucide-react";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Script Generator",
    desc: "Hook, voiceover, CTA, dan angle marketing otomatis dari foto produk.",
  },
  {
    icon: Film,
    title: "Video Multi-Format",
    desc: "TikTok 9:16, Instagram 1:1, YouTube 16:9 — semua di-generate sekaligus.",
  },
  {
    icon: Share2,
    title: "Marketing Copy Lengkap",
    desc: "Caption TikTok, judul Shopee/Tokopedia, Facebook Ads, WA Blast — otomatis.",
  },
  {
    icon: Zap,
    title: "5 Provider Video AI",
    desc: "Runway, Kling, Pika, Luma — pilih provider terbaik untuk produkmu.",
  },
];

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/bulan",
    credits: "3 video",
    features: ["3 kredit/bulan", "1080P", "Semua format", "Marketing copy"],
    cta: "Mulai Gratis",
    href: "/sign-up",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/bulan",
    credits: "100 video",
    features: ["100 kredit/bulan", "Resolusi 2K", "Brand Kit", "Priority queue", "API access"],
    cta: "Coba Pro",
    href: "/sign-up",
    highlight: true,
  },
  {
    name: "Agency",
    price: "$149",
    period: "/bulan",
    credits: "500 video",
    features: ["500 kredit/bulan", "Resolusi 4K", "Multi workspace", "Bulk generation", "White-label"],
    cta: "Hubungi Kami",
    href: "/sign-up",
    highlight: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0A0A0F]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              AdCraft<span className="text-violet-400">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-sm text-white/60 hover:text-white transition-colors">
              Masuk
            </Link>
            <Link
              href="/sign-up"
              className="text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium hover:opacity-90 transition-opacity"
            >
              Mulai Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium">
            <Sparkles className="w-3 h-3" />
            AI Video Ad Generator #1 untuk Produk Indonesia
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Upload Foto Produk,
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Dapat Video Iklan
            </span>
            <br />
            dalam Menit
          </h1>

          <p className="text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
            AI analisis produkmu, tulis script, buat storyboard, generate video TikTok/Instagram/YouTube,
            plus caption & judul Shopee/Tokopedia — otomatis.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/sign-up"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Coba Gratis Sekarang
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-white/70 hover:border-white/20 hover:text-white transition-all">
              <Play className="w-4 h-4" />
              Lihat Demo
            </button>
          </div>

          <p className="text-xs text-white/30">
            3 video gratis • Tidak perlu kartu kredit
          </p>
        </motion.div>

        {/* Hero mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="relative rounded-2xl border border-white/10 bg-[#0D0D14] overflow-hidden shadow-2xl shadow-violet-500/10">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <span className="ml-2 text-xs text-white/20">adcraft.ai/create</span>
            </div>
            <div className="p-6 grid grid-cols-3 gap-4 min-h-[280px]">
              <div className="col-span-1 bg-white/5 rounded-xl p-4 space-y-3">
                <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                  <span className="text-4xl">🎧</span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 bg-white/10 rounded w-3/4" />
                  <div className="h-2 bg-white/5 rounded w-full" />
                  <div className="h-2 bg-white/5 rounded w-2/3" />
                </div>
              </div>
              <div className="col-span-2 space-y-3">
                <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4 space-y-2">
                  <div className="text-xs text-violet-400 font-medium">✨ AI Script Generated</div>
                  <div className="text-sm text-white/80">
                    "Capek kerja seharian tapi masih harus dengerin suara bising? Earbuds ini bakal jadi penyelamatmu..."
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["TikTok 9:16", "Instagram 1:1", "YouTube 16:9"].map((f) => (
                    <div key={f} className="bg-white/5 rounded-lg p-3 text-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <Film className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-xs text-white/50">{f}</div>
                      <div className="text-xs text-emerald-400 mt-1">✓ Ready</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Semua yang kamu butuhkan</h2>
            <p className="text-white/40 mt-2">dari satu foto produk, jadi konten lengkap</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-white/[0.03] border border-white/8 rounded-xl p-6 hover:border-white/15 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Harga Transparan</h2>
            <p className="text-white/40 mt-2">Mulai gratis, upgrade kapan saja</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-xl p-6 border transition-all ${
                  plan.highlight
                    ? "bg-gradient-to-b from-violet-500/15 to-fuchsia-500/5 border-violet-500/30 shadow-lg shadow-violet-500/10"
                    : "bg-white/[0.03] border-white/10"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-3 py-1 rounded-full">
                    Paling Populer
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="font-bold text-white">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    <span className="text-sm text-white/40">{plan.period}</span>
                  </div>
                  <p className="text-xs text-violet-400 mt-1">{plan.credits}</p>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm text-white/60">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block text-center py-2.5 rounded-lg text-sm font-semibold transition-opacity ${
                    plan.highlight
                      ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:opacity-90"
                      : "border border-white/15 text-white/70 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-bold text-white/60">AdCraftAI</span>
          </div>
          <p className="text-xs text-white/20">© 2025 AdCraft AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
