// src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db/prisma";
import type Stripe from "stripe";

const PLAN_CREDITS: Record<string, number> = {
  STARTER: 20,
  PRO: 100,
  AGENCY: 500,
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan as "STARTER" | "PRO" | "AGENCY" | undefined;
        const interval = session.metadata?.interval as "MONTHLY" | "YEARLY" | undefined;

        if (!userId || !plan) break;

        await prisma.user.update({
          where: { id: userId },
          data: {
            plan,
            credits: { increment: PLAN_CREDITS[plan] ?? 0 },
          },
        });

        await prisma.payment.create({
          data: {
            userId,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            stripeSessionId: session.id,
            amount: session.amount_total ?? 0,
            currency: session.currency ?? "usd",
            plan,
            status: "COMPLETED",
            interval,
          },
        });
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const payment = await prisma.payment.findFirst({
          where: { stripeSubscriptionId: sub.id },
        });
        if (!payment) break;

        const status = sub.status === "active" ? "COMPLETED" : "PENDING";
        await prisma.payment.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: { status },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const payment = await prisma.payment.findFirst({
          where: { stripeSubscriptionId: sub.id },
        });
        if (!payment) break;

        await prisma.user.update({
          where: { id: payment.userId },
          data: { plan: "FREE" },
        });

        await prisma.payment.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: { status: "CANCELLED" },
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const payment = await prisma.payment.findFirst({
          where: { stripeSubscriptionId: invoice.subscription as string },
        });
        if (!payment) break;

        await prisma.payment.updateMany({
          where: { stripeSubscriptionId: invoice.subscription as string },
          data: { status: "FAILED" },
        });
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
