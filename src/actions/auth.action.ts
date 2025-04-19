"use server";

import { AuthFormData } from "@/types/formAuth.type";

async function Await(second: number) {
  return await new Promise((res) => setTimeout(() => res(""), second * 1000));
}

export async function signin(formData: AuthFormData) {
  await Await(2);
  console.log(formData);
}
export async function signup(formData: AuthFormData) {
  await Await(2);
  console.log(formData);
}
export async function sendResetPassword(formData: AuthFormData) {
  await Await(2);
  console.log(formData);
}
export async function resetPassword(formData: AuthFormData) {
  await Await(2);
  console.log(formData);
}
