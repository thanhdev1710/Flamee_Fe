import { CLIENT_CONFIG } from "@/global/config";
import { withErrorHandler } from "@/lib/utils";
import { CreatePost, PostCheckResult } from "@/types/post.type";

export async function createPost(post: CreatePost) {
  return await withErrorHandler(async () => {
    const body = JSON.stringify(post);

    const res = await fetch(
      `${CLIENT_CONFIG.API.BASE_URL}${CLIENT_CONFIG.API.VERSION}/posts`,
      {
        method: "POST",
        body,
        headers: {
          "X-API-KEY": CLIENT_CONFIG.API.X_API_KEY,
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

export async function updatePost(id: string, post: CreatePost) {
  return await withErrorHandler(async () => {
    const body = JSON.stringify(post);

    const res = await fetch(
      `${CLIENT_CONFIG.API.BASE_URL}${CLIENT_CONFIG.API.VERSION}/posts/${id}`,
      {
        method: "PUT",
        body,
        headers: {
          "X-API-KEY": CLIENT_CONFIG.API.X_API_KEY,
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

export async function deletePost(id: string) {
  return await withErrorHandler(async () => {
    const res = await fetch(
      `${CLIENT_CONFIG.API.BASE_URL}${CLIENT_CONFIG.API.VERSION}/posts/${id}`,
      {
        method: "DELETE",
        headers: {
          "X-API-KEY": CLIENT_CONFIG.API.X_API_KEY,
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
      `${CLIENT_CONFIG.API.BASE_URL}${CLIENT_CONFIG.API.VERSION}/interactions/like/${id}`,
      {
        method: "POST",
        headers: {
          "X-API-KEY": CLIENT_CONFIG.API.X_API_KEY,
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
      `${CLIENT_CONFIG.API.BASE_URL}${CLIENT_CONFIG.API.VERSION}/interactions/share/${id}`,
      {
        method: "POST",
        headers: {
          "X-API-KEY": CLIENT_CONFIG.API.X_API_KEY,
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
      `${CLIENT_CONFIG.API.BASE_URL}${CLIENT_CONFIG.API.VERSION}/interactions/comment/${id}`,
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

export async function checkPostContent(
  text: string
): Promise<PostCheckResult | string | null> {
  return await withErrorHandler(async () => {
    const body = JSON.stringify({ text: text.trim() });

    const res = await fetch(`${CLIENT_CONFIG.API.CHECK_POST_URL}/predict`, {
      method: "POST",
      headers: {
        "X-API-KEY": CLIENT_CONFIG.API.X_API_KEY,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body,
    });

    const data = await res.json();

    if (!res.ok) {
      return data.error || "Lỗi không xác định từ Censor Service";
    }

    return data as PostCheckResult;
  });
}
