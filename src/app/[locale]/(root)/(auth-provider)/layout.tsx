import AuthProvider from "@/components/provider/AuthProvider";
import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
