import sharp from "sharp";

type ImageFormat = "avif" | "jpeg" | "png" | "webp";

// Hàm nén ảnh với khả năng chọn định dạng đầu ra (mặc định: AVIF)
export async function compressImage({
  fileBuffer,
  width = 800,
  quality = 80,
  format = "avif",
}: {
  fileBuffer: Buffer;
  width?: number;
  quality?: number;
  format?: ImageFormat;
}): Promise<Buffer> {
  try {
    const image = sharp(fileBuffer).resize(width);

    // Chuyển đổi theo định dạng được chọn
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
