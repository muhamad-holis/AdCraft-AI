# AdCraft AI — Deployment Guide & Roadmap

---

## Quick Start (Local Dev)

```bash
# 1. Clone & install
git clone https://github.com/your-org/adcraft-ai
cd adcraft-ai
npm install

# 2. Set up environment
cp .env.example .env.local
# Fill in all required values

# 3. Set up database
npx prisma generate
npx prisma migrate dev --name init

# 4. Run dev server
npm run dev
```

---

## Infrastructure Setup

### 1. PostgreSQL
**Recommended: Supabase or Neon (serverless)**
```bash
# Neon free tier: neon.tech
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/adcraft?sslmode=require
```

### 2. Cloudflare R2
```bash
# 1. Create R2 bucket in Cloudflare dashboard
# 2. Enable public access or use custom domain
# 3. Create API token with Object Read & Write permissions
# 4. Set R2_PUBLIC_URL to your public bucket URL
```

### 3. Clerk Authentication
```bash
# 1. Create app at clerk.com
# 2. Enable Email + Google + Apple providers
# 3. Set Clerk webhook for user.created → /api/webhooks/clerk
```

### 4. Stripe
```bash
# 1. Create products in Stripe Dashboard:
#    - Starter: $19/month, $190/year
#    - Pro: $49/month, $490/year
#    - Agency: $149/month, $1490/year
# 2. Copy Price IDs to .env
# 3. Set webhook → /api/webhooks/stripe
#    Events: checkout.session.completed, customer.subscription.updated,
#            customer.subscription.deleted, invoice.payment_failed
```

### 5. Video API Keys
```
Runway ML:    app.runwayml.com → API → Create key
Kling AI:     klingai.com → Developer
Pika Labs:    pika.art → API access  
Luma AI:      lumalabs.ai → API
```

---

## Production Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
# or via CLI:
vercel env add ANTHROPIC_API_KEY production
# repeat for all vars...
```

### Vercel Configuration (`next.config.ts`)
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.r2.dev" },
      { protocol: "https", hostname: "*.cloudflare.com" },
    ],
  },
  experimental: { serverActions: { bodySizeLimit: "25mb" } },
};

export default nextConfig;
```

---

## Pricing Tiers

| Plan     | Credits/mo | Price/mo | Videos  | Resolution |
|----------|-----------|----------|---------|------------|
| Free     | 3         | $0       | 3       | 1080P      |
| Starter  | 20        | $19      | 20      | 1080P      |
| Pro      | 100       | $49      | 100     | 2K         |
| Agency   | 500       | $149     | 500     | 4K         |

---

## MVP Roadmap (Month 1–2)

### Week 1–2: Core Infrastructure
- [ ] Next.js 15 project scaffold
- [ ] Clerk auth integration
- [ ] Prisma + PostgreSQL setup
- [ ] Cloudflare R2 upload pipeline
- [ ] Basic dashboard layout

### Week 3–4: AI Pipeline
- [ ] Claude image analysis
- [ ] Script generation
- [ ] Storyboard generation
- [ ] Runway ML video generation
- [ ] Video status polling

### Week 5–6: UI & UX
- [ ] Upload zone with drag-drop
- [ ] 5-step creation flow
- [ ] Script editor display
- [ ] Storyboard visualization
- [ ] Progress tracker

### Week 7–8: Monetization
- [ ] Stripe subscription integration
- [ ] Credit system
- [ ] Webhooks (Stripe + Clerk)
- [ ] Marketing copy generator
- [ ] Export panel

---

## Production Roadmap (Month 3–6)

### Phase 2: Quality & Speed
- [ ] Redis queue (BullMQ) for video jobs
- [ ] Webhook-based status updates (no polling)
- [ ] Multi-provider video fallback (Runway → Kling on fail)
- [ ] Voiceover API (ElevenLabs / Azure TTS)
- [ ] Background music library
- [ ] Video player with download

### Phase 3: Growth Features
- [ ] Template marketplace (user-created templates)
- [ ] Brand Kit auto-apply to videos
- [ ] Bulk generation (upload CSV → generate 10+ videos)
- [ ] Team/workspace collaboration
- [ ] API access for Pro/Agency tiers
- [ ] Affiliate program

### Phase 4: Indonesia Market
- [ ] WhatsApp Business API integration
- [ ] Shopee / Tokopedia direct publish
- [ ] TikTok direct upload
- [ ] Indonesian influencer style templates
- [ ] Ramadan / Harbolnas seasonal templates
- [ ] QRIS payment integration

### Phase 5: Enterprise
- [ ] White-label solution
- [ ] Custom AI model fine-tuning
- [ ] Analytics dashboard (conversion tracking)
- [ ] A/B test video variants
- [ ] SOC 2 compliance

---

## Key Architecture Decisions

### Why Provider Adapters?
All AI providers (text and video) implement `BaseTextProvider` / `BaseVideoProvider`.
Adding a new provider = 1 new file + 1 line in the factory.
No other code changes needed.

### Why Zustand for Creation Flow?
The 5-step creation wizard has complex state that spans multiple components.
Zustand's flat store with devtools makes debugging the flow trivial.
No prop drilling through 5 levels of components.

### Why Cloudflare R2 over S3?
Zero egress fees for images served via Workers/CDN.
For a video platform, bandwidth costs are the primary cost driver.

### Credit Deduction Timing
Credits are deducted when video generation jobs are *submitted*, not when completed.
This prevents gaming (submitting and cancelling to avoid charges).
Failed jobs get credits refunded via Stripe webhook → DB update.
