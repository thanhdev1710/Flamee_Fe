import { NextRequest, NextResponse } from "next/server";
import { compressImage } from "@/utils/compressImage";
import path from "path";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("avatar") as File;
  const firstName = formData.get("firstName")?.toString();
  const lastName = formData.get("lastName")?.toString();

  if (!file) {
    return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
  }

  // Đổi tên file sau khi nén
  const fileNameWithoutExtension = path.parse(file.name).name;
  const fileExtension = ".avif";
  const time = new Date().getTime();
  const newFileName = `avatar_${lastName}_${firstName}_${fileNameWithoutExtension}_${time}${fileExtension}`;

  try {
    // Chuyển file thành buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Nén file (Giả sử compressImage đã nén thành công)
    const compressedBuffer = await compressImage({
      fileBuffer: buffer,
      quality: 75,
      width: 300,
      format: "avif",
    });

    // Lưu tạm file vào thư mục public/uploads trên server
    const filePath = join(process.cwd(), "public", "uploads", newFileName);
    await writeFile(filePath, compressedBuffer);

    // Trả về URL của file tạm thời (URL có thể truy cập qua public folder)
    return NextResponse.json(
      { url: `/uploads/${newFileName}` },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { message: "File upload failed" },
      { status: 500 }
    );
  }
}
