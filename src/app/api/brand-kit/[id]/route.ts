// src/app/api/brand-kit/[id]/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const asset = await prisma.brandAsset.findFirst({
    where: { id: params.id, userId: user.id },
  });
  if (!asset) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();

  const updated = await prisma.brandAsset.update({
    where: { id: params.id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.logoUrl !== undefined && { logoUrl: body.logoUrl }),
      ...(body.colors !== undefined && { colors: body.colors }),
      ...(body.fonts !== undefined && { fonts: body.fonts }),
      ...(body.ctaText !== undefined && { ctaText: body.ctaText }),
      ...(body.style !== undefined && { style: body.style }),
    },
  });

  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const asset = await prisma.brandAsset.findFirst({
    where: { id: params.id, userId: user.id },
  });
  if (!asset) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.brandAsset.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
