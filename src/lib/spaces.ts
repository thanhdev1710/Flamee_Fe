// lib/spaces.ts
import { CONFIG } from "@/global/config";
import { S3, Endpoint } from "aws-sdk";

const spacesEndpoint = new Endpoint(CONFIG.DIGITALOCEAN.ENDPOINT);

export const s3 = new S3({
  endpoint: spacesEndpoint,
  accessKeyId: CONFIG.DIGITALOCEAN.ACCESS_KEY,
  secretAccessKey: CONFIG.DIGITALOCEAN.SECRET_KEY,
  region: CONFIG.DIGITALOCEAN.REGION || "sgp1",
  signatureVersion: "v4",
});
