// src/lib/ai/video/index.ts
import { BaseVideoProvider } from "./base";
import { RunwayProvider } from "./runway";
import { KlingProvider } from "./kling";
import { PikaProvider } from "./pika";
import { LumaProvider } from "./luma";
import type { VideoProvider } from "@/types";

export type { BaseVideoProvider };
export * from "./base";

export function createVideoProvider(provider: VideoProvider): BaseVideoProvider {
  switch (provider) {
    case "runway":
      return new RunwayProvider(process.env.RUNWAY_API_KEY!);
    case "kling":
      return new KlingProvider(process.env.KLING_API_KEY!);
    case "pika":
      return new PikaProvider(process.env.PIKA_API_KEY!);
    case "luma":
      return new LumaProvider(process.env.LUMA_API_KEY!);
    default:
      throw new Error(`Unknown video provider: ${provider}`);
  }
}

export const defaultVideoProvider = (): BaseVideoProvider =>
  createVideoProvider(
    (process.env.DEFAULT_VIDEO_PROVIDER as VideoProvider) ?? "runway"
  );
