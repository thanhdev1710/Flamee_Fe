import { CONFIG } from "@/global/config";

export async function getSuggestUsername(username: string) {
  try {
    const res = await fetch(
      `${CONFIG.API_GATEWAY.API_URL}${CONFIG.API_GATEWAY.API_VERSION}/profiles/suggest-username/${username}`,
      {
        method: "GET",
        headers: {
          "X-API-KEY": CONFIG.X_API_KEY,
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
  } catch {
    return [];
  }
}
