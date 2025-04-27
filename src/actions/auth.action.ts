import { CONFIG } from "@/global/config";
import { getAccessToken } from "@/lib/auth";
import { withErrorHandler } from "@/lib/utils";
import { AuthFormData } from "@/types/formAuth.type";
import { GetMeResponse } from "@/types/jwt";

export async function signin(formData: AuthFormData): Promise<string | null> {
  return await withErrorHandler(async () => {
    const { email, password, rememberMe } = formData;
    const body = JSON.stringify({ email, password, rememberMe });

    const res = await fetch(
      `${CONFIG.API_GATEWAY.API_URL}${CONFIG.API_GATEWAY.API_VERSION}/auth/login`,
      {
        method: "POST",
        headers: {
          "X-API-KEY": CONFIG.X_API_KEY,
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

export async function signup(formData: AuthFormData): Promise<string | null> {
  return await withErrorHandler(async () => {
    const { email, password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      return "Xác nhận mật khẩu giống với mật khẩu";
    }
    const body = JSON.stringify({ email, password, role: "user" });

    const res = await fetch(
      `${CONFIG.API_GATEWAY.API_URL}${CONFIG.API_GATEWAY.API_VERSION}/auth/register`,
      {
        method: "POST",
        headers: {
          "X-API-KEY": CONFIG.X_API_KEY,
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

export async function Logout() {
  const token = await getAccessToken();
  if (!token) return;

  await fetch(
    `${CONFIG.API_GATEWAY.API_URL}${CONFIG.API_GATEWAY.API_VERSION}/auth/logout`,
    {
      method: "POST",
      headers: {
        "X-API-KEY": CONFIG.X_API_KEY,
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    }
  );
}

export async function sendResetPassword(formData: AuthFormData) {
  return await withErrorHandler(async () => {
    console.log(formData);
    return null;
  });
}

export async function resetPassword(formData: AuthFormData) {
  return await withErrorHandler(async () => {
    console.log(formData);
    return null;
  });
}

export async function sendVerifyEmail(email: string): Promise<string | null> {
  return await withErrorHandler(async () => {
    const res = await fetch(
      `${CONFIG.API_GATEWAY.API_URL}${CONFIG.API_GATEWAY.API_VERSION}/auth/send-email/${email}`,
      {
        method: "POST",
        headers: {
          "X-API-KEY": CONFIG.X_API_KEY,
        },
      }
    );

    if (!res.ok) {
      const error = await res.json();
      return error.message;
    }

    return null;
  });
}

export async function verifyEmail(token: string): Promise<string | null> {
  return await withErrorHandler(async () => {
    const res = await fetch(
      `${CONFIG.API_GATEWAY.API_URL}${CONFIG.API_GATEWAY.API_VERSION}/auth/verify-email/${token}`,
      {
        headers: {
          "X-API-KEY": CONFIG.X_API_KEY,
        },
      }
    );

    if (!res.ok) {
      const error = await res.json();
      return error.message;
    }

    return null;
  });
}

export async function getMe() {
  const res = await fetch("/api/auth/me");
  const data: GetMeResponse = await res.json();

  return data;
}
