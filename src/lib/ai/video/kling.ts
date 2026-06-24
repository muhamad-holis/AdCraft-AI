// src/lib/ai/video/kling.ts
import { BaseVideoProvider, VideoGenerationRequest, VideoGenerationResponse } from "./base";

export class KlingProvider extends BaseVideoProvider {
  readonly name = "kling";
  private apiKey: string;
  private baseUrl = "https://api.klingai.com/v1";

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  async submitJob(req: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    const res = await fetch(`${this.baseUrl}/videos/image2video`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model_name: "kling-v1-5",
        image: req.imageUrl,
        prompt: req.prompt,
        duration: req.duration,
        aspect_ratio: req.aspectRatio,
        cfg_scale: 0.5,
      }),
    });

    const data = await res.json();
    return { jobId: data.data.task_id, provider: this.name, status: "queued" };
  }

  async getStatus(jobId: string): Promise<VideoGenerationResponse> {
    const res = await fetch(`${this.baseUrl}/videos/image2video/${jobId}`, {
      headers: { Authorization: `Bearer ${this.apiKey}` },
    });

    const data = await res.json();
    const task = data.data;

    const statusMap: Record<string, VideoGenerationResponse["status"]> = {
      submitted: "queued",
      processing: "processing",
      succeed: "completed",
      failed: "failed",
    };

    return {
      jobId,
      provider: this.name,
      status: statusMap[task.task_status] ?? "processing",
      progress: task.task_status === "processing" ? 50 : task.task_status === "succeed" ? 100 : 0,
      videoUrl: task.task_result?.videos?.[0]?.url,
      error: task.task_status_msg,
    };
  }
}
