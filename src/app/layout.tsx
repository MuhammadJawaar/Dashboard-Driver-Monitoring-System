"use client";

import { SessionProvider } from "next-auth/react";
import ToastThemeProvider from "@/components/ToastThemeProvider/ToastThemeProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider refetchInterval={0}>
          {children}
          <ToastThemeProvider />
        </SessionProvider>
      </body>
    </html>
  );
}
