// This directive ensures that the code runs on the client side
"use client";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Benefits from "@/sections/Benefits";
import Header from "@/sections/Header";
import HowItWorks from "@/sections/HowItWorks";
import Pricing from "@/sections/Pricing";
import Testimonials from "@/sections/Testimonials";
import WhyUs from "@/sections/WhyUs";
import React, { useEffect } from 'react';
import mixpanel from '../utils/mixpanel';
import { useRouter } from "next/navigation";

export default function Home() {
	useEffect(() => {
		if (typeof window !== 'undefined') {
			mixpanel.track('Page View', {
			  page: 'Home',
			});
		  }
	}, []);

	return (
		<main>
			<div className="bg-[#0D121F] px-[20px] md:px-[90px] text-white">
				<Navbar />
				<Header />
			</div>
			{/* Uncomment the sections below as needed */}
			{/* <Benefits /> */}
			{/* <HowItWorks /> */}
			{/* <WhyUs /> */}
			{/* <Testimonials /> */}
			{/* <Pricing /> */}
			<Footer />
		</main>
	);
}
