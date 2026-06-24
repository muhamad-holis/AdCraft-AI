// src/app/api/marketing-copy/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { generateMarketingCopy } from "@/lib/ai/marketingCopyGenerator";
import type { Language, ProductAnalysis, ScriptOutput } from "@/types";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId, language } = await req.json();

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { user: true, script: true },
  });

  if (!project || project.user.clerkId !== userId) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  if (!project.script) {
    return NextResponse.json({ error: "Generate script first" }, { status: 400 });
  }

  const analysis = project.analysis as unknown as ProductAnalysis;

  const copy = await generateMarketingCopy({
    productName: project.productName,
    productDesc: project.productDesc,
    script: project.script as unknown as ScriptOutput,
    analysis,
    language: (language ?? "INDONESIAN") as Language,
  });

  await prisma.marketingCopy.upsert({
    where: { projectId },
    create: { projectId, ...copy },
    update: { ...copy },
  });

  return NextResponse.json({ success: true, data: copy });
}
