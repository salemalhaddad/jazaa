import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// layout.tsx or any other component
import { metadata } from '../../metadata'; // Adjust the import path as needed
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from 'next/script'
import Image from 'next/image'
const inter = Inter({ subsets: ["latin"] });
import Head from 'next/head';
import { AuthContextProvider } from '../context/AuthContext'
import Navbar from './components/Navbar'

export default function RootLayout({ children, } : any) {
  return (
    <html lang="en">
		<AuthContextProvider>
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

		<Navbar />
		<main>{children}</main>


	</body>
	</AuthContextProvider>
    </html>
  );
}


