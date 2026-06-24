// src/types/index.ts

export type VideoStyle =
  | "LUXURY"
  | "VIRAL_TIKTOK"
  | "CINEMATIC"
  | "EMOTIONAL"
  | "PREMIUM"
  | "MINIMALIST"
  | "AGGRESSIVE_SALES"
  | "DIRECT_RESPONSE"
  | "MODERN";

export type VideoFormat = "TIKTOK_916" | "INSTAGRAM_11" | "YOUTUBE_169";
export type VideoResolution = "FHD_1080P" | "QHD_2K" | "UHD_4K";
export type Language = "INDONESIAN" | "ENGLISH";
export type VoiceGender = "male" | "female";
export type MusicMood =
  | "energetic"
  | "luxury"
  | "emotional"
  | "corporate"
  | "modern"
  | "viral_tiktok";

// ─── AI ANALYSIS ─────────────────────────────
export interface ProductAnalysis {
  category: string;
  dominantColors: string[];
  style: VideoStyle;
  mood: string;
  targetDemographic: string;
  visualTags: string[];
  suggestedStyles: VideoStyle[];
  confidence: number;
}

// ─── SCRIPT ──────────────────────────────────
export interface ScriptOutput {
  headline: string;
  hook: string;
  voiceover: string;
  cta: string;
  hashtags: string[];
  benefits: string[];
  painPoints: string[];
  solutions: string[];
  marketingAngle: string;
}

// ─── STORYBOARD ──────────────────────────────
export type SceneType =
  | "OPENING"
  | "PRODUCT_SHOWCASE"
  | "BENEFITS"
  | "SOCIAL_PROOF"
  | "CTA";

export interface StoryboardScene {
  order: number;
  type: SceneType;
  title: string;
  description: string;
  duration: number;
  textOverlay?: string;
  transition?: string;
  cameraMove?: string;
  visualNote?: string;
}

export interface StoryboardOutput {
  totalDuration: number;
  scenes: StoryboardScene[];
}

// ─── VIDEO GENERATION ────────────────────────
export interface VideoGenerationInput {
  projectId: string;
  imageUrl: string;
  script: ScriptOutput;
  storyboard: StoryboardOutput;
  style: VideoStyle;
  format: VideoFormat;
  resolution: VideoResolution;
  voiceGender: VoiceGender;
  voiceLanguage: Language;
  musicMood: MusicMood;
  brandKit?: BrandKitConfig;
}

export interface VideoGenerationJob {
  jobId: string;
  provider: VideoProvider;
  status: "queued" | "processing" | "completed" | "failed";
  progress: number;
  videoUrl?: string;
  error?: string;
}

// ─── MARKETING COPY ──────────────────────────
export interface MarketingCopyOutput {
  language: Language;
  tiktokCaption: string;
  tiktokHooks: string[];
  tiktokHashtags: string[];
  instagramCaption: string;
  shopeeTitle: string;
  tokopediaTitle: string;
  productDesc: string;
  facebookAdsCopy: string;
  whatsappMessage: string;
}

// ─── BRAND KIT ───────────────────────────────
export interface BrandKitConfig {
  name: string;
  logoUrl?: string;
  colors: string[];
  fonts: string[];
  ctaText?: string;
  style: VideoStyle;
}

// ─── PROVIDER TYPES ──────────────────────────
export type TextProvider = "openai" | "claude" | "gemini";
export type VideoProvider = "runway" | "kling" | "pika" | "luma";

export interface ProviderConfig {
  text: TextProvider;
  video: VideoProvider;
}

// ─── CREATION STORE ──────────────────────────
export interface CreationState {
  currentStep: number;
  productName: string;
  productDesc: string;
  targetAudience: string;
  customPrompt: string;
  imageFile: File | null;
  imagePreview: string | null;
  imageUrl: string | null;
  style: VideoStyle;
  template: string | null;
  formats: VideoFormat[];
  resolution: VideoResolution;
  voiceGender: VoiceGender;
  voiceLanguage: Language;
  musicMood: MusicMood;
  projectId: string | null;
  analysis: ProductAnalysis | null;
  script: ScriptOutput | null;
  storyboard: StoryboardOutput | null;
  marketingCopy: MarketingCopyOutput | null;
  videoJobs: VideoGenerationJob[];
  isLoading: boolean;
  loadingStep: string | null;
  error: string | null;
}

// ─── TEMPLATE ────────────────────────────────
export interface TemplateConfig {
  style: VideoStyle;
  musicMood: MusicMood;
  colorPalette: string[];
  fontPairing: string[];
  sceneOrder: SceneType[];
  defaultDuration: number;
  transitions: string[];
}

export interface Template {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  style: VideoStyle;
  thumbnail: string;
  config: TemplateConfig;
  isPremium: boolean;
}

// ─── API RESPONSES ────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UploadResponse {
  imageUrl: string;
  imageKey: string;
}

export interface AnalyzeResponse {
  projectId: string;
  analysis: ProductAnalysis;
}
