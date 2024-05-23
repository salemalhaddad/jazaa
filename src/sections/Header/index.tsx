import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { PopupButton } from '@typeform/embed-react'

const Header = () => {
	return (
		<div className="w-full h-[120vh] flex items-center justify-center flex-col text-center relative overflow-hidden gap-6 pt-[500px]">
			<h1 className="text-7xl font-bold leading-snug">
				Double your repeat <br />
				customers with Jazaa
			</h1>
			<p className="text-[#90A3BF] text-xl leading-normal">
				Your AI agent for <br /> rewarding your
				current customer base through WhatsApp
			</p>
			<div className="flex items-center justify-center gap-6 mb-[50px]">
			<a href="https://form.typeform.com/to/S61rXVTl">
				<Button variant="default">Get a Free Demo</Button>
			</a>
				<Link href="/#pricing">
					<Button variant="secondary">See Pricing</Button>
				</Link>
			</div>

			<div className="min-h-[852px] w-[1200px] bg-slate-800 rounded-lg" />

			{/* <Image
				src="/images/Dashboard.png"
				alt="Dashboard"
				width={1200}
				height={852}
			/> */}
		</div>
	);
};

export default Header;

