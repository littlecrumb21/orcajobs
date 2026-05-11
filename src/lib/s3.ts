import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Lazily initialised so missing keys don't crash the build
let _s3: S3Client | null = null;
function getS3(): S3Client {
  if (!_s3) {
    _s3 = new S3Client({
      region: process.env.AWS_REGION ?? "eu-west-2",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
      },
    });
  }
  return _s3;
}

const BUCKET = process.env.AWS_S3_BUCKET ?? "";

export async function getPresignedUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType });
  const url = await getSignedUrl(getS3(), command, { expiresIn: 300 });
  return { url, key, publicUrl: `https://${BUCKET}.s3.${process.env.AWS_REGION ?? "eu-west-2"}.amazonaws.com/${key}` };
}

export async function deleteS3Object(key: string) {
  await getS3().send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

export function s3KeyFromUrl(url: string): string {
  const u = new URL(url);
  return u.pathname.slice(1); // strip leading /
}
