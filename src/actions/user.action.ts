import { CONFIG } from "@/global/config";
import { CardStudent, CreateUserType } from "@/types/user.type";
import { refreshAccessToken } from "@/utils/jwt";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export async function createProfile(profile: CreateUserType) {
  try {
    const res = await fetch(
      `${CONFIG.API.BASE_URL}${CONFIG.API.VERSION}/profiles`,
      {
        method: "POST",
        headers: {
          "X-API-KEY": CONFIG.API.X_API_KEY,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(profile),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Tạo hồ sơ thất bại", { richColors: true });
      return;
    }

    toast.success("Tạo hồ sơ thành công");
    await refreshAccessToken();
    redirect("/app/feeds");
  } catch (error) {
    console.error("createProfile error:", error);
    toast.error("Lỗi kết nối máy chủ");
  }
}

export async function confirmCard(image: File): Promise<CardStudent> {
  try {
    const formData = new FormData();
    formData.append("file", image);

    // Gửi POST request
    const res = await fetch(`${CONFIG.API.CHECK_STUDENT_CARD_URL}/ocr`, {
      method: "POST",
      body: formData,
    });

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
