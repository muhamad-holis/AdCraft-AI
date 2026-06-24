// src/app/(dashboard)/templates/page.tsx
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  social: "Social Media",
  ecommerce: "E-commerce",
  branding: "Branding",
  product: "Product",
};

export default async function TemplatesPage() {
  const templates = await prisma.template.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const categories = Array.from(new Set(templates.map((t) => t.category)));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Templates</h1>
        <p className="text-white/40 text-sm mt-0.5">
          Pilih template siap pakai untuk produkmu
        </p>
      </div>

      {templates.length === 0 ? (
        <div className="bg-white/[0.03] border border-dashed border-white/10 rounded-xl p-16 text-center">
          <Sparkles className="w-10 h-10 text-white/20 mx-auto mb-4" />
          <p className="text-white/50">Belum ada template tersedia</p>
          <p className="text-white/30 text-sm mt-1">
            Jalankan <code className="text-violet-400">npm run db:seed</code> untuk load template default
          </p>
        </div>
      ) : (
        categories.map((cat) => (
          <div key={cat} className="space-y-4">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
              {CATEGORY_LABELS[cat] ?? cat}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {templates
                .filter((t) => t.category === cat)
                .map((t) => (
                  <Link
                    key={t.id}
                    href={`/create?template=${t.slug}`}
                    className="group relative bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden hover:border-white/15 transition-all"
                  >
                    <div className="aspect-[9/12] bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15 flex items-center justify-center relative">
                      <Sparkles className="w-8 h-8 text-white/20" />
                      {t.isPremium && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center">
                          <Lock className="w-3 h-3 text-amber-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-white group-hover:text-violet-300 transition-colors line-clamp-1">
                        {t.name}
                      </p>
                      <p className="text-xs text-white/40 mt-0.5 line-clamp-2">
                        {t.description}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
