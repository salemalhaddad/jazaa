import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { PopupButton } from '@typeform/embed-react'
import { useEffect, useState } from 'react'
import { MdKeyboardArrowDown, MdNotifications, MdChat, MdWhatsapp } from 'react-icons/md'; // Added MdChat for WhatsApp icon
import { MdArrowDownward, MdArrowRight, MdMessage, MdDiscount, MdPhone } from 'react-icons/md';
import ReCatchEmbed from '@/components/ReCatchEmbed';

const Header = () => {
	interface NotificationMap {
		[key: string]: JSX.Element | string;
	}

	const notifications = [
		{ message: "one month" },
		{ message: "one week" },
		{ message: "one day" }
		];
	const rewards = [
		{ reward: "15% discount" },
		{ reward: "25% discount" },
		{ reward: "10% discount" },
	]
	const customerNames = [
		{ name: "Sarah" },
		{ name: "Mohamed" },
		{ name: "John" },
	]


	const [currentNotification, setCurrentNotification] = useState(notifications[0].message);
	const [notificationIndex, setNotificationIndex] = useState(0);
	const [customerName, setCustomerName] = useState(customerNames[0].name);
	const [reward, setReward] = useState(rewards[0].reward);

	useEffect(() => {
	// Cycle through notifications every 4 seconds
		const intervalId = setInterval(() => {
			setNotificationIndex((i) => {
				const nextIndex = (i + 1) % notifications.length;
				setCurrentNotification(notifications[nextIndex].message);
				setCustomerName(customerNames[nextIndex].name);
				setReward(rewards[nextIndex].reward);
				return nextIndex;
			});
	}, 4000);
	return () => clearInterval(intervalId);
	}, []);
	
	return (
		<div className="w-full h-[90vh] flex items-center justify-center flex-col text-center relative gap-6 ">
			<h1 className="text-7xl font-bold leading-snug">
				Double your repeat <br />
				customers with Jazaa
			</h1>
			<p className="text-[#90A3BF] text-2xl leading-normal">
				Your AI agent for <br /> rewarding your
				recent customers through WhatsApp
			</p>
			<div className="flex items-center justify-center gap-6 mb-[10px]">
			<a href="https://jazaa.recatch.cc/meeting/utxnirulve">
				<Button variant="default">Get a Free Demo</Button>
			</a>

			<a href="mailto:hello@jazaa.co"><Button variant="secondary">Contact Us</Button></a>
				{/* <Link href="/#pricing">
					<Button variant="secondary">See Pricing</Button>
				</Link> */}
			</div>

			<form className="jazaa-onboarding"></form>
			{/* Notification box */}
		<div className="md:ml-10 md:mt-0 md:flex md:flex-row grid grid-cols-1 md:grid-cols-3 items-center m-10 ">
			<div className="flex flex-col bg-white rounded-xl shadow-lg p-4 text-gray-800 w-full ">
					<div className="flex items-center mb-1">
						<MdDiscount className="text-4xl text-blue-500 flex-shrink-0" />
						<h3 className="text-lg font-semibold mb-2 ml-4">Choose your customer reward preferences</h3>
					</div>
					<div className=" bg-blue-60 p-2 transition-all duration-500 ease-in-out ">
						{/* Dynamic Sentence */}
						<div className="text-center bg-gradient-to-r from-white to-blue-60 border border-blue-500 p-4 rounded-lg shadow-lg transition-all duration-500 ease-in-out">
							<p className="text-lg font-semibold">I want to reach out to my customer <span className="bg-blue-50 text-blue-600 py-0.25 px-2 font-bold rounded-full animate-bounce-out-in">{currentNotification}</span> after their last visit with <span className="bg-blue-50 text-blue-600 py-0.25 px-2 rounded-full font-bold animate-bounce-out-in">{reward}</span>.</p>
						</div>
					</div>
						{/* <div className="p-2 bg-white rounded-lg shadow-md">
        <p className="text-lg font-semibold">
            I want to reach out to my customer
            <span className="bg-blue-100 text-blue-600 py-0.25 px-2 font-bold rounded-full shadow-sm">{currentNotification}</span>
            after their last visit with
            <span className="bg-blue-100 text-blue-600 py-0.25 px-2 rounded-full font-bold shadow-sm">{reward}</span>.
        </p>
    </div>
</div> */}

					{/* Buttons */}
					{/* <div className="flex justify-center space-x-6 mt-5">
						<button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300">
						Confirm
						</button>
						<button className="bg-white text-blue-600 mr-10 px-4 py-2 rounded hover:bg-red-600 transition duration-300">
						Change Offer
						</button>
					</div> */}
				</div>
				{/* Arrow icon */}
				<MdArrowRight className="md:text-9xl text-blue-500 my-4 rotate-90  md:rotate-0 text-5xl mx-auto" />
				{/* Phone Call */}
				{/* <div className="flex flex-col bg-blue-100 rounded-xl shadow-lg p-4 text-gray-800 w-full ">
					<div className="flex items-center mb-2">
						<FaRobot className="text-4xl text-blue-500 flex-shrink-0" />
						<h3 className="text-lg flex-grow font-semibold mb-2 ml-4">Our AI agent calls your customer</h3>
					</div>
					<div className=" bg-blue-60 p-4 transition-all duration-500 ease-in-out">
					<p className="flex-grow">Jazaa‘s AI agent will call your customer and offers them the reward, directing them to pay over SMS or WhatsApp.</p>
					</div>
				</div> */}
				{/* <MdArrowRight className="md:text-9xl text-blue-500 my-4 rotate-90 md:rotate-0 text-5xl mx-auto" /> */}
				{/* WhatsApp message */}
				<div className="flex flex-col bg-white rounded-xl shadow-lg p-4 text-gray-800 w-full ">
					<div className="flex items-center ">
						<MdWhatsapp className="text-4xl text-blue-500 flex-shrink-0" />
						<h3 className="text-lg font-semibold mb-1 ml-4">Automated WhatsApp message to customer</h3>
					</div>
					<div className=" bg-blue-60 p-4 transition-all duration-500 ease-in-out">
					<p className="mt-1">Hi <span className="bg-blue-50 text-blue-600 py-0.25 px-2 font-bold rounded-full bg-blue-50 animate-bounce-out-in">{customerName}</span> 👋, it&apos;s been <span className="bg-blue-50 text-blue-600 py-0.25 bg-blue-50 px-2 font-bold rounded-full animate-bounce-out-in">{currentNotification}</span> since your last visit! Come back for a session and get <span className="bg-blue-50 text-blue-600 py-0.25 px-2 font-bold rounded-full animate-bounce-out-in">{reward}</span> on your next visit. <br></br>  <br></br>  Offer is only valid for the next 24 hours so you can pay here: <a href="https://jazaa.co/pay/?id=719" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">https://jazaa.co/pay/?id=719</a> <br></br>  <br></br> Let us know if you have any questions!</p>
					</div>
				</div>
			</div>			

			{/* <Image className="rounded-lg" src="/Dashboard-ui.png" alt="dashboard ui" width={1100} height={852}/> */}

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

