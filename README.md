# AdCraft AI

AI-powered video ad generator untuk produk e-commerce Indonesia.
Upload foto produk → AI generate script, storyboard, video (TikTok/Instagram/YouTube), dan marketing copy (Shopee/Tokopedia/FB Ads/WA).

## Quick Start

```bash
npm install
cp .env.example .env.local
# isi semua env var di .env.local

npx prisma generate
npx prisma migrate dev --name init
npm run db:seed

npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Struktur Proyek

Lihat `ARCHITECTURE.md` untuk detail folder structure dan `DEPLOYMENT.md` untuk panduan deploy ke production + roadmap.

## Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Next.js API Routes, PostgreSQL, Prisma ORM
- **Storage:** Cloudflare R2
- **Auth:** Clerk
- **Payments:** Stripe
- **AI Text:** Claude / OpenAI / Gemini (provider adapter pattern)
- **AI Video:** Runway / Kling / Pika / Luma (provider adapter pattern)

## Environment Variables

Lihat `.env.example` untuk daftar lengkap. Minimal yang wajib diisi untuk development:

- `DATABASE_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY`
- `ANTHROPIC_API_KEY` (atau provider text AI lain)
- `RUNWAY_API_KEY` (atau provider video AI lain)
- `CLOUDFLARE_ACCOUNT_ID` + `R2_ACCESS_KEY_ID` + `R2_SECRET_ACCESS_KEY` + `R2_BUCKET_NAME` + `R2_PUBLIC_URL`
