"use server";

import { CreateUserType } from "@/types/user.type";

export async function createProfile(profile: CreateUserType) {
  console.log(profile);
}

export async function confirmCard(img: string) {
  const base64String = img.split(",")[1];

  // Tạo body chứa ảnh base64
  const body = JSON.stringify({
    base64_image: base64String,
  });

  try {
    // Gửi request POST đến API Flask
    const res = await fetch("http://localhost:5000/extract_info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    const data = await res.json();

    if (res.ok) {
      console.log("Thông tin trích xuất:", data);
    } else {
      console.log("Lỗi từ server:", data.error);
    }
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
  }
}
