import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { email } from "@/lib/email";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  const job = await prisma.job.update({
    where: { id },
    data: { status: "ACTIVE", publishedAt: new Date() },
    include: { employer: { include: { user: true } } },
  });

  await prisma.moderationLog.create({
    data: { entityType: "job", entityId: id, action: "approved", adminId: session!.user!.id! },
  });

  await email.jobApproved(job.employer.user.email!, job.title).catch(() => {});

  return NextResponse.redirect(new URL("/admin", process.env.NEXT_PUBLIC_APP_URL!));
}
