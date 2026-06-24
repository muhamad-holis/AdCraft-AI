// src/app/api/billing/checkout/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { stripe, PLANS } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan, interval } = await req.json();

  if (!["STARTER", "PRO", "AGENCY"].includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  let user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    user = await prisma.user.create({ data: { clerkId: userId, email: "" } });
  }

  const planConfig = PLANS[plan as keyof typeof PLANS];
  const priceId = interval === "YEARLY" ? planConfig.yearly : planConfig.monthly;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?canceled=true`,
    customer_email: user.email || undefined,
    metadata: { userId: user.id, plan, interval: interval ?? "MONTHLY" },
  });

  return NextResponse.json({ url: session.url });
}
