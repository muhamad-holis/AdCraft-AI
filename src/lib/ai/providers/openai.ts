// src/lib/ai/providers/openai.ts
import OpenAI from "openai";
import {
  BaseTextProvider,
  TextGenerationInput,
  TextGenerationOutput,
} from "./base";

export class OpenAIProvider extends BaseTextProvider {
  readonly name = "openai";
  readonly model: string;
  private client: OpenAI;

  constructor(apiKey: string, model = "gpt-4o") {
    super();
    this.model = model;
    this.client = new OpenAI({ apiKey });
  }

  async generate(input: TextGenerationInput): Promise<TextGenerationOutput> {
    const userContent: OpenAI.ChatCompletionUserMessageParam["content"] = [];

    if (input.imageUrl) {
      userContent.push({
        type: "image_url",
        image_url: { url: input.imageUrl, detail: "high" },
      });
    } else if (input.imageBase64) {
      userContent.push({
        type: "image_url",
        image_url: {
          url: `data:image/jpeg;base64,${input.imageBase64}`,
          detail: "high",
        },
      });
    }

    userContent.push({ type: "text", text: input.userPrompt });

    const completion = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: 4096,
      response_format: input.jsonMode ? { type: "json_object" } : undefined,
      messages: [
        { role: "system", content: input.systemPrompt },
        { role: "user", content: userContent },
      ],
    });

    const text = completion.choices[0]?.message?.content ?? "";

    return {
      text,
      inputTokens: completion.usage?.prompt_tokens,
      outputTokens: completion.usage?.completion_tokens,
      model: this.model,
      provider: this.name,
    };
  }
}
