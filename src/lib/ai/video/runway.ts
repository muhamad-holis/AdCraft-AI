// src/lib/ai/video/runway.ts
import { BaseVideoProvider, VideoGenerationRequest, VideoGenerationResponse } from "./base";

export class RunwayProvider extends BaseVideoProvider {
  readonly name = "runway";
  private apiKey: string;
  private baseUrl = "https://api.dev.runwayml.com/v1";

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  async submitJob(req: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    const res = await fetch(`${this.baseUrl}/image_to_video`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
        "X-Runway-Version": "2024-11-06",
      },
      body: JSON.stringify({
        model: "gen3a_turbo",
        promptImage: req.imageUrl,
        promptText: req.prompt,
        ratio: req.aspectRatio === "9:16" ? "720:1280" : req.aspectRatio === "1:1" ? "1280:1280" : "1280:720",
        duration: req.duration,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(`Runway error: ${JSON.stringify(err)}`);
    }

    const data = await res.json();
    return { jobId: data.id, provider: this.name, status: "queued" };
  }

  async getStatus(jobId: string): Promise<VideoGenerationResponse> {
    const res = await fetch(`${this.baseUrl}/tasks/${jobId}`, {
      headers: { Authorization: `Bearer ${this.apiKey}`, "X-Runway-Version": "2024-11-06" },
    });

    const data = await res.json();

    const statusMap: Record<string, VideoGenerationResponse["status"]> = {
      PENDING: "queued",
      RUNNING: "processing",
      SUCCEEDED: "completed",
      FAILED: "failed",
      CANCELLED: "failed",
    };

    return {
      jobId,
      provider: this.name,
      status: statusMap[data.status] ?? "processing",
      progress: data.progress ? Math.round(data.progress * 100) : 0,
      videoUrl: data.output?.[0] ?? undefined,
      error: data.failure ?? undefined,
    };
  }
}
