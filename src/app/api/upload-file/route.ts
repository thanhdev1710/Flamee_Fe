import { compressImage } from "@/utils/compressImage";
import { uploadToSpaces } from "@/utils/uploadToSpaces";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const uuid = crypto.randomUUID();
  const form = await req.formData();
  const file = form.get("file") as File;

  if (!file) return Response.json({ error: "Thiếu file" }, { status: 400 });

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.split(".")[0];
  const fileName = `uploads/${name.replace(/\s+/g, "-")}-${uuid}`;
  const contentType = file.type;

  try {
    const isImage = contentType.startsWith("image/");
    const finalBuffer = isImage
      ? await compressImage({
          fileBuffer,
          width: 1000,
          quality: 80,
          format: "avif",
        })
      : fileBuffer;

    const url = await uploadToSpaces({
      fileBuffer: finalBuffer,
      fileName,
      contentType,
    });

    return Response.json({ url }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Upload thất bại" }, { status: 500 });
  }
}
