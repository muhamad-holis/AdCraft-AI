// src/app/api/templates/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const templates = await prisma.template.findMany({
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      category: true,
      isPremium: true,
      style: true,
    },
  });

  return NextResponse.json({ success: true, data: templates });
}
