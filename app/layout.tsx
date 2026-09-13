import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { DataProvider } from "@/context/DataContext";
import { ToastProvider } from "@/context/ToastContext";

export const metadata: Metadata = {
  title: "Skandhas Masala | Billing",
  description: "Billing & invoicing system for Skandhas Masala"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider>
          <DataProvider>
            <ToastProvider>{children}</ToastProvider>
          </DataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
