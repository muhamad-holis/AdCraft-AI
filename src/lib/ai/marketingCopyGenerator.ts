// src/lib/ai/marketingCopyGenerator.ts
import { defaultTextProvider } from "./providers";
import type { MarketingCopyOutput, ScriptOutput, ProductAnalysis, Language } from "@/types";

export async function generateMarketingCopy(params: {
  productName: string;
  productDesc: string;
  script: ScriptOutput;
  analysis: ProductAnalysis;
  language: Language;
}): Promise<MarketingCopyOutput> {
  const provider = defaultTextProvider();

  const isID = params.language === "INDONESIAN";
  const langLabel = isID ? "Bahasa Indonesia" : "English";

  const result = await provider.generate({
    systemPrompt: `You are an expert digital marketing copywriter specializing in the ${isID ? "Indonesian" : "global"} e-commerce market.
You write high-converting copy for TikTok, Instagram, Shopee, Tokopedia, Facebook, and WhatsApp.
Always respond with valid JSON only.`,

    userPrompt: `Generate complete marketing copy package.

Language: ${langLabel}
Product: ${params.productName}
Description: ${params.productDesc}
Marketing Angle: ${params.script.marketingAngle}
Benefits: ${params.script.benefits.join(", ")}
Hashtags: ${params.script.hashtags.join(", ")}

Return JSON:
{
  "language": "${params.language}",
  "tiktokCaption": "engaging TikTok caption with emojis (max 150 chars)",
  "tiktokHooks": ["hook1", "hook2", "hook3"],
  "tiktokHashtags": ["#tag1", "#tag2", ...],
  "instagramCaption": "Instagram caption with line breaks and emojis",
  "shopeeTitle": "Shopee product title optimized for search (max 100 chars)",
  "tokopediaTitle": "Tokopedia product title optimized for search (max 100 chars)",
  "productDesc": "Full product description for marketplace (300-500 words)",
  "facebookAdsCopy": "Facebook/Meta Ads primary text (max 250 chars)",
  "whatsappMessage": "WhatsApp marketing broadcast message (conversational tone)"
}`,

    jsonMode: true,
  });

  return provider["parseJSON"](result.text) as MarketingCopyOutput;
}
