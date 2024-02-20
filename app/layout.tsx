import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// layout.tsx or any other component
import { metadata } from '../metadata'; // Adjust the import path as needed
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from 'next/script'

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
		<head>
			<Script async src="https://www.googletagmanager.com/gtag/js?id=G-KBW8FJK6EF"></Script>
			<Script id="google-analytics"> {
			`
			window.dataLayer = window.dataLayer || [];
			function gtag(){dataLayer.push(arguments);}
			gtag('js', new Date());

			gtag('config', 'G-KBW8FJK6EF');
			`}
			</Script>
		</head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
