/* eslint-disable @typescript-eslint/no-explicit-any */
import { CONFIG } from "@/global/config";
import { Interaction } from "@/types/interaction.type";
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

export async function searchPost(options: {
  q?: string;
  limit?: number;
  userId?: string;
  onlyMe?: boolean;
  hasMedia?: boolean;
  mediaType?: string;
  mediaTypes?: string[];
  start?: number;
  following?: string[];
  friends?: string[];
}): Promise<Post[]> {
  console.log(options.userId);

  try {
    const params = new URLSearchParams();

    if (options.q) params.append("q", options.q);
    if (options.limit) params.append("limit", String(options.limit));
    if (options.start) params.append("start", String(options.start));

    // lấy bài viết của userId cụ thể
    if (options.userId) params.append("userId", options.userId);

    // chỉ lấy bài chính mình
    if (options.onlyMe) params.append("onlyMe", "1");

    // media filters
    if (typeof options.hasMedia !== "undefined")
      params.append("hasMedia", String(options.hasMedia));

    if (options.mediaType) params.append("mediaType", options.mediaType);
    if (options.mediaTypes?.length)
      params.append("mediaTypes", options.mediaTypes.join(","));

    // following list
    if (options.following?.length)
      params.append("following", options.following.join(","));

    // friends list
    if (options.friends?.length)
      params.append("friends", options.friends.join(","));

    const url = `${CONFIG.API.BASE_URL}${
      CONFIG.API.VERSION
    }/search/posts?${params.toString()}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-KEY": CONFIG.API.X_API_KEY,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) throw new Error("Không thể lấy bài viết");

    const data = await res.json();

    return data.items ?? [];
  } catch (error: any) {
    console.error("Lỗi khi lấy bài viết:", error.message);
    throw error;
  }
}

export async function getInteractionsPostById(
  id: string
): Promise<Interaction> {
  try {
    const res = await fetch(
      `${CONFIG.API.BASE_URL}${CONFIG.API.VERSION}/interactions/${id}`,
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
      throw new Error("Không thể lấy thông tin tương tác");
    }

    const data = await res.json();

    if (!data) {
      throw new Error("Dữ liệu không hợp lệ");
    }

    return data.data;
  } catch (error: any) {
    console.error("Lỗi khi lấy thông tin tương tác", error.message);
    throw error; // Hoặc có thể trả về một giá trị mặc định, tùy theo yêu cầu của bạn
  }
}
