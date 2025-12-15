"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SWRDevTools } from "swr-devtools";

export function RootProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <SWRDevTools>{children}</SWRDevTools>
    </NextThemesProvider>
  );
}
