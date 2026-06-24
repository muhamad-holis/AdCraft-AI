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

// ──────────────────────────────────────────────
// src/app/api/brand-kit/[id]/route.ts
// ──────────────────────────────────────────────
import { auth as auth2 } from "@clerk/nextjs/server";
import { NextRequest as NR2, NextResponse as NRes2 } from "next/server";
import { prisma as db2 } from "@/lib/db/prisma";

export async function PATCH(
  req: NR2,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth2();
  if (!userId) return NRes2.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db2.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NRes2.json({ error: "User not found" }, { status: 404 });

  const asset = await db2.brandAsset.findFirst({
    where: { id: params.id, userId: user.id },
  });
  if (!asset) return NRes2.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();

  const updated = await db2.brandAsset.update({
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

  return NRes2.json({ success: true, data: updated });
}

export async function DELETE(
  _req: NR2,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth2();
  if (!userId) return NRes2.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db2.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NRes2.json({ error: "User not found" }, { status: 404 });

  const asset = await db2.brandAsset.findFirst({
    where: { id: params.id, userId: user.id },
  });
  if (!asset) return NRes2.json({ error: "Not found" }, { status: 404 });

  await db2.brandAsset.delete({ where: { id: params.id } });

  return NRes2.json({ success: true });
}
