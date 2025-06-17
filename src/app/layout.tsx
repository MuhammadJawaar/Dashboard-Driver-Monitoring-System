
import ToastThemeProvider from "@/components/ToastThemeProvider/ToastThemeProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "DMS Dipyo",
  description: "This is DMS Dipyo, a Driving Monitoring System",
};

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
