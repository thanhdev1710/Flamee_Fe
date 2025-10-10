"use client";
import { useSessionCheck } from "@/hooks/auth";
import React, { ReactNode } from "react";

export default function AuthProvider({ children }: { children: ReactNode }) {
  useSessionCheck(15);
  return <>{children}</>;
}
