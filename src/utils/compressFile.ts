import sharp from "sharp";
import { PDFDocument } from "pdf-lib";
import ffmpeg from "fluent-ffmpeg";
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

export async function compressVideo(fileBuffer: Buffer): Promise<Buffer> {
  const inputPath = join(tmpdir(), `${randomUUID()}.mp4`);
  const outputPath = join(tmpdir(), `${randomUUID()}-compressed.mp4`);
  await writeFile(inputPath, fileBuffer);

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        "-c:v libx264",
        "-preset fast",
        "-crf 28",
        "-movflags +faststart",
      ])
      .on("end", async () => {
        const result = await readFile(outputPath);
        await unlink(inputPath);
        await unlink(outputPath);
        resolve(result);
      })
      .on("error", async (err) => {
        await unlink(inputPath).catch(() => {});
        reject(new Error("Nén video thất bại: " + err.message));
      })
      .save(outputPath);
  });
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
