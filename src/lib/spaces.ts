// lib/spaces.ts
import { S3Client } from "@aws-sdk/client-s3";
import { SERVER_CONFIG } from "@/global/config";

export const s3 = new S3Client({
  region: SERVER_CONFIG.DIGITALOCEAN.REGION || "sgp1",
  endpoint: SERVER_CONFIG.DIGITALOCEAN.ENDPOINT,
  credentials: {
    accessKeyId: SERVER_CONFIG.DIGITALOCEAN.ACCESS_KEY,
    secretAccessKey: SERVER_CONFIG.DIGITALOCEAN.SECRET_KEY,
  },
  forcePathStyle: false,
});
