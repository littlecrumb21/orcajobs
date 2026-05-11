import { NextResponse } from "next/server";
import { stripe, PRICING } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { email } from "@/lib/email";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { jobId, tier, employerUserId } = session.metadata ?? {};

    if (!jobId || !tier) return NextResponse.json({ ok: true });

    const tierKey = tier as keyof typeof PRICING;
    const pricing = PRICING[tierKey];
    const now = new Date();
    const expiresAt = new Date(now.getTime() + pricing.days * 86400000);

    // Activate job (PENDING — goes to admin moderation queue)
    const job = await prisma.job.update({
      where: { id: jobId },
      data: {
        status: "PENDING",
        tier: tierKey,
        featured: tier !== "BASIC",
        paidAt: now,
        expiresAt,
      },
      include: { employer: { include: { user: true } } },
    });

    // Mark payment as paid
    await prisma.payment.updateMany({
      where: { stripeSessionId: session.id },
      data: { status: "PAID", paidAt: now, stripePaymentIntent: session.payment_intent as string ?? undefined },
    });

    // Notify employer
    await email.jobApproved(job.employer.user.email!, job.title).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}

// Stripe needs raw body — disable Next.js body parsing
export const config = { api: { bodyParser: false } };
