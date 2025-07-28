import { CONFIG } from "@/global/config";
import { s3 } from "@/lib/spaces";

export async function uploadToSpaces({
  fileBuffer,
  fileName,
  contentType,
  bucket = CONFIG.DIGITALOCEAN.BUCKET,
}: {
  fileBuffer: Buffer;
  fileName: string;
  contentType: string;
  bucket?: string;
}): Promise<string> {
  const params = {
    Bucket: bucket,
    Key: fileName,
    Body: fileBuffer,
    // ACL: "public-read",
    ContentType: contentType,
  };

  await s3.putObject(params).promise();

  const endpoint = CONFIG.DIGITALOCEAN.ENDPOINT.replace(/^https?:\/\//, "");
  return `https://${bucket}.${endpoint}/${fileName}`;
}
