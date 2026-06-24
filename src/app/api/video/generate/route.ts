// src/app/api/video/generate/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { createVideoProvider } from "@/lib/ai/video";
import type { VideoFormat, VideoProvider } from "@/types";

const FORMAT_ASPECT: Record<VideoFormat, "9:16" | "1:1" | "16:9"> = {
  TIKTOK_916: "9:16",
  INSTAGRAM_11: "1:1",
  YOUTUBE_169: "16:9",
};

function buildVideoPrompt(
  script: { hook: string; voiceover: string; cta: string },
  style: string,
  mood: string
): string {
  return `${style.replace("_", " ")} style product advertisement. ${script.hook}. ${script.voiceover}. ${mood} music atmosphere. Professional product showcase with dynamic camera movement, clean backgrounds, cinematic lighting. End with strong CTA: ${script.cta}.`;
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId, formats, resolution, videoProvider, musicMood } = await req.json();

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { user: true, script: true, storyboard: { include: { scenes: true } } },
  });

  if (!project || project.user.clerkId !== userId) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  if (!project.script) {
    return NextResponse.json({ error: "Script not generated yet" }, { status: 400 });
  }

  if (!project.imageUrl) {
    return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
  }

  const provider = createVideoProvider((videoProvider ?? "runway") as VideoProvider);
  const imageUrl = project.imageUrl;

  const jobs = await Promise.all(
    (formats as VideoFormat[]).map(async (format) => {
      const prompt = buildVideoPrompt(project.script!, project.style, musicMood);

      const job = await provider.submitJob({
        imageUrl,
        prompt,
        duration: 15,
        aspectRatio: FORMAT_ASPECT[format],
        style: project.style,
        cameraMotion: "zoom_in",
      });

      const video = await prisma.video.create({
        data: {
          projectId,
          format,
          resolution: resolution ?? "FHD_1080P",
          status: "QUEUED",
          provider: provider.name,
          externalId: job.jobId,
        },
      });

      return { videoId: video.id, jobId: job.jobId, format };
    })
  );

  // deduct 1 credit
  await prisma.user.update({
    where: { id: project.user.id },
    data: { credits: { decrement: 1 }, totalVideos: { increment: 1 } },
  });

  return NextResponse.json({ success: true, data: { jobs } });
}
