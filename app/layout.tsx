import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// layout.tsx or any other component
import { metadata } from '../metadata'; // Adjust the import path as needed
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from 'next/script'
import Image from 'next/image'
const inter = Inter({ subsets: ["latin"] });
import Head from 'next/head';

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
      <body className={inter.className}>
		<nav className="bg-white shadow-lg h-25">
		<div className="max-w-6xl mx-auto px-6">
		<div className="flex justify-between items-center" style={{ paddingTop: "-50px" }}>
				{/* Website Logo */}
				<a href="#" className="flex items-center py-4">
					<Image src="/logo.png" alt="Jazaa Logo" width={150} height={150}  />
				</a>

				{/* Primary Navbar items */}
				<div className=" flex ">
					<a href="#features" className="py-4 px-4 text-blue-700 font-semibold hover:text-blue-500 transition duration-300">Features</a>
					<a href="#faq" className="py-4 px-2 mr-4 text-blue-700 font-semibold hover:text-blue-500 transition duration-300">FAQ</a>
					<a href="mailto:hello@jazaa.co" className="py-4 px-3 bg-blue-600 rounded font-semibold hover:text-blue-500 transition duration-300">Contact Sales</a>
				</div>
				{/* Secondary Navbar items */}
				{/* <div className="hidden md:flex items-center space-x-3">
				<a href="#contact" className="py-2 px-2 font-medium text-white bg-blue-600 rounded hover:bg-blue-500 transition duration-300">Get Started</a>
				</div> */}
			</div>
			</div>
		</nav>
		<main>{children}</main>
	</body>
    </html>
  );
}
