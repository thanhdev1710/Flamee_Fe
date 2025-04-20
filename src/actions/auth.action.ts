import { CONFIG } from "@/global/config";
import { withErrorHandler } from "@/lib/utils";
import { AuthFormData } from "@/types/formAuth.type";

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

    console.log(res.headers.get("Set-Cookie"));

    return null;
  });
}

export async function signup(formData: AuthFormData): Promise<string | null> {
  return await withErrorHandler(async () => {
    console.log(formData);
    return null;
  });
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
