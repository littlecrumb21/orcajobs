import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { email } from "@/lib/email";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  role: z.enum(["APPLICANT", "EMPLOYER"]),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  const { name, email: emailAddr, password, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email: emailAddr } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const hash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email: emailAddr,
      password: hash,
      role,
    },
  });

  // Seed an empty profile for the new user
  if (role === "APPLICANT") {
    await prisma.applicantProfile.create({
      data: {
        userId: user.id,
        firstName: name.split(" ")[0] ?? name,
        lastName: name.split(" ").slice(1).join(" ") || "",
        dataConsentDate: new Date(),
      },
    });
    await email.welcome(emailAddr, name).catch(() => {});
  } else {
    await prisma.employerProfile.create({
      data: {
        userId: user.id,
        companyName: name,
        companySlug: `${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${user.id.slice(-6)}`,
      },
    });
    await email.welcomeEmployer(emailAddr, name).catch(() => {});
  }

  return NextResponse.json({ id: user.id }, { status: 201 });
}
