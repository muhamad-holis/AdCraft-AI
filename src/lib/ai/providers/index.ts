// src/lib/ai/providers/index.ts
import { BaseTextProvider } from "./base";
import { ClaudeProvider } from "./claude";
import { OpenAIProvider } from "./openai";
import { GeminiProvider } from "./gemini";
import type { TextProvider } from "@/types";

export type { BaseTextProvider };

export function createTextProvider(provider: TextProvider): BaseTextProvider {
  switch (provider) {
    case "claude":
      return new ClaudeProvider(process.env.ANTHROPIC_API_KEY!);
    case "openai":
      return new OpenAIProvider(process.env.OPENAI_API_KEY!);
    case "gemini":
      return new GeminiProvider(process.env.GOOGLE_AI_API_KEY!);
    default:
      throw new Error(`Unknown text provider: ${provider}`);
  }
}

export const defaultTextProvider = (): BaseTextProvider =>
  createTextProvider(
    (process.env.DEFAULT_AI_PROVIDER as TextProvider) ?? "claude"
  );
