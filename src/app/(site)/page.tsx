"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { useSessionContext } from "@supabase/auth-helpers-react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Benefits from "@/sections/Benefits";
import Header from "@/sections/Header";
import HowItWorks from "@/sections/HowItWorks";
import Pricing from "@/sections/Pricing";
import Testimonials from "@/sections/Testimonials";
import WhyUs from "@/sections/WhyUs";

export default function Home() {
  const router = useRouter();
  const { session } = useSessionContext();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (session?.user !== undefined) {
      router.push('/create-payment-link');
    } else {
		setLoading(false);
	}
  }, [router, session?.user]);

  return (
    <main className="bg-[#0D121F] min-h-screen">
      <div className="px-[20px] md:px-[90px] text-white">
        <Navbar />
        <Header />
      </div>
      {/* Uncomment the sections below as needed */}
      {/* <Benefits /> */}
      {/* <HowItWorks /> */}
      {/* <WhyUs /> */}
      {/* <Testimonials /> */}
      {/* <Pricing /> */}
      {/* <Footer /> */}
    </main>
  );
}
