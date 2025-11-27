import AuthProvider from "@/components/provider/AuthProvider";
import { PresenceSocketProvider } from "@/components/provider/PresenceSocketProvider";
import { UserActivityProvider } from "@/components/provider/UserActivityProvider";
import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <UserActivityProvider />
      <PresenceSocketProvider />
      {children}
    </AuthProvider>
  );
}
