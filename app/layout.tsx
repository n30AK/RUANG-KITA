import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RUANG KITA — Ruang Silaturahmi Digital",
  description:
    "Rumah digital komunitas untuk berkumpul, berdiskusi, berbagi agenda, dan mengunjungi pameran bersama.",
  applicationName: "RUANG KITA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
