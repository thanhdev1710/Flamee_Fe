/* eslint-disable @typescript-eslint/no-explicit-any */
import { CLIENT_CONFIG } from "@/global/config";
import { Interaction } from "@/types/interaction.type";
import { Post } from "@/types/post.type";

export async function getPostById(id: string): Promise<Post> {
  try {
    const res = await fetch(
      `${CLIENT_CONFIG.API.BASE_URL}${CLIENT_CONFIG.API.VERSION}/search/posts/${id}`,
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
}): Promise<{
  from: number;
  size: number;
  total: number;
  items: Post[];
}> {
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

    const url = `${CLIENT_CONFIG.API.BASE_URL}${
      CLIENT_CONFIG.API.VERSION
    }/search/posts?${params.toString()}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-KEY": CLIENT_CONFIG.API.X_API_KEY,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) throw new Error("Không thể lấy bài viết");

    const data = await res.json();

    return data ?? [];
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
      `${CLIENT_CONFIG.API.BASE_URL}${CLIENT_CONFIG.API.VERSION}/interactions/${id}`,
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

// ===========================
// GET COUNT POSTS
// ===========================
export async function countPosts(): Promise<number> {
  try {
    const res = await fetch(
      `${CLIENT_CONFIG.API.BASE_URL}${CLIENT_CONFIG.API.VERSION}/posts/count`,
      {
        method: "GET",
        headers: {
          "X-API-KEY": CLIENT_CONFIG.API.X_API_KEY,
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!res.ok) throw new Error("Không thể lấy số lượng bài viết");

    const data = await res.json();
    return data?.data?.count ?? 0;
  } catch (error: any) {
    console.error("Lỗi khi lấy số lượng bài viết:", error.message);
    throw error;
  }
}

// ===========================
// WEEKLY POST ACTIVITY
// ===========================
export async function weeklyPostActivity(): Promise<
  Array<{ day: string; posts: number }>
> {
  try {
    const res = await fetch(
      `${CLIENT_CONFIG.API.BASE_URL}${CLIENT_CONFIG.API.VERSION}/posts/weekly`,
      {
        method: "GET",
        headers: {
          "X-API-KEY": CLIENT_CONFIG.API.X_API_KEY,
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!res.ok)
      throw new Error("Không thể lấy thống kê hoạt động bài viết theo tuần");

    const data = await res.json();
    return data?.data ?? [];
  } catch (error: any) {
    console.error("Lỗi khi lấy hoạt động bài viết tuần:", error.message);
    throw error;
  }
}

// ===========================
// RECENT POST ACTIVITIES
// ===========================
export async function recentPostActivities(): Promise<
  Array<{
    type: string;
    message: string;
    postId: string;
    time: string;
  }>
> {
  try {
    const res = await fetch(
      `${CLIENT_CONFIG.API.BASE_URL}${CLIENT_CONFIG.API.VERSION}/posts/recent`,
      {
        method: "GET",
        headers: {
          "X-API-KEY": CLIENT_CONFIG.API.X_API_KEY,
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!res.ok) throw new Error("Không thể lấy hoạt động bài viết gần đây");

    const data = await res.json();
    return data?.data ?? [];
  } catch (error: any) {
    console.error("Lỗi khi lấy hoạt động bài viết gần đây:", error.message);
    throw error;
  }
}

// ===========================
// POSTS DASHBOARD SUMMARY
// ===========================
export async function dashboardPosts(): Promise<{
  count: number;
  weekly: Array<{ day: string; posts: number }>;
  recent: Array<{
    type: string;
    message: string;
    postId: string;
    time: string;
  }>;
}> {
  try {
    const res = await fetch(
      `${CLIENT_CONFIG.API.BASE_URL}${CLIENT_CONFIG.API.VERSION}/posts/dashboard`,
      {
        method: "GET",
        headers: {
          "X-API-KEY": CLIENT_CONFIG.API.X_API_KEY,
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!res.ok) throw new Error("Không thể lấy dashboard bài viết");

    const data = await res.json();
    return data?.data ?? {};
  } catch (error: any) {
    console.error("Lỗi khi lấy dashboard bài viết:", error.message);
    throw error;
  }
}
