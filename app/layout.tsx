import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// layout.tsx or any other component
import { metadata } from '../metadata'; // Adjust the import path as needed

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
