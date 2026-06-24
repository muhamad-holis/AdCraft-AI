// src/app/api/video/status/[jobId]/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { createVideoProvider } from "@/lib/ai/video";
import type { VideoProvider } from "@/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const video = await prisma.video.findFirst({
    where: { externalId: jobId },
    include: { project: { include: { user: true } } },
  });

  if (!video || video.project.user.clerkId !== userId) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }

  if (!video.provider) {
    return NextResponse.json({ error: "No provider set" }, { status: 400 });
  }

  const provider = createVideoProvider(video.provider as VideoProvider);
  const status = await provider.getStatus(jobId);

  // update DB
  await prisma.video.update({
    where: { id: video.id },
    data: {
      status: status.status.toUpperCase() as any,
      progress: status.progress ?? video.progress,
      url: status.videoUrl ?? video.url,
    },
  });

  return NextResponse.json({ success: true, data: status });
}
