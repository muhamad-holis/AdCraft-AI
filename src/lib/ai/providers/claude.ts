// src/lib/ai/providers/claude.ts
import Anthropic from "@anthropic-ai/sdk";
import {
  BaseTextProvider,
  TextGenerationInput,
  TextGenerationOutput,
} from "./base";

export class ClaudeProvider extends BaseTextProvider {
  readonly name = "claude";
  readonly model: string;
  private client: Anthropic;

  constructor(apiKey: string, model = "claude-sonnet-4-6") {
    super();
    this.model = model;
    this.client = new Anthropic({ apiKey });
  }

  async generate(input: TextGenerationInput): Promise<TextGenerationOutput> {
    const userContent: Anthropic.MessageParam["content"] = [];

    // attach image if provided
    if (input.imageBase64) {
      userContent.push({
        type: "image",
        source: {
          type: "base64",
          media_type: "image/jpeg",
          data: input.imageBase64,
        },
      });
    } else if (input.imageUrl) {
      const res = await fetch(input.imageUrl);
      const arrayBuffer = await res.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const mimeType = (res.headers.get("content-type") ?? "image/jpeg") as
        | "image/jpeg"
        | "image/png"
        | "image/gif"
        | "image/webp";
      userContent.push({
        type: "image",
        source: {
          type: "base64",
          media_type: mimeType,
          data: base64,
        },
      });
    }

    userContent.push({ type: "text", text: input.userPrompt });

    const msg = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: input.systemPrompt,
      messages: [{ role: "user", content: userContent }],
    });

    const textBlock = msg.content.find((b) => b.type === "text");
    const text = textBlock && textBlock.type === "text" ? textBlock.text : "";

    return {
      text,
      inputTokens: msg.usage.input_tokens,
      outputTokens: msg.usage.output_tokens,
      model: this.model,
      provider: this.name,
    };
  }
}
