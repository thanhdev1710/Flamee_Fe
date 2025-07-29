"use server";
import { compressImage } from "./compressFile";

export async function base64ToFile(base64: string, fileName = "cropped") {
  const data = base64.split(",")[1];
  const mime = "image/jpeg";
  const byteString = atob(data);
  const buffer = Buffer.alloc(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    buffer[i] = byteString.charCodeAt(i);
  }

  // Gọi compressImage (trả về Buffer)
  const compressedBuffer = await compressImage({
    fileBuffer: buffer,
    format: "jpeg",
    quality: 100,
  });

  const blob = new Blob([compressedBuffer], { type: mime });
  return new File([blob], fileName, { type: mime });
}
