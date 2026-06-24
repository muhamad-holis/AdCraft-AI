-- AdCraft AI — Initial Schema Migration

-- ─────────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────────
CREATE TYPE "Plan" AS ENUM ('FREE', 'STARTER', 'PRO', 'AGENCY');

CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'ANALYZING', 'SCRIPTING', 'GENERATING', 'COMPLETED', 'FAILED');

CREATE TYPE "VideoStyle" AS ENUM ('LUXURY', 'VIRAL_TIKTOK', 'CINEMATIC', 'EMOTIONAL', 'PREMIUM', 'MINIMALIST', 'AGGRESSIVE_SALES', 'DIRECT_RESPONSE', 'MODERN');

CREATE TYPE "SceneType" AS ENUM ('OPENING', 'PRODUCT_SHOWCASE', 'BENEFITS', 'SOCIAL_PROOF', 'CTA');

CREATE TYPE "VideoFormat" AS ENUM ('TIKTOK_916', 'INSTAGRAM_11', 'YOUTUBE_169');

CREATE TYPE "VideoResolution" AS ENUM ('FHD_1080P', 'QHD_2K', 'UHD_4K');

CREATE TYPE "VideoStatus" AS ENUM ('QUEUED', 'PROCESSING', 'RENDERING', 'COMPLETED', 'FAILED');

CREATE TYPE "Language" AS ENUM ('INDONESIAN', 'ENGLISH');

CREATE TYPE "GenerationType" AS ENUM ('ANALYSIS', 'SCRIPT', 'STORYBOARD', 'VIDEO', 'VOICEOVER', 'MARKETING_COPY');

CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED');

CREATE TYPE "BillingInterval" AS ENUM ('MONTHLY', 'YEARLY');

-- ─────────────────────────────────────────────
-- USER
-- ─────────────────────────────────────────────
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatarUrl" TEXT,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "credits" INTEGER NOT NULL DEFAULT 3,
    "totalVideos" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_clerkId_idx" ON "User"("clerkId");

-- ─────────────────────────────────────────────
-- PROJECT
-- ─────────────────────────────────────────────
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productDesc" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "customPrompt" TEXT,
    "style" "VideoStyle" NOT NULL DEFAULT 'MODERN',
    "template" TEXT,
    "imageUrl" TEXT NOT NULL,
    "imageKey" TEXT NOT NULL,
    "analysis" JSONB,
    "status" "ProjectStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Project_userId_idx" ON "Project"("userId");

ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─────────────────────────────────────────────
-- SCRIPT
-- ─────────────────────────────────────────────
CREATE TABLE "Script" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "hook" TEXT NOT NULL,
    "voiceover" TEXT NOT NULL,
    "cta" TEXT NOT NULL,
    "hashtags" TEXT[],
    "benefits" TEXT[],
    "painPoints" TEXT[],
    "solutions" TEXT[],
    "marketingAngle" TEXT NOT NULL,
    "aiProvider" TEXT NOT NULL DEFAULT 'claude',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Script_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Script_projectId_key" ON "Script"("projectId");

ALTER TABLE "Script" ADD CONSTRAINT "Script_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─────────────────────────────────────────────
-- STORYBOARD
-- ─────────────────────────────────────────────
CREATE TABLE "Storyboard" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Storyboard_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Storyboard_projectId_key" ON "Storyboard"("projectId");

ALTER TABLE "Storyboard" ADD CONSTRAINT "Storyboard_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─────────────────────────────────────────────
-- SCENE
-- ─────────────────────────────────────────────
CREATE TABLE "Scene" (
    "id" TEXT NOT NULL,
    "storyboardId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "type" "SceneType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "textOverlay" TEXT,
    "transition" TEXT,
    "cameraMove" TEXT,
    "visualNote" TEXT,

    CONSTRAINT "Scene_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Scene_storyboardId_idx" ON "Scene"("storyboardId");

ALTER TABLE "Scene" ADD CONSTRAINT "Scene_storyboardId_fkey"
    FOREIGN KEY ("storyboardId") REFERENCES "Storyboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─────────────────────────────────────────────
-- VIDEO
-- ─────────────────────────────────────────────
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "format" "VideoFormat" NOT NULL,
    "resolution" "VideoResolution" NOT NULL DEFAULT 'FHD_1080P',
    "status" "VideoStatus" NOT NULL DEFAULT 'QUEUED',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "storageKey" TEXT,
    "url" TEXT,
    "thumbnail" TEXT,
    "duration" DOUBLE PRECISION,
    "fileSize" INTEGER,
    "provider" TEXT,
    "externalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Video_projectId_idx" ON "Video"("projectId");

ALTER TABLE "Video" ADD CONSTRAINT "Video_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─────────────────────────────────────────────
-- VIDEO EXPORT
-- ─────────────────────────────────────────────
CREATE TABLE "VideoExport" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "resolution" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VideoExport_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "VideoExport_videoId_idx" ON "VideoExport"("videoId");

ALTER TABLE "VideoExport" ADD CONSTRAINT "VideoExport_videoId_fkey"
    FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─────────────────────────────────────────────
-- MARKETING COPY
-- ─────────────────────────────────────────────
CREATE TABLE "MarketingCopy" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "language" "Language" NOT NULL DEFAULT 'INDONESIAN',
    "tiktokCaption" TEXT NOT NULL,
    "tiktokHooks" TEXT[],
    "tiktokHashtags" TEXT[],
    "instagramCaption" TEXT NOT NULL,
    "shopeeTitle" TEXT NOT NULL,
    "tokopediaTitle" TEXT NOT NULL,
    "productDesc" TEXT NOT NULL,
    "facebookAdsCopy" TEXT NOT NULL,
    "whatsappMessage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketingCopy_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MarketingCopy_projectId_key" ON "MarketingCopy"("projectId");

ALTER TABLE "MarketingCopy" ADD CONSTRAINT "MarketingCopy_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─────────────────────────────────────────────
-- BRAND ASSET
-- ─────────────────────────────────────────────
CREATE TABLE "BrandAsset" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'My Brand',
    "logoUrl" TEXT,
    "logoKey" TEXT,
    "colors" TEXT[],
    "fonts" TEXT[],
    "ctaText" TEXT,
    "style" "VideoStyle" NOT NULL DEFAULT 'MODERN',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrandAsset_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "BrandAsset_userId_idx" ON "BrandAsset"("userId");

ALTER TABLE "BrandAsset" ADD CONSTRAINT "BrandAsset_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─────────────────────────────────────────────
-- GENERATION LOG
-- ─────────────────────────────────────────────
CREATE TABLE "Generation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT,
    "type" "GenerationType" NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "inputTokens" INTEGER,
    "outputTokens" INTEGER,
    "cost" DOUBLE PRECISION,
    "durationMs" INTEGER,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Generation_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Generation_userId_idx" ON "Generation"("userId");
CREATE INDEX "Generation_projectId_idx" ON "Generation"("projectId");

ALTER TABLE "Generation" ADD CONSTRAINT "Generation_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Generation" ADD CONSTRAINT "Generation_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ─────────────────────────────────────────────
-- TEMPLATE
-- ─────────────────────────────────────────────
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "style" "VideoStyle" NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Template_slug_key" ON "Template"("slug");

-- ─────────────────────────────────────────────
-- PAYMENT
-- ─────────────────────────────────────────────
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "stripeSessionId" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "plan" "Plan" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "interval" "BillingInterval",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Payment_userId_idx" ON "Payment"("userId");

ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
