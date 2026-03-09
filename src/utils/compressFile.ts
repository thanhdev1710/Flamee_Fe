import sharp from "sharp";
import { PDFDocument } from "pdf-lib";
const ffmpeg = (await import("fluent-ffmpeg")).default;
import archiver from "archiver";
import { PassThrough } from "stream";
import { tmpdir } from "os";
import { join } from "path";
import { randomUUID } from "crypto";
import { writeFile, readFile, unlink } from "fs/promises";

type ImageFormat = "avif" | "jpeg" | "png" | "webp";

export async function compressImage({
  fileBuffer,
  width,
  quality = 80,
  format,
}: {
  fileBuffer: Buffer;
  width?: number;
  quality?: number;
  format: ImageFormat;
}): Promise<Buffer> {
  try {
    const image = sharp(fileBuffer);
    const metadata = await image.metadata();

    if (width && metadata.width && metadata.width > width) {
      image.resize(width);
    }

    switch (format) {
      case "jpeg":
        return await image.jpeg({ quality }).toBuffer();
      case "png":
        return await image.png({ quality }).toBuffer();
      case "webp":
        return await image.webp({ quality }).toBuffer();
      case "avif":
      default:
        return await image.avif({ quality }).toBuffer();
    }
  } catch {
    throw new Error("Nén ảnh thất bại");
  }
}

export async function compressPDF(fileBuffer: Buffer): Promise<Buffer> {
  try {
    const pdfDoc = await PDFDocument.load(fileBuffer);
    const compressedPdf = await pdfDoc.save({ useObjectStreams: false });
    return Buffer.from(compressedPdf);
  } catch {
    throw new Error("Nén PDF thất bại");
  }
}

// Lấy codec video từ file input
async function getVideoCodec(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);

      try {
        const videoStream = metadata.streams.find(
          (s) => s.codec_type === "video"
        );
        resolve(videoStream?.codec_name || "unknown");
      } catch {
        resolve("unknown");
      }
    });
  });
}

export async function compressVideo(fileBuffer: Buffer): Promise<Buffer> {
  const inputPath = join(tmpdir(), `${randomUUID()}.mp4`);
  const outputPath = join(tmpdir(), `${randomUUID()}-compressed.mp4`);

  // Tạo file input tạm
  await writeFile(inputPath, fileBuffer);

  try {
    // ===== 1️⃣ Kiểm tra codec input trước =====
    const codec = await getVideoCodec(inputPath);

    return await new Promise((resolve, reject) => {
      const process = ffmpeg(inputPath);

      // ===== 2️⃣ Nếu video đã là H.264 → không cần encode lại → remux cho nhanh =====
      if (codec === "h264") {
        process
          .videoCodec("copy")
          .audioCodec("copy")
          .outputOptions(["-movflags +faststart"]);
      } else {
        // ===== 3️⃣ Nếu KHÔNG phải H.264 → encode với profile tối ưu =====
        process.videoCodec("libx264").outputOptions([
          "-preset veryfast", // encode nhanh hơn nhiều
          "-crf 24", // chất lượng đẹp + nhẹ
          "-movflags +faststart",
        ]);
      }

      process
        .on("end", async () => {
          try {
            const compressed = await readFile(outputPath);
            await unlink(inputPath).catch(() => {});
            await unlink(outputPath).catch(() => {});
            resolve(compressed);
          } catch (err) {
            reject(err);
          }
        })
        .on("error", async (err) => {
          await unlink(inputPath).catch(() => {});
          await unlink(outputPath).catch(() => {});
          reject(new Error("Nén video thất bại: " + err.message));
        })
        .save(outputPath);
    });
  } catch (err) {
    await unlink(inputPath).catch(() => {});
    await unlink(outputPath).catch(() => {});
    throw err;
  }
}

export async function zipGenericFile(
  fileBuffer: Buffer,
  fileName: string
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const archive = archiver("zip", { zlib: { level: 9 } });
    const output = new PassThrough();
    const chunks: Buffer[] = [];

    output.on("data", (chunk) => chunks.push(chunk));
    output.on("end", () => resolve(Buffer.concat(chunks)));
    output.on("error", (err) => reject(err));

    archive.pipe(output);
    archive.append(fileBuffer, { name: fileName });
    archive.finalize();
  });
}
