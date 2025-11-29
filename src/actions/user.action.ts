import { CLIENT_CONFIG } from "@/global/config";
import { withErrorHandler } from "@/lib/utils";
import { CardStudent, CreateUserType } from "@/types/user.type";

export async function createProfile(profile: CreateUserType) {
  return await withErrorHandler(async () => {
    const res = await fetch(
      `${CLIENT_CONFIG.API.BASE_URL}${CLIENT_CONFIG.API.VERSION}/profiles`,
      {
        method: "POST",
        headers: {
          "X-API-KEY": CLIENT_CONFIG.API.X_API_KEY,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(profile),
      }
    );

    // ❌ Lỗi từ server → trả message để client xử lý
    if (!res.ok) {
      const error = await res.json();
      return error.message || "Tạo hồ sơ thất bại";
    }

    // ✔ Thành công → trả null
    return null;
  });
}

export async function updateProfile(profile: CreateUserType) {
  return await withErrorHandler(async () => {
    const res = await fetch(
      `${CLIENT_CONFIG.API.BASE_URL}${CLIENT_CONFIG.API.VERSION}/profiles`,
      {
        method: "PUT",
        headers: {
          "X-API-KEY": CLIENT_CONFIG.API.X_API_KEY,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(profile),
      }
    );

    // ❌ Lỗi từ server → trả message để client xử lý
    if (!res.ok) {
      const error = await res.json();
      return error.message || "Sửa hồ sơ thất bại";
    }

    // ✔ Thành công → trả null
    return null;
  });
}

export async function confirmCard(image: File): Promise<CardStudent> {
  try {
    const formData = new FormData();
    formData.append("file", image);

    // Gửi POST request
    const res = await fetch(
      `${CLIENT_CONFIG.API.CHECK_STUDENT_CARD_URL}/predict`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (res.ok) {
      return data.info;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
}
