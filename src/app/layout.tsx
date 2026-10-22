import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import "./globals.css";
import ReduxProvider from "@/components/providers/redux-provider";

export const metadata: Metadata = {
  title: { default: "Pulse — Find your people", template: "%s · Pulse" },
  description: "A thoughtful social space to share what moves you.",
  applicationName: "Pulse",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ReduxProvider>
            <ToastProvider>{children}</ToastProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
