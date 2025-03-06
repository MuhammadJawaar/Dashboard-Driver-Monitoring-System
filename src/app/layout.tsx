"use client";


import ToastThemeProvider from "@/components/ToastThemeProvider/ToastThemeProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>

          {children}
          <ToastThemeProvider />

      </body>
    </html>
  );
}
