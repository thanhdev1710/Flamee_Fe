// import { CONFIG } from "@/global/config";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// const s3 = new S3Client({
//   region: CONFIG.DIGITALOCEAN_REGION,
//   endpoint: CONFIG.DIGITALOCEAN_ENDPOINT,
//   credentials: {
//     accessKeyId: CONFIG.DIGITALOCEAN_ACCESS_KEY,
//     secretAccessKey: CONFIG.DIGITALOCEAN_SECRET_KEY,
//   },
// });

// // Hàm upload
// export const uploadToDigitalOcean = async (
//   fileBuffer: Buffer,
//   bucket: string,
//   fileName: string,
//   contentType = "image/avif"
// ): Promise<string> => {
//   try {
//     const command = new PutObjectCommand({
//       Bucket: bucket,
//       Key: fileName,
//       Body: fileBuffer,
//       ContentType: contentType,
//       ACL: "public-read",
//     });

//     await s3.send(command);

//     const fileUrl = `https://${bucket}.nyc3.digitaloceanspaces.com/${fileName}`;
//     return fileUrl;
//   } catch {
//     throw new Error("Lỗi khi upload ảnh lên DigitalOcean");
//   }
// };

export const uploadToDigitalOcean = async (
  fileBuffer: Buffer,
  bucket: string,
  fileName: string,
  contentType = "image/avif"
): Promise<string> => {
  return contentType;
};
