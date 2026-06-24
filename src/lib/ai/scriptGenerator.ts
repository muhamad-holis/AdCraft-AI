// src/lib/ai/scriptGenerator.ts
import { defaultTextProvider } from "./providers";
import type { ScriptOutput, VideoStyle, Language, ProductAnalysis } from "@/types";

export async function generateScript(params: {
  productName: string;
  productDesc: string;
  targetAudience: string;
  customPrompt?: string;
  style: VideoStyle;
  language: Language;
  analysis: ProductAnalysis;
}): Promise<ScriptOutput> {
  const provider = defaultTextProvider();

  const langLabel = params.language === "INDONESIAN" ? "Bahasa Indonesia" : "English";

  const result = await provider.generate({
    systemPrompt: `You are a world-class performance marketing copywriter specializing in short-form video ads.
You write high-converting scripts for TikTok, Instagram Reels, and YouTube Shorts.
Always respond with valid JSON only.`,

    userPrompt: `Write a complete video ad script.

Language: ${langLabel}
Product: ${params.productName}
Description: ${params.productDesc}
Target Audience: ${params.targetAudience}
Style: ${params.style}
${params.customPrompt ? `Custom Direction: ${params.customPrompt}` : ""}

Product Analysis:
- Category: ${params.analysis.category}
- Mood: ${params.analysis.mood}
- Target Demo: ${params.analysis.targetDemographic}

Return JSON:
{
  "headline": "main headline (max 10 words)",
  "hook": "opening hook line that grabs attention in first 3 seconds",
  "voiceover": "full voiceover script for 15-30 second video",
  "cta": "call-to-action text (max 8 words)",
  "hashtags": ["hashtag1", "hashtag2", ...],
  "benefits": ["benefit1", "benefit2", "benefit3"],
  "painPoints": ["pain1", "pain2"],
  "solutions": ["solution1", "solution2"],
  "marketingAngle": "the core marketing angle/positioning"
}`,

    jsonMode: true,
  });

  return provider["parseJSON"](result.text) as ScriptOutput;
}
