// src/lib/storage/r2.ts
import { S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export function generateKey(userId: string, ext: string): string {
  const date = new Date().toISOString().split("T")[0];
  return `uploads/${userId}/${date}/${uuidv4()}.${ext}`;
}

export function generateVideoKey(projectId: string, format: string): string {
  return `videos/${projectId}/${format}-${uuidv4()}.mp4`;
}
