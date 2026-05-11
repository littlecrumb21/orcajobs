import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { getPresignedUploadUrl } from "@/lib/s3";
import { randomBytes } from "crypto";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const schema = z.object({
  filename: z.string().max(200),
  contentType: z.string(),
  folder: z.enum(["cvs", "logos", "videos"]),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  if (!ALLOWED_TYPES.includes(parsed.data.contentType)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
  }

  const ext = parsed.data.filename.split(".").pop() ?? "bin";
  const key = `${parsed.data.folder}/${session.user.id}/${randomBytes(8).toString("hex")}.${ext}`;

  const result = await getPresignedUploadUrl(key, parsed.data.contentType);
  return NextResponse.json(result);
}
