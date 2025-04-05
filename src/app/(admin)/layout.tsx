import React, { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <h1>Layout Admin</h1>
      {children}
    </div>
  );
}
