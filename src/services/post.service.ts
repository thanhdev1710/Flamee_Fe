/* eslint-disable @typescript-eslint/no-explicit-any */
import { CONFIG } from "@/global/config";
import { Post } from "@/types/post.type";

export async function getPostById(id: string): Promise<Post> {
  try {
    const res = await fetch(
      `${CONFIG.API.BASE_URL}${CONFIG.API.VERSION}/search/posts/${id}`,
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
      throw new Error("Không thể lấy bài viết");
    }

    const data = await res.json();

    if (!data) {
      throw new Error("Dữ liệu không hợp lệ");
    }

    return data;
  } catch (error: any) {
    console.error("Lỗi khi lấy bài viết", error.message);
    throw error; // Hoặc có thể trả về một giá trị mặc định, tùy theo yêu cầu của bạn
  }
}

export async function searchPost(q: string): Promise<Post> {
  try {
    const res = await fetch(
      `${CONFIG.API.BASE_URL}${CONFIG.API.VERSION}/search/posts?q=${q}`,
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
      throw new Error("Không thể lấy bài viết");
    }

    const data = await res.json();

    if (!data) {
      throw new Error("Dữ liệu không hợp lệ");
    }

    return data.items;
  } catch (error: any) {
    console.error("Lỗi khi lấy bài viết", error.message);
    throw error; // Hoặc có thể trả về một giá trị mặc định, tùy theo yêu cầu của bạn
  }
}
