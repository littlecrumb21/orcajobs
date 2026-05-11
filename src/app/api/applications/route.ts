import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { email } from "@/lib/email";

const schema = z.object({
  jobId: z.string(),
  coverLetter: z.string().max(4000).optional(),
  useProfileCv: z.boolean().optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const profile = await prisma.applicantProfile.findUnique({ where: { userId: session.user.id } });
  if (!profile) return NextResponse.json({ error: "No applicant profile" }, { status: 403 });

  const job = await prisma.job.findUnique({
    where: { id: parsed.data.jobId, status: "ACTIVE" },
    include: { employer: { include: { user: true } } },
  });
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  // Prevent duplicate applications
  const existing = await prisma.application.findUnique({
    where: { jobId_applicantId: { jobId: job.id, applicantId: profile.id } },
  });
  if (existing) return NextResponse.json({ error: "Already applied" }, { status: 409 });

  const application = await prisma.application.create({
    data: {
      jobId: job.id,
      applicantId: profile.id,
      coverLetter: parsed.data.coverLetter,
      cvUrl: parsed.data.useProfileCv ? profile.cvUrl ?? undefined : undefined,
    },
  });

  // Email notifications (best-effort)
  const fullName = `${profile.firstName} ${profile.lastName}`;
  await Promise.allSettled([
    email.applicationConfirm(session.user.email!, job.title, job.employer.companyName),
    email.applicationReceived(job.employer.user.email!, job.title, fullName),
  ]);

  return NextResponse.json(application, { status: 201 });
}
