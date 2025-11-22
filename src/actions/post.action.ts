import { CONFIG } from "@/global/config";
import { withErrorHandler } from "@/lib/utils";
import { CreatePost } from "@/types/post.type";

export async function createPost(post: CreatePost) {
  return await withErrorHandler(async () => {
    const body = JSON.stringify(post);

    const res = await fetch(
      `${CONFIG.API.BASE_URL}${CONFIG.API.VERSION}/posts`,
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

export async function likeOrDislikePostById(id: string) {
  return await withErrorHandler(async () => {
    const res = await fetch(
      `${CONFIG.API.BASE_URL}${CONFIG.API.VERSION}/interactions/like/${id}`,
      {
        method: "POST",
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

export async function sharePost(id: string) {
  return await withErrorHandler(async () => {
    const res = await fetch(
      `${CONFIG.API.BASE_URL}${CONFIG.API.VERSION}/interactions/share/${id}`,
      {
        method: "POST",
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

export async function commentPost(
  id: string,
  data: { content: string; parent_id: string | null }
) {
  return await withErrorHandler(async () => {
    const body = JSON.stringify(data);
    const res = await fetch(
      `${CONFIG.API.BASE_URL}${CONFIG.API.VERSION}/interactions/comment/${id}`,
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
