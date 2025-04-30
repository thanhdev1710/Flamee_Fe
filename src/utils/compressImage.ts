import sharp from "sharp";

// Hàm nén ảnh với AVIF và tối ưu dung lượng ảnh
export async function compressImage({
  fileBuffer,
  width = 800,
  quality = 80,
}: {
  fileBuffer: Buffer;
  width?: number;
  quality?: number;
}): Promise<Buffer> {
  try {
    const compressedBuffer = await sharp(fileBuffer)
      .resize(width)
      .avif({
        quality,
        effort: 5,
      })
      .toBuffer();

    return compressedBuffer;
  } catch {
    throw new Error("Nén ảnh thất bại");
  }
}
