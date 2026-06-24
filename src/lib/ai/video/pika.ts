// src/lib/ai/video/pika.ts
import { BaseVideoProvider, VideoGenerationRequest, VideoGenerationResponse } from "./base";

export class PikaProvider extends BaseVideoProvider {
  readonly name = "pika";
  private apiKey: string;
  private baseUrl = "https://api.pika.art/v1";

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  async submitJob(req: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    const res = await fetch(`${this.baseUrl}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        image: req.imageUrl,
        promptText: req.prompt,
        options: {
          aspectRatio: req.aspectRatio,
          duration: req.duration,
        },
      }),
    });

    const data = await res.json();
    return { jobId: data.id, provider: this.name, status: "queued" };
  }

  async getStatus(jobId: string): Promise<VideoGenerationResponse> {
    const res = await fetch(`${this.baseUrl}/generations/${jobId}`, {
      headers: { Authorization: `Bearer ${this.apiKey}` },
    });

    const data = await res.json();

    return {
      jobId,
      provider: this.name,
      status: data.status === "finished" ? "completed" : data.status === "failed" ? "failed" : "processing",
      progress: data.status === "finished" ? 100 : 50,
      videoUrl: data.resultUrl,
    };
  }
}
