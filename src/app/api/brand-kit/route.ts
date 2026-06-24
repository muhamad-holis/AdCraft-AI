// src/app/api/brand-kit/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ success: true, data: [] });

  const assets = await prisma.brandAsset.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, data: assets });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    user = await prisma.user.create({ data: { clerkId: userId, email: "" } });
  }

  const body = await req.json();

  const existingCount = await prisma.brandAsset.count({ where: { userId: user.id } });

  const asset = await prisma.brandAsset.create({
    data: {
      userId: user.id,
      name: body.name ?? "My Brand",
      colors: body.colors ?? [],
      fonts: body.fonts ?? [],
      ctaText: body.ctaText,
      style: body.style ?? "MODERN",
      isDefault: existingCount === 0,
    },
  });

  return NextResponse.json({ success: true, data: asset });
}
