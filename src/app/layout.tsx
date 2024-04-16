import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// layout.tsx or any other component
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from 'next/script'
import Image from 'next/image'
const inter = Inter({ subsets: ["latin"] });
import Head from 'next/head';
import { Navbar } from './components/Navbar'
import * as Frigade from '@frigade/react';


const FRIGADE_API_KEY = "api_public_7d1ybWu2ZunHuIfjK8qZWRrSkVyWuTu52WM7N1eKG2IFDeQCEkTVZGMdZNvCUZQX";

export const metadata: Metadata = {
  title: 'Jazaa: Helping you attract more repeat customers through WhatsApp',
  description: 'Jazaa helps businesses leverage WhatsApp to attract customers for repeat visits.',
};

export default function RootLayout({ children, } : any) {
  return (
    <html lang="en">
		<Frigade.Provider apiKey={FRIGADE_API_KEY}>
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

		<Navbar></Navbar>
		<main>{children}</main>


	</body>
	</Frigade.Provider>
    </html>
  );
}


