"use server";

import { withErrorHandler } from "@/lib/utils";
import { AuthFormData } from "@/types/formAuth.type";

async function Await(second: number) {
  return new Promise((res) => setTimeout(() => res(""), second * 1000));
}

export async function signin(formData: AuthFormData): Promise<string | null> {
  return await withErrorHandler(async () => {
    await Await(2).then(() => {
      throw new Error("Tài khoản này không tồn tại!");
    });

    console.log(formData);
    return null;
  });
}

export async function signup(formData: AuthFormData): Promise<string | null> {
  return await withErrorHandler(async () => {
    await Await(2);
    console.log(formData);
    return null;
  });
}

export async function sendResetPassword(formData: AuthFormData) {
  return await withErrorHandler(async () => {
    await Await(2);
    console.log(formData);
    return null;
  });
}

export async function resetPassword(formData: AuthFormData) {
  return await withErrorHandler(async () => {
    await Await(2);
    console.log(formData);
    return null;
  });
}
