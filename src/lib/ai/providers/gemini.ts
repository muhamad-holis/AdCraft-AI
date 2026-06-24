// src/lib/ai/providers/gemini.ts
import {
  GoogleGenerativeAI,
  Part,
} from "@google/generative-ai";
import {
  BaseTextProvider,
  TextGenerationInput,
  TextGenerationOutput,
} from "./base";

export class GeminiProvider extends BaseTextProvider {
  readonly name = "gemini";
  readonly model: string;
  private client: GoogleGenerativeAI;

  constructor(apiKey: string, model = "gemini-1.5-pro") {
    super();
    this.model = model;
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async generate(input: TextGenerationInput): Promise<TextGenerationOutput> {
    const genModel = this.client.getGenerativeModel({
      model: this.model,
      systemInstruction: input.systemPrompt,
    });

    const parts: Part[] = [];

    if (input.imageBase64) {
      parts.push({
        inlineData: { mimeType: "image/jpeg", data: input.imageBase64 },
      });
    }

    parts.push({ text: input.userPrompt });

    const result = await genModel.generateContent(parts);
    const text = result.response.text();

    return {
      text,
      model: this.model,
      provider: this.name,
    };
  }
}
