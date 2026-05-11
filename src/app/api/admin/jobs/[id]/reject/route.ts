import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  await prisma.job.update({ where: { id }, data: { status: "REJECTED" } });

  await prisma.moderationLog.create({
    data: { entityType: "job", entityId: id, action: "rejected", adminId: session!.user!.id! },
  });

  return NextResponse.redirect(new URL("/admin", process.env.NEXT_PUBLIC_APP_URL!));
}
