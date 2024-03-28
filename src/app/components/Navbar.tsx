'use client'
import React, {useState, useEffect} from "react";
import Image from "next/image";
import Link from "next/link";
import { UserAuth } from "../../context/AuthContext";

export default function Navbar() {
	const { user, googleSignIn, logOut } = UserAuth();
	const [loading, setLoading] = useState(true);

	const handleSignIn = async () => {
		try {
			await googleSignIn();
		} catch (error) {
			console.log(error);
		}
	}

	const handleSignOut = async () => {
		try {
			await logOut();
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		const checkAuthentication = async () => {
			await new Promise((resolve) => setTimeout(resolve, 50));
			setLoading(false);
		};
		checkAuthentication();
	}, [user]);

	return (
		<div>
			<nav className="shadow-lg bg-white h-25 flex items-center justify-between px-6">
				{/* Website Logo */}
				<a href="#" className="flex items-center">
					<Image src="/Jazaa.png" alt="Jazaa Logo" width={110} height={110}  />
				</a>

				{/* Primary Navbar items */}
				<div className=" flex space-x-5">
					{loading ? null : !user ? (
						<div className=" flex space-x-5 m-10">
						<a href="#how-it-works" className="text-blue-700 font-semibold hover:text-blue-500 transition duration-300">How It Works</a>
						<a href="#features" className="text-blue-700 font-semibold hover:text-blue-500 transition duration-300">Features</a>
						<a href="#faq" className="text-blue-700 font-semibold hover:text-blue-500 transition duration-300">FAQ</a>
						{/* <a onClick={handleSignIn} className="bg-blue-600 px-4 py-2 rounded font-semibold hover:text-blue-500 transition duration-300">
							Sign In
						</a> */}
						</div>
					) : (
						<div className="flex items-center">
							<a className="text-blue-700 font-semibold hover:text-blue-500 mr-4 ">Welcome, {user.displayName}</a>
							<a onClick={handleSignOut} className="bg-blue-600 px-4 py-2 rounded font-semibold hover:text-blue-500 transition duration-300">
								Sign Out
							</a>
						</div>
					)}
				</div>
			</nav>


		</div>);
}


