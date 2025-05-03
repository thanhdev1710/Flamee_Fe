import { CONFIG } from "@/global/config";
import { CreateUserType } from "@/types/user.type";
import { refreshAccessToken } from "@/utils/jwt";
import { toast } from "sonner";

export async function createProfile(profile: CreateUserType) {
  try {
    const res = await fetch(
      `${CONFIG.API_GATEWAY.API_URL}${CONFIG.API_GATEWAY.API_VERSION}/profiles`,
      {
        method: "POST",
        headers: {
          "X-API-KEY": CONFIG.X_API_KEY,
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
  } catch (error) {
    console.error("createProfile error:", error);
    toast.error("Lỗi kết nối máy chủ");
  }
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
