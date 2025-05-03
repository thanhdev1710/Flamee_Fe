"use server";

import { CreateUserType } from "@/types/user.type";

export async function createProfile(profile: CreateUserType) {
  console.log(profile);
}

export async function confirmCard(image: File) {
  try {
    const formData = new FormData();
    formData.append("file", image);

    // Gửi POST request
    const res = await fetch("http://localhost:8000/ocr", {
      method: "POST",
      body: formData,
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
