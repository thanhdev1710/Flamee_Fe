import { s3 } from "@/lib/spaces";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { CONFIG } from "@/global/config";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const uuid = crypto.randomUUID();
    const body = await req.json();
    const { fileName, contentType } = body;

    if (!fileName || !contentType) {
      return Response.json(
        { error: "Thiếu fileName hoặc contentType" },
        { status: 400 }
      );
    }

    const parts = fileName.split(".");
    const ext = parts.at(-1);
    const baseName = parts.slice(0, -1).join(".").replace(/\s+/g, "-");

    const finalFileName = `uploads/${baseName}-${uuid}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: CONFIG.DIGITALOCEAN.BUCKET,
      Key: finalFileName,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 }); // 60s
    const publicUrl = `https://${CONFIG.DIGITALOCEAN.BUCKET}.${CONFIG.DIGITALOCEAN.ENDPOINT}/${finalFileName}`;

    return Response.json({ url: signedUrl, fileUrl: publicUrl });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Tạo presigned URL thất bại" },
      { status: 500 }
    );
  }
}
