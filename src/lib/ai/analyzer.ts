// src/lib/ai/analyzer.ts
import { defaultTextProvider } from "./providers";
import type { ProductAnalysis } from "@/types";

export async function analyzeProduct(
  imageUrl: string,
  productName: string,
  productDesc: string
): Promise<ProductAnalysis> {
  const provider = defaultTextProvider();

  const result = await provider.generate({
    systemPrompt: `You are an expert AI product analyst and visual marketing strategist.
Analyze product images and return structured JSON data for video ad generation.
Always respond with valid JSON only, no markdown fences.`,

    userPrompt: `Analyze this product image for advertising purposes.

Product Name: ${productName}
Description: ${productDesc}

Return a JSON object with this exact structure:
{
  "category": "string (e.g. Electronics, Fashion, Beauty, Food, etc)",
  "dominantColors": ["#hex1", "#hex2", "#hex3"],
  "style": "LUXURY | VIRAL_TIKTOK | CINEMATIC | EMOTIONAL | PREMIUM | MINIMALIST | AGGRESSIVE_SALES | DIRECT_RESPONSE | MODERN",
  "mood": "string describing visual mood",
  "targetDemographic": "string",
  "visualTags": ["tag1", "tag2", "tag3"],
  "suggestedStyles": ["STYLE1", "STYLE2"],
  "confidence": 0.0-1.0
}`,

    imageUrl,
    jsonMode: true,
  });

  return provider["parseJSON"](result.text) as ProductAnalysis;
}
