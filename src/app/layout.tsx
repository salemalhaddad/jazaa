import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Jazaa - Reward your recent visitors",
	description: "Jazaa is helps automate rewarding your recent customers through WhatsApp",
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			    <script async defer crossOrigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js"></script>
				
			<body className={font.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem
					disableTransitionOnChange>
					<SupabaseProvider>
						<UserProvider>{children}</UserProvider>
					</SupabaseProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
