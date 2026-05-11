import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  firstName: z.string().min(1).max(60),
  lastName: z.string().max(60),
  phone: z.string().max(30).optional(),
  location: z.string().max(100).optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  headline: z.string().max(140).optional(),
  bio: z.string().max(2000).optional(),
  jobTitle: z.string().max(100).optional(),
  salaryMin: z.coerce.number().optional(),
  salaryMax: z.coerce.number().optional(),
  availability: z.string().optional(),
  workTypes: z.string().optional(),
  rightToWork: z.string().optional(),
  skills: z.string().optional(),
  cvUrl: z.string().optional(),
  cvFileName: z.string().optional(),
  marketingConsent: z.boolean().optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const existing = await prisma.applicantProfile.findUnique({ where: { userId: session.user.id } });

  const data = {
    ...parsed.data,
    linkedinUrl: parsed.data.linkedinUrl || null,
    dataConsentDate: existing?.dataConsentDate ?? new Date(),
    cvUploadedAt: parsed.data.cvUrl && parsed.data.cvUrl !== existing?.cvUrl ? new Date() : undefined,
  };

  const profile = await prisma.applicantProfile.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, ...data },
    update: data,
  });

  return NextResponse.json(profile);
}
