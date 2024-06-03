"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import {
	useSessionContext,
	useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MdArrowDownward } from "react-icons/md";

const SignIn = () => {
	const supabaseClient = useSupabaseClient();
	const { session } = useSessionContext();

	const user = session?.user

	const router = useRouter();

	

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

	return (
		<div className="grid grid-cols-2 items-center min-h-screen">
			<div className="w-full h-full bg-slate-900">
				<div className="flex flex-col items-center justify-center gap-4 h-full mx-7">
					<h2 className="text-2xl font-bold text-white mb-4">Onboarding Steps</h2>
					<div className="flex flex-col items-center justify-center">
						<p className="text-blue-400 mb-4">Step 1: Sign Up </p>
						<MdArrowDownward className="h-8 w-8 text-blue-400 mb-4" />
						<p className="text-gray-300 mb-4">Step 2: Enter your details </p>
						<MdArrowDownward className="h-8 w-8 text-blue-400 mb-4" />
						<p className="text-gray-300">Step 3: Connect Stripe for Payments</p>
					</div>
				</div>
			</div>
			<div className="flex items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<h1 className="text-3xl font-bold">Welcome back</h1>
					<p className="text-gray-500">Sign in to your account to continue</p>
					<div className="w-[350px]">
						<Auth
							supabaseClient={supabaseClient}
							providers={["google", "facebook"]}
							magicLink={true}
							
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
			
		</div>
	);
};

export default SignIn;
