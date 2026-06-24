// src/lib/ai/storyboardGenerator.ts
import { defaultTextProvider } from "./providers";
import type { StoryboardOutput, ScriptOutput, VideoStyle, ProductAnalysis } from "@/types";

export async function generateStoryboard(params: {
  script: ScriptOutput;
  style: VideoStyle;
  analysis: ProductAnalysis;
}): Promise<StoryboardOutput> {
  const provider = defaultTextProvider();

  const result = await provider.generate({
    systemPrompt: `You are a professional video director and storyboard artist specializing in product advertisements.
Create detailed scene-by-scene breakdowns for AI video generation.
Always respond with valid JSON only.`,

    userPrompt: `Create a 5-scene storyboard for this product ad.

Style: ${params.style}
Hook: ${params.script.hook}
Voiceover: ${params.script.voiceover}
CTA: ${params.script.cta}
Product Category: ${params.analysis.category}

Return JSON:
{
  "totalDuration": <total seconds 15-30>,
  "scenes": [
    {
      "order": 1,
      "type": "OPENING",
      "title": "scene title",
      "description": "detailed visual description for AI video generator",
      "duration": <seconds 2-6>,
      "textOverlay": "text shown on screen (optional)",
      "transition": "cut | fade | zoom | slide",
      "cameraMove": "zoom_in | zoom_out | pan_left | pan_right | static | orbit",
      "visualNote": "specific visual effect or emphasis note"
    },
    { "order": 2, "type": "PRODUCT_SHOWCASE", ... },
    { "order": 3, "type": "BENEFITS", ... },
    { "order": 4, "type": "SOCIAL_PROOF", ... },
    { "order": 5, "type": "CTA", ... }
  ]
}`,

    jsonMode: true,
  });

  return provider["parseJSON"](result.text) as StoryboardOutput;
}
