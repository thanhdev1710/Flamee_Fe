/* eslint-disable @typescript-eslint/no-explicit-any */
import { CLIENT_CONFIG } from "@/global/config";
import { Notification } from "@/types/notify.type";

export async function getNotification(
  page: number,
  unread: boolean
): Promise<Notification[]> {
  try {
    const res = await fetch(
      `${CLIENT_CONFIG.API.BASE_URL}${CLIENT_CONFIG.API.VERSION}/notifications?page=${page}&unread=${unread}`,
      {
        method: "GET",
        headers: {
          "X-API-KEY": CLIENT_CONFIG.API.X_API_KEY,
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error("Không thể lấy thông báo");
    }

    const data = await res.json();

    if (!data) {
      throw new Error("Dữ liệu không hợp lệ");
    }

    return data.data.items;
  } catch (error: any) {
    console.error("Lỗi khi lấy thông báo", error.message);
    throw error;
  }
}
