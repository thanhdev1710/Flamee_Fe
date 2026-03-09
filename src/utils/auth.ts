"use server";

import { cookies } from "next/headers";
import { COOKIE } from "@/global/cookie";

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE.access_token)?.value || null;
  return token;
}
