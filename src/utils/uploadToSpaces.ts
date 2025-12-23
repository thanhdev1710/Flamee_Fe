import { SERVER_CONFIG } from "@/global/config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/spaces";

export async function uploadToSpaces({
  fileBuffer,
  fileName,
  contentType,
  bucket = SERVER_CONFIG.DIGITALOCEAN.BUCKET,
}: {
  fileBuffer: Buffer;
  fileName: string;
  contentType: string;
  bucket?: string;
}): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
    // ACL: "public-read", // ❌ bỏ nếu dùng Backblaze
  });

  await s3.send(command);

  const endpoint = SERVER_CONFIG.DIGITALOCEAN.ENDPOINT.replace(
    /^https?:\/\//,
    ""
  );
  return `https://${bucket}.${endpoint}/${fileName}`;
}
