// src/app/api/analyze/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { analyzeProduct } from "@/lib/ai/analyzer";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { imageUrl, imageKey, productName, productDesc, targetAudience, customPrompt, style, template } = body;

  // get or create db user
  let user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    user = await prisma.user.create({
      data: { clerkId: userId, email: body.email ?? "" },
    });
  }

  // check credits
  if (user.credits <= 0) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  // create project
  const project = await prisma.project.create({
    data: {
      userId: user.id,
      name: productName,
      productName,
      productDesc,
      targetAudience,
      customPrompt,
      style: style ?? "MODERN",
      template,
      imageUrl,
      imageKey,
      status: "ANALYZING",
    },
  });

  // run analysis
  const analysis = await analyzeProduct(imageUrl, productName, productDesc);

  await prisma.project.update({
    where: { id: project.id },
    data: { analysis: analysis as any, status: "SCRIPTING" },
  });

  return NextResponse.json({
    success: true,
    data: { projectId: project.id, analysis },
  });
}
