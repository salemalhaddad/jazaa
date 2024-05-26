import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { PopupButton } from '@typeform/embed-react'

const Header = () => {
	return (
		<div className="w-full h-[120vh] flex items-center justify-center flex-col text-center relative overflow-hidden gap-6 ">
			<h1 className="text-7xl font-bold mt-40 leading-snug">
				Double your repeat <br />
				customers with Jazaa
			</h1>
			<p className="text-[#90A3BF] text-2xl leading-normal">
				Your AI agent for <br /> rewarding your
				recent customers through WhatsApp
			</p>
			<div className="flex items-center justify-center gap-6 mb-[10px]">
			<a href="https://form.typeform.com/to/S61rXVTl">
				<Button variant="default">Get a Free Demo</Button>
			</a>

			<a href="mailto:hello@jazaa.co"><Button variant="secondary" href="mailto:hello@jazaa.co">Contact Us</Button></a>
				{/* <Link href="/#pricing">
					<Button variant="secondary">See Pricing</Button>
				</Link> */}
			</div>

			<Image className="rounded-lg" src="/Dashboard-ui.png" alt="dashboard ui" width={1100} height={852}/>

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

