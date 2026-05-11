import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe, PRICING } from "@/lib/stripe";

const schema = z.object({
  jobId: z.string(),
  tier: z.enum(["BASIC", "FEATURED", "PREMIUM"]),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { jobId, tier } = parsed.data;

  // Verify the employer owns this job
  const employer = await prisma.employerProfile.findUnique({ where: { userId: session.user.id } });
  if (!employer) return NextResponse.json({ error: "Employer profile not found" }, { status: 403 });

  const job = await prisma.job.findFirst({
    where: { id: jobId, employerId: employer.id, status: "DRAFT" },
  });
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  const pricing = PRICING[tier];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: pricing.priceId, quantity: 1 }],
    metadata: { jobId, tier, employerUserId: session.user.id },
    success_url: `${appUrl}/employer/jobs/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/employer/jobs/new?cancelled=true`,
    customer_email: session.user.email ?? undefined,
    payment_intent_data: {
      metadata: { jobId, tier },
    },
  });

  // Record pending payment
  await prisma.payment.create({
    data: {
      stripeSessionId: checkoutSession.id,
      amountPence: pricing.amountPence,
      tier,
      status: "PENDING",
      employerUserId: session.user.id,
      jobId,
    },
  });

  // Link session to job
  await prisma.job.update({
    where: { id: jobId },
    data: { stripeSessionId: checkoutSession.id, tier },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
