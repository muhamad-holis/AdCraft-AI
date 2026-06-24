// src/lib/ai/video/base.ts

export interface VideoGenerationRequest {
  imageUrl: string;
  prompt: string;
  duration: number;       // seconds
  aspectRatio: "9:16" | "1:1" | "16:9";
  style: string;
  cameraMotion?: string;
}

export interface VideoGenerationResponse {
  jobId: string;
  provider: string;
  status: "queued" | "processing" | "completed" | "failed";
  progress?: number;
  videoUrl?: string;
  error?: string;
}

export abstract class BaseVideoProvider {
  abstract readonly name: string;

  abstract submitJob(req: VideoGenerationRequest): Promise<VideoGenerationResponse>;
  abstract getStatus(jobId: string): Promise<VideoGenerationResponse>;
}
