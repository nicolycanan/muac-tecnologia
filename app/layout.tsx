import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muac Tecnologia",
  description:
    "Soluções de tecnologia e digitalização para negócios locais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}