import { CONFIG } from "@/global/config";
import { withErrorHandler } from "@/lib/utils";
import { Notification } from "@/types/notify.type";

export async function notify(notify: Notification) {
  return await withErrorHandler(async () => {
    const body = JSON.stringify(notify);

    const res = await fetch(
      `${CONFIG.API.BASE_URL}${CONFIG.API.VERSION}/notifications`,
      {
        method: "POST",
        body,
        headers: {
          "X-API-KEY": CONFIG.API.X_API_KEY,
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!res.ok) {
      const error = await res.json();
      return error.message;
    }

    return null;
  });
}

export async function notifyReadOne(id: string) {
  return await withErrorHandler(async () => {
    const res = await fetch(
      `${CONFIG.API.BASE_URL}${CONFIG.API.VERSION}/notifications/${id}/read`,
      {
        method: "PATCH",
        headers: {
          "X-API-KEY": CONFIG.API.X_API_KEY,
        },
        credentials: "include",
      }
    );

    if (!res.ok) {
      const error = await res.json();
      return error.message;
    }

    return null;
  });
}

export async function notifyReadAll() {
  return await withErrorHandler(async () => {
    const res = await fetch(
      `${CONFIG.API.BASE_URL}${CONFIG.API.VERSION}/notifications/read-all`,
      {
        method: "PATCH",
        headers: {
          "X-API-KEY": CONFIG.API.X_API_KEY,
        },
        credentials: "include",
      }
    );

    if (!res.ok) {
      const error = await res.json();
      return error.message;
    }

    return null;
  });
}
