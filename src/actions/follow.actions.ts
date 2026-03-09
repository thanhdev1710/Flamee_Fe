import { CLIENT_CONFIG } from "@/global/config";
import { withErrorHandler } from "@/lib/utils";

export async function addOrUnFollowById(followerId: string) {
  return await withErrorHandler(async () => {
    const body = JSON.stringify({ followerId });
    const res = await fetch(
      `${CLIENT_CONFIG.API.BASE_URL}${CLIENT_CONFIG.API.VERSION}/follows`,
      {
        method: "POST",
        headers: {
          "X-API-KEY": CLIENT_CONFIG.API.X_API_KEY,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body,
      }
    );

    if (!res.ok) {
      const error = await res.json();
      return error.message;
    }

    return null;
  });
}
