/* eslint-disable @typescript-eslint/no-explicit-any */
import { CLIENT_CONFIG } from "@/global/config";
import { CreateUserType, SearchUsername } from "@/types/user.type";

export interface GetUsersResponse {
  data: CreateUserType[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export async function getAllUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<GetUsersResponse> {
  try {
    const query = new URLSearchParams();

    if (params.page !== undefined) query.append("page", String(params.page));
    if (params.limit !== undefined) query.append("limit", String(params.limit));
    if (params.search) query.append("search", params.search);

    const res = await fetch(
      `${CLIENT_CONFIG.API.BASE_URL}${
        CLIENT_CONFIG.API.VERSION
      }/profiles/all?${query.toString()}`,
      {
        method: "GET",
        headers: {
          "X-API-KEY": CLIENT_CONFIG.API.X_API_KEY,
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Không thể tải danh sách người dùng");
    }

    const data = await res.json();

    return data.data;
  } catch (error) {
    console.error("Đã xảy ra lỗi khi lấy danh sách người dùng:", error);
    throw error;
  }
}

// Hàm lấy gợi ý tên người dùng
export async function getSuggestUsername(username: string) {
  try {
    const res = await fetch(
      `${CLIENT_CONFIG.API.BASE_URL}${CLIENT_CONFIG.API.VERSION}/profiles/suggest-username/${username}`,
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
      `${CLIENT_CONFIG.API.BASE_URL}${CLIENT_CONFIG.API.VERSION}/profiles`,
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
export async function getProfilesByUsername(
  username: string
): Promise<CreateUserType> {
  try {
    const res = await fetch(
      `${CLIENT_CONFIG.API.BASE_URL}${CLIENT_CONFIG.API.VERSION}/profiles/${username}`,
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
      `${CLIENT_CONFIG.API.BASE_URL}${CLIENT_CONFIG.API.VERSION}/profiles/search/${q}`,
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

// ===========================
// GET COUNT USERS
// ===========================
export async function countUsers(): Promise<number> {
  try {
    const res = await fetch(
      `${CLIENT_CONFIG.API.BASE_URL}${CLIENT_CONFIG.API.VERSION}/profiles/count`,
      {
        method: "GET",
        headers: {
          "X-API-KEY": CLIENT_CONFIG.API.X_API_KEY,
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!res.ok) throw new Error("Không thể lấy số lượng người dùng");

    const data = await res.json();
    return data?.data?.count ?? 0;
  } catch (error: any) {
    console.error("Lỗi khi lấy số lượng người dùng:", error.message);
    throw error;
  }
}

// ===========================
// WEEKLY USER ACTIVITY
// ===========================
export async function weeklyUserActivity(): Promise<
  Array<{ day: string; users: number }>
> {
  try {
    const res = await fetch(
      `${CLIENT_CONFIG.API.BASE_URL}${CLIENT_CONFIG.API.VERSION}/profiles/weekly`,
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
      throw new Error("Không thể lấy thống kê hoạt động người dùng theo tuần");

    const data = await res.json();
    return data?.data ?? [];
  } catch (error: any) {
    console.error("Lỗi khi lấy hoạt động người dùng tuần:", error.message);
    throw error;
  }
}

// ===========================
// RECENT USER ACTIVITIES
// ===========================
export async function recentUserActivities(): Promise<
  Array<{
    type: string;
    message: string;
    userId: string;
    time: string;
  }>
> {
  try {
    const res = await fetch(
      `${CLIENT_CONFIG.API.BASE_URL}${CLIENT_CONFIG.API.VERSION}/profiles/recent`,
      {
        method: "GET",
        headers: {
          "X-API-KEY": CLIENT_CONFIG.API.X_API_KEY,
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!res.ok) throw new Error("Không thể lấy hoạt động người dùng gần đây");

    const data = await res.json();
    return data?.data ?? [];
  } catch (error: any) {
    console.error("Lỗi khi lấy hoạt động người dùng gần đây:", error.message);
    throw error;
  }
}

// ===========================
// USER DASHBOARD SUMMARY
// ===========================
export async function dashboardUsers(): Promise<{
  count: number;
  weekly: Array<{ day: string; users: number }>;
  recent: Array<{
    type: string;
    message: string;
    userId: string;
    time: string;
  }>;
}> {
  try {
    const res = await fetch(
      `${CLIENT_CONFIG.API.BASE_URL}${CLIENT_CONFIG.API.VERSION}/profiles/dashboard`,
      {
        method: "GET",
        headers: {
          "X-API-KEY": CLIENT_CONFIG.API.X_API_KEY,
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!res.ok) throw new Error("Không thể lấy dashboard người dùng");

    const data = await res.json();
    return data?.data ?? {};
  } catch (error: any) {
    console.error("Lỗi khi lấy dashboard người dùng:", error.message);
    throw error;
  }
}
