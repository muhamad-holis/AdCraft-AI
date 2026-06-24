// src/app/api/webhooks/clerk/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/db/prisma";

interface ClerkUserEvent {
  type: string;
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
  };
}

export async function POST(req: NextRequest) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const headerPayload = req.headers;
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(secret);

  let evt: ClerkUserEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkUserEvent;
  } catch (err) {
    console.error("Clerk webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (evt.type) {
      case "user.created": {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;
        const email = email_addresses[0]?.email_address ?? "";
        const name = [first_name, last_name].filter(Boolean).join(" ") || null;

        await prisma.user.upsert({
          where: { clerkId: id },
          create: {
            clerkId: id,
            email,
            name,
            avatarUrl: image_url,
            credits: 3,
            plan: "FREE",
          },
          update: { email, name, avatarUrl: image_url },
        });
        break;
      }

      case "user.updated": {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;
        const email = email_addresses[0]?.email_address ?? "";
        const name = [first_name, last_name].filter(Boolean).join(" ") || null;

        await prisma.user.updateMany({
          where: { clerkId: id },
          data: { email, name, avatarUrl: image_url },
        });
        break;
      }

      case "user.deleted": {
        const { id } = evt.data;
        await prisma.user.deleteMany({ where: { clerkId: id } });
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Clerk webhook handler error:", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
}
