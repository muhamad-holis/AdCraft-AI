// src/app/api/script/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { generateScript } from "@/lib/ai/scriptGenerator";
import { generateStoryboard } from "@/lib/ai/storyboardGenerator";
import type { ProductAnalysis } from "@/types";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId, language } = await req.json();

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { user: true },
  });

  if (!project || project.user.clerkId !== userId) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const analysis = project.analysis as unknown as ProductAnalysis;

  // Generate script
  const script = await generateScript({
    productName: project.productName,
    productDesc: project.productDesc,
    targetAudience: project.targetAudience,
    customPrompt: project.customPrompt ?? undefined,
    style: project.style,
    language: language ?? "INDONESIAN",
    analysis,
  });

  // Generate storyboard
  const storyboard = await generateStoryboard({ script, style: project.style, analysis });

  // Save to DB
  await prisma.script.upsert({
    where: { projectId },
    create: { projectId, ...script },
    update: { ...script },
  });

  const sb = await prisma.storyboard.upsert({
    where: { projectId },
    create: { projectId },
    update: {},
  });

  // save scenes
  await prisma.scene.deleteMany({ where: { storyboardId: sb.id } });
  await prisma.scene.createMany({
    data: storyboard.scenes.map((s) => ({ storyboardId: sb.id, ...s })),
  });

  await prisma.project.update({ where: { id: projectId }, data: { status: "GENERATING" } });

  return NextResponse.json({ success: true, data: { script, storyboard } });
}
