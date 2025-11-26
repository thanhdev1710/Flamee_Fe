import { NextRequest, NextResponse } from "next/server";
import {
  compressImage,
  compressPDF,
  compressVideo,
  zipGenericFile,
} from "@/utils/compressFile";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const uuid = crypto.randomUUID();
  const form = await req.formData();
  const file = form.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "Thiếu file" }, { status: 400 });
  }

  // Convert file → buffer
  const arrayBuffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);

  // Extract name + extension
  const parts = file.name.split(".");
  const ext = parts.at(-1)?.toLowerCase() || "dat";
  const name = parts.slice(0, -1).join(".").replace(/\s+/g, "-");

  const contentType = file.type;

  let finalBuffer: Buffer = fileBuffer;
  let finalExt = ext;

  try {
    // ============================
    // 🔥 Detect & Compress
    // ============================
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

    // ============================================================
    // 📌 Lưu file vào VPS (thư mục máy chủ)
    // ============================================================

    // THƯ MỤC BẠN MUỐN LƯU TRÊN VPS
    const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

    // Tạo thư mục nếu chưa tồn tại
    await mkdir(UPLOAD_DIR, { recursive: true });

    const fileName = `${name}-${uuid}.${finalExt}`;
    const savePath = path.join(UPLOAD_DIR, fileName);

    // Lưu file
    await writeFile(savePath, finalBuffer);

    // URL để FE truy cập (qua nginx hoặc static)
    const fileUrl = `/uploads/${fileName}`;

    return NextResponse.json({ url: fileUrl }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload thất bại" }, { status: 500 });
  }
}
