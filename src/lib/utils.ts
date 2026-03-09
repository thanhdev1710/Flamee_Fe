import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function withErrorHandler<T>(
  fn: () => Promise<T>
): Promise<T | string> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return "Đã xảy ra lỗi không xác định";
  }
}

export function hexString(str: string) {
  return Buffer.from(str, "utf8").toString("hex");
}

export const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};
