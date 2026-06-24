// src/lib/ai/video/luma.ts
import { BaseVideoProvider, VideoGenerationRequest, VideoGenerationResponse } from "./base";

export class LumaProvider extends BaseVideoProvider {
  readonly name = "luma";
  private apiKey: string;
  private baseUrl = "https://api.lumalabs.ai/dream-machine/v1";

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  async submitJob(req: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    const res = await fetch(`${this.baseUrl}/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        prompt: req.prompt,
        keyframes: {
          frame0: { type: "image", url: req.imageUrl },
        },
        aspect_ratio: req.aspectRatio,
        loop: false,
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
      status: data.state === "completed" ? "completed" : data.state === "failed" ? "failed" : "processing",
      progress: data.state === "completed" ? 100 : 50,
      videoUrl: data.assets?.video,
      error: data.failure_reason,
    };
  }
}
