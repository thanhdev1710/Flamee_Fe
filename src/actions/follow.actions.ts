import { CONFIG } from "@/global/config";
import { withErrorHandler } from "@/lib/utils";

export async function addOrUnFollowById(followerId: string) {
  return await withErrorHandler(async () => {
    const body = JSON.stringify({ followerId });
    const res = await fetch(
      `${CONFIG.API.BASE_URL}${CONFIG.API.VERSION}/follows`,
      {
        method: "POST",
        headers: {
          "X-API-KEY": CONFIG.API.X_API_KEY,
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
