import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenCMS site",
  description: "A Next.js site powered by OpenCMS.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
