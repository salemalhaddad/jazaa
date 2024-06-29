import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import { MdWhatsapp, MdArrowRight, MdDiscount, MdNotifications } from 'react-icons/md';

const Header = () => {
	const notifications = [
		{ message: "one month" },
		{ message: "one week" },
		{ message: "one day" },
	];
	const rewards = [
		{ reward: "15% discount" },
		{ reward: "25% discount" },
		{ reward: "10% discount" },
	];
	const customerNames = [
		{ name: "Sarah" },
		{ name: "Mohamed" },
		{ name: "John" },
	];
	const productNames = [
		{ product: "Oud Super Package" },
		{ product: "Gym Membership" },
		{ product: "Spa Package" },
	];

	const [currentNotification, setCurrentNotification] = useState(notifications[0].message);
	const [notificationIndex, setNotificationIndex] = useState(0);
	const [customerName, setCustomerName] = useState(customerNames[0].name);
	const [reward, setReward] = useState(rewards[0].reward);
	const [product, setProduct] = useState(productNames[0].product);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setNotificationIndex((i) => {
				const nextIndex = (i + 1) % notifications.length;
				setCurrentNotification(notifications[nextIndex].message);
				setCustomerName(customerNames[nextIndex].name);
				setReward(rewards[nextIndex].reward);
				setProduct(productNames[nextIndex].product);
				return nextIndex;
			});
		}, 4000);
		return () => clearInterval(intervalId);
	}, []);

	return (
		<div className="w-full h-full flex flex-col items-center justify-center gap-6">
			<div className="text-center">
				<h1 className="text-4xl sm:text-5xl lg:text-7xl mb-4 sm:mb-6 font-bold leading-snug">
					Double your repeat <br /> customers with Jazaa
				</h1>
				<p className="text-lg sm:text-xl lg:text-2xl text-[#90A3BF] leading-normal">
					Automate rewarding customers 1 day/week/month <br /> since their last visit or purchase.
				</p>
			</div>
			<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
				<a href="https://jazaa.recatch.cc/meeting/utxnirulve">
					<Button variant="default">Get a Free Demo</Button>
				</a>
				<a href="mailto:hello@jazaa.co">
					<Button variant="secondary">Contact Us</Button>
				</a>
			</div>


			<div className="flex md:flex-row flex-col items-center m-8">
				<div className="flex flex-col bg-white rounded-xl shadow-lg p-4 text-gray-800 w-full ">
					<div className="flex items-center mb-1">
						<MdDiscount className="text-4xl text-blue-500 flex-shrink-0" />
						<h3 className="text-lg font-semibold mb-2 ml-4">Choose your customer reward preferences</h3>
					</div>
					<div className=" bg-blue-60 p-2 transition-all duration-500 ease-in-out ">
						{/* Dynamic Sentence */}
						<div className="text-center bg-gradient-to-r from-white to-blue-60 border border-blue-500 p-4 rounded-lg shadow-lg transition-all duration-500 ease-in-out">
							<p className="text-lg font-semibold">I want to reach out to my customer <span className="bg-blue-50 text-blue-600 py-0.25 px-2 font-bold rounded-full animate-bounce-out-in">one month</span> after their last visit with <span className="bg-blue-50 text-blue-600 py-0.25 px-2 rounded-full font-bold animate-bounce-out-in">10% discount</span> on <span className="bg-blue-50 text-blue-600 py-0.25 px-2 rounded-full font-bold animate-bounce-out-in">Spa Package</span>.</p>
						</div>
					</div>
				</div>
				{/* Arrow icon */}
				<MdArrowRight className="md:text-9xl text-blue-500 my-4 rotate-90  md:rotate-0 text-5xl mx-auto" />
				{/* Phone Call */}
				<div className="flex flex-col bg-white rounded-xl shadow-lg p-4 text-gray-800 w-full ">
					<div className="flex items-center mb-2">
					<MdNotifications className="text-4xl text-blue-500 flex-shrink-0" />
						<h3 className="text-lg flex-grow font-semibold mb-2 ml-4">Get a reminder over WhatsApp</h3>
					</div>
					<div className=" bg-blue-60 p-4 transition-all duration-500 ease-in-out">
					<p className="flex-grow">Hi Ahmed, <span className="bg-blue-50 text-blue-600 py-0.25 px-2 font-bold rounded-full bg-blue-50 animate-bounce-out-in">Ali</span>&apos;s last visit/purchase was  <span className="bg-blue-50 text-blue-600 py-0.25 bg-blue-50 px-2 font-bold rounded-full animate-bounce-out-in">one month</span> ago for <span className="bg-blue-50 text-blue-600 py-0.25 px-2 font-bold rounded-full bg-blue-50 animate-bounce-out-in">Spa Package</span>. Would you like to send him/her a <span className="bg-blue-50 text-blue-600 py-0.25 px-2 font-bold rounded-full animate-bounce-out-in">10% discount</span> on their next <span className="bg-blue-50 text-blue-600 py-0.25 px-2 rounded-full font-bold animate-bounce-out-in">Spa Package</span> order? Below is a sample message you could use along with a payment link.</p>
					</div>
				</div>
				<MdArrowRight className="md:text-9xl text-blue-500 my-4 rotate-90 md:rotate-0 text-5xl mx-auto" />
				{/* WhatsApp message */}
				<div className="flex flex-col bg-white rounded-xl shadow-lg p-4 text-gray-800 w-full ">
					<div className="flex items-center ">
						<MdWhatsapp className="text-4xl text-blue-500 flex-shrink-0" />
						<h3 className="text-lg font-semibold mb-1 ml-4">Automated WhatsApp message to your customer</h3>
					</div>

					<div className=" bg-blue-60 p-4 transition-all duration-500 ease-in-out">
					<p className="mt-1">Hi <span className="bg-blue-50 text-blue-600 py-0.25 px-2 font-bold rounded-full bg-blue-50 animate-bounce-out-in">Ali</span> 👋, it&apos;s been <span className="bg-blue-50 text-blue-600 py-0.25 bg-blue-50 px-2 font-bold rounded-full animate-bounce-out-in">one month</span> since your last visit! Come back for a session and get <span className="bg-blue-50 text-blue-600 py-0.25 px-2 font-bold rounded-full animate-bounce-out-in">10% discount</span> on your next purchase of <span className="bg-blue-50 text-blue-600 py-0.25 px-2 rounded-full font-bold animate-bounce-out-in">Spa Package</span>. <br></br>  <br></br>  Offer is only valid for the next 24 hours so you can pay here: <a href="https://jazaa.co/pay/?id=719" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">https://jazaa.co/pay/?id=719</a> </p>
					</div>
				</div>
			</div>


			{/* <div className="flex flex-wrap justify-center items-center gap-4 p-6 mb-7">
				<h2 className="w-full text-center text-2xl font-semibold mb-4">Products We Integrate With</h2>
				<div className="flex justify-center items-center gap-6">
					<img src="/foodics.png" alt="Product 1 Logo" className="h-12 filter grayscale hover:grayscale-0 transition duration-300" />
					<img src="/shopify.webp" alt="Product 2 Logo" className="h-12 filter grayscale hover:grayscale-0 transition duration-300" />

				</div>
			</div> */}
		</div>
	);
};

export default Header;
