// lib/spaces.ts
import { S3Client } from "@aws-sdk/client-s3";
import { CONFIG } from "@/global/config";

export const s3 = new S3Client({
  region: CONFIG.DIGITALOCEAN.REGION || "sgp1",
  endpoint: CONFIG.DIGITALOCEAN.ENDPOINT,
  credentials: {
    accessKeyId: CONFIG.DIGITALOCEAN.ACCESS_KEY,
    secretAccessKey: CONFIG.DIGITALOCEAN.SECRET_KEY,
  },
  forcePathStyle: false,
});
