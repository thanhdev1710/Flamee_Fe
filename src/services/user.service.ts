/* eslint-disable @typescript-eslint/no-explicit-any */
import { CONFIG } from "@/global/config";
import { CreateUserType, SearchUsername } from "@/types/user.type";

// Hàm lấy gợi ý tên người dùng
export async function getSuggestUsername(username: string) {
  try {
    const res = await fetch(
      `${CONFIG.API.BASE_URL}${CONFIG.API.VERSION}/profiles/suggest-username/${username}`,
      {
        method: "GET",
        headers: {
          "X-API-KEY": CONFIG.API.X_API_KEY,
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!res.ok) {
      return [];
    }

    const { data } = await res.json();

    return data as string[];
  } catch (error) {
    console.error("Đã xảy ra lỗi khi lấy gợi ý tên người dùng:", error);
    return [];
  }
}

// Hàm lấy thông tin hồ sơ người dùng
export async function getMyProfiles(): Promise<CreateUserType> {
  try {
    const res = await fetch(
      `${CONFIG.API.BASE_URL}${CONFIG.API.VERSION}/profiles`,
      {
        method: "GET",
        headers: {
          "X-API-KEY": CONFIG.API.X_API_KEY,
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error("Không thể lấy thông tin hồ sơ người dùng");
    }

    const data = await res.json();

    if (!data || !data.data) {
      throw new Error("Dữ liệu không hợp lệ");
    }

    return data.data;
  } catch (error: any) {
    console.error("Lỗi khi lấy thông tin hồ sơ:", error.message);
    throw error; // Hoặc có thể trả về một giá trị mặc định, tùy theo yêu cầu của bạn
  }
}

// Hàm lấy thông tin hồ sơ người dùng
export async function searchUsername(q: string): Promise<SearchUsername[]> {
  try {
    const res = await fetch(
      `${CONFIG.API.BASE_URL}${CONFIG.API.VERSION}/profiles/search/${q}`,
      {
        method: "GET",
        headers: {
          "X-API-KEY": CONFIG.API.X_API_KEY,
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error("Không thể lấy thông tin hồ sơ người dùng");
    }

    const data = await res.json();

    if (!data || !data.data) {
      throw new Error("Dữ liệu không hợp lệ");
    }

    return data.data;
  } catch (error: any) {
    console.error("Lỗi khi lấy thông tin hồ sơ:", error.message);
    throw error; // Hoặc có thể trả về một giá trị mặc định, tùy theo yêu cầu của bạn
  }
}
