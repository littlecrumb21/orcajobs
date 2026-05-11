import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";

const createSchema = z.object({
  employerId: z.string(),
  title: z.string().min(3).max(120),
  category: z.string(),
  contractType: z.string(),
  workType: z.string(),
  location: z.string(),
  description: z.string().min(50),
  summary: z.string().max(200).optional(),
  salaryMin: z.coerce.number().optional(),
  salaryMax: z.coerce.number().optional(),
  salaryPeriod: z.string().optional(),
  salaryPublic: z.boolean().optional(),
  tier: z.enum(["BASIC", "FEATURED", "PREMIUM"]).optional(),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));

  const jobs = await prisma.job.findMany({
    where: {
      status: "ACTIVE",
      ...(q && { OR: [{ title: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] }),
      ...(category && { category }),
    },
    include: { employer: { select: { companyName: true, logoUrl: true, verified: true } } },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    take: 20,
    skip: (page - 1) * 20,
  });

  return NextResponse.json(jobs);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.issues }, { status: 400 });
  }

  // Verify employer owns this profile
  const employer = await prisma.employerProfile.findFirst({
    where: { id: parsed.data.employerId, userId: session.user.id },
  });
  if (!employer) return NextResponse.json({ error: "Employer profile not found" }, { status: 403 });

  const baseSlug = slugify(parsed.data.title, { lower: true, strict: true });
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

  const job = await prisma.job.create({
    data: {
      employerId: employer.id,
      title: parsed.data.title,
      slug,
      category: parsed.data.category,
      contractType: parsed.data.contractType,
      workType: parsed.data.workType,
      location: parsed.data.location,
      description: parsed.data.description,
      summary: parsed.data.summary,
      salaryMin: parsed.data.salaryMin,
      salaryMax: parsed.data.salaryMax,
      salaryPeriod: parsed.data.salaryPeriod ?? "year",
      salaryPublic: parsed.data.salaryPublic ?? true,
      tier: parsed.data.tier ?? "BASIC",
      status: "DRAFT",
    },
  });

  return NextResponse.json(job, { status: 201 });
}
