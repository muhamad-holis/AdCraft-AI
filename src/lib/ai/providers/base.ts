// src/lib/ai/providers/base.ts

export interface TextProviderConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface TextGenerationInput {
  systemPrompt: string;
  userPrompt: string;
  imageBase64?: string;   // for vision models
  imageUrl?: string;
  jsonMode?: boolean;
}

export interface TextGenerationOutput {
  text: string;
  inputTokens?: number;
  outputTokens?: number;
  model: string;
  provider: string;
}

export abstract class BaseTextProvider {
  abstract readonly name: string;
  abstract readonly model: string;

  abstract generate(input: TextGenerationInput): Promise<TextGenerationOutput>;

  protected parseJSON<T>(text: string): T {
    // strip markdown fences if present
    const clean = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
    return JSON.parse(clean) as T;
  }
}
