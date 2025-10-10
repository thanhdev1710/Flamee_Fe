import {
  compressImage,
  compressPDF,
  compressVideo,
  zipGenericFile,
} from "@/utils/compressFile";
import { uploadToSpaces } from "@/utils/uploadToSpaces";

export async function POST(req: Request) {
  const uuid = crypto.randomUUID();
  const form = await req.formData();
  const file = form.get("file") as File;

  if (!file) {
    return Response.json({ error: "Thiếu file" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);
  const parts = file.name.split(".");
  const ext = parts.at(-1)?.toLowerCase() || "dat";
  const name = parts.slice(0, -1).join(".").replace(/\s+/g, "-");

  const contentType = file.type;

  let finalBuffer: Buffer<ArrayBufferLike> = fileBuffer;
  let finalExt = ext;

  try {
    if (contentType.startsWith("image/")) {
      finalBuffer = await compressImage({
        fileBuffer,
        width: 500,
        quality: 75,
        format: "avif",
      });
      finalExt = "avif";
    } else if (contentType === "application/pdf") {
      finalBuffer = await compressPDF(fileBuffer);
      finalExt = "pdf";
    } else if (contentType.startsWith("video/")) {
      finalBuffer = await compressVideo(fileBuffer);
      finalExt = "mp4";
    } else {
      finalBuffer = await zipGenericFile(fileBuffer, `${name}.${ext}`);
      finalExt = "zip";
    }

    const fileName = `uploads/${name}-${uuid}.${finalExt}`;

    const url = await uploadToSpaces({
      fileBuffer: finalBuffer,
      fileName,
      contentType,
    });

    return Response.json({ url }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json({ error: "Upload thất bại" }, { status: 500 });
  }
}
