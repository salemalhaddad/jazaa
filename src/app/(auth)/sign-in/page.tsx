"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import {
	useSessionContext,
	useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdArrowDownward, MdPersonAdd, MdCloudUpload } from "react-icons/md";
import { IoMdLogIn } from "react-icons/io";
import dynamic from 'next/dynamic'


const SignIn = () => {
	const supabaseClient = useSupabaseClient();
	const { session } = useSessionContext();
	const [windowWidth, setWindowWidth] = useState(0);
	const [isMounted, setIsMounted] = useState(false);

	const user = session?.user

	const router = useRouter();

	useEffect(() => {
		// This code only runs on the client side
		setWindowWidth(window.innerWidth)
		setIsMounted(true)
	  }, [])

	// useEffect(() => {
	// 	if (user) {
	// 		const fetchBusinessName = async () => {
	// 			const { data, error } = await supabaseClient
	// 				.from('jazaa-users')
	// 				.select('businessName')
	// 				.eq('user_name', user?.user_metadata.full_name)
	// 				.single();
	// 			if (data && data.businessName == null) {
	// 				router.push("/onboarding");
	// 			} else {
	// 				router.push("/");
	// 			}
	// 		};
	// 		fetchBusinessName();
	// 	}
	// }, [session, router, supabaseClient]);

	if (!isMounted) {
		return null // or a loading indicator
	}

	return (
		<div className="md:grid md:grid-cols-2 flex flex-col items-center min-h-screen">
			<div className="flex items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<h1 className="text-3xl font-bold">Welcome back</h1>
					<p className="text-gray-500">Sign in to your account to continue</p>
					<div className="w-[350px]">
						<Auth
							supabaseClient={supabaseClient}
							providers={["google", "facebook"]}
							magicLink={true}
							queryParams={{
								hd: `${window.location.origin}/onboarding/upload-csv-data`,
							  }}

							appearance={{
								theme: ThemeSupa,
								variables: {
									default: {
										colors: {
											brand: "#0D121F",
											brandAccent: "#8057f0",
										},
									},
								},
							}}
							theme="light"
						/>
					</div>
				</div>
			</div>

			<div className="w-full h-full bg-slate-900 m-7">
				<div className="flex flex-col items-center justify-center m-5 gap-4 h-full mx-7">
					<h2 className="text-2xl font-bold text-white mb-4">Onboarding Steps</h2>
					<div className="flex flex-col items-center justify-center">
						<div className="flex flex-col items-center gap-4 justify-center">
							<div className="flex items-center gap-2">
								<IoMdLogIn className="h-6 w-6 text-blue-400" />
								<div className="flex flex-col">
								<p className="text-blue-400 ">Step 1: Sign Up </p>
								</div>
							</div>
							<MdArrowDownward className="h-8 w-8 text-blue-400 mb-4" />
							<div className="flex items-center gap-2">
								<MdPersonAdd className="h-6 w-6 text-gray-300" />
								<div className="flex flex-col">
									<p className="text-gray-300">Step 2: Enter your details </p>
								</div>
							</div>
							<MdArrowDownward className="h-8 w-8 text-blue-400 mb-4" />
							<div className="flex items-center gap-2">
								<MdCloudUpload className="h-6 w-6 text-gray-300" />
								<p className="text-gray-300">Step 3: Upload Customer Visits Data</p>
							</div>
						</div>
					</div>
				</div>
			</div>

		</div>
	);
};

export default SignIn;
