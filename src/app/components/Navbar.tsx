'use client'
import React, {useState, useEffect} from "react";
import Image from "next/image";
import Link from "next/link";


export const Navbar = () => {

	return (
		<div>
			<nav className="shadow-lg bg-white h-25 flex items-center justify-between px-6">
				{/* Website Logo */}
				<a href="/" className="flex items-center">
					<Image src="/Jazaa.png" alt="Jazaa Logo" width={110} height={110}  />
				</a>

				{/* Primary Navbar items */}
				<div className=" flex space-x-5">
					<Link legacyBehavior href="#how-it-works">
						<a className="text-blue-700 font-semibold hover:text-blue-500">How It Works</a>
					</Link>
					<Link legacyBehavior href="#features">
						<a className="text-blue-700 font-semibold hover:text-blue-500">Features</a>
					</Link>
					<Link legacyBehavior href="#faq">
						<a className="text-blue-700 font-semibold hover:text-blue-500">FAQs</a>
					</Link>
					<Link legacyBehavior href="#contact">
						<a className="text-blue-700 font-semibold hover:text-blue-500">Contact</a>
					</Link>

					

				</div>

			</nav>


		</div>);
};
