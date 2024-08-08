"use client"
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from 'react';
import { MdWhatsapp, MdArrowRight, MdDiscount, MdNotifications, MdPlayArrow } from 'react-icons/md';
import Image from 'next/image';

const Header = () => {
	const [isClient, setIsClient] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isPlaying, setIsPlaying] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	return (
		<div className="w-full h-full flex flex-col md:flex-row items-center justify-between gap-8 px-4 sm:px-8 lg:px-16 py-8">
			<div className="w-full md:w-1/2 flex flex-col items-start justify-center gap-8 mb-10">
				<div className="max-w-2xl">
					<h1 className="text-2xl sm:text-3xl lg:text-4xl mb-4 sm:mb-6 font-bold leading-snug">
						Double Your Revenue: Turn One-Time Buyers into Loyal Fans
					</h1>
					<p className="text-sm sm:text-base lg:text-lg text-[#90A3BF] leading-normal">
						Effortlessly increase customer retention using personalized WhatsApp discounts. Start now and see results in only 30 days!
					</p>
				</div>
				<div className="flex flex-col sm:flex-row items-start justify-start gap-4 mb-6 w-full">
					<a href="https://jazaa.recatch.cc/meeting/utxnirulve" className="w-full sm:w-auto">
						<Button variant="default" className="text-base sm:text-lg px-4 sm:px-6 py-2 sm:py-3 w-full">Get a Free Demo</Button>
					</a>
					<a href="mailto:hello@jazaa.co" className="w-full sm:w-auto">
						<Button variant="secondary" className="text-base sm:text-lg px-4 sm:px-6 py-2 sm:py-3 w-full">Contact Us</Button>
					</a>
				</div>

				<div className="w-full">
					<h2 className="text-xl sm:text-2xl font-bold mb-4">Available Integrations</h2>
					<div className="flex flex-row items-center gap-4 sm:gap-5">
					<Image src="/shopify.webp" alt="Shopify Logo" width={200} height={200} className="w-28 h-28 sm:w-32 sm:h-32 object-contain filter grayscale hover:grayscale-0 transition duration-300" />
					<Image src="/ziina.png" alt="Ziina Logo" width={200} height={200} className="w-24 h-24 sm:w-28 sm:h-28 object-contain filter grayscale hover:grayscale-0 transition duration-300" />
					<Image src="/Packman.png" alt="Packman Logo" width={40} height={40} className="w-10 h-10 sm:w-14 sm:h-14 object-contain filter grayscale hover:grayscale-0 transition duration-300" />
					<Image src="/csv-logo.png" alt="CSV Logo" width={40} height={40} className="w-10 h-10 sm:w-14 sm:h-14 object-contain filter grayscale ml-2 hover:grayscale-0 transition duration-300" />

					</div>
				</div>
			</div>

			<div className="w-full md:w-1/2 flex justify-center items-center mt-8 md:mt-0">
				<div className="bg-gray-200 p-2 rounded-lg shadow-lg w-full max-w-[320px]">
					<div className="relative">
						<video
							width="100%"
							height="auto"
							playsInline
							ref={videoRef}
							onClick={() => {
								if (videoRef.current) {
									if (videoRef.current.paused) {
										videoRef.current.play();
										setIsPlaying(true);
									} else {
										videoRef.current.pause();
										setIsPlaying(false);
									}
								}
							}}
						>
							<source src="/Jazaa Demo.mp4" type="video/mp4" />
							Your browser does not support the video tag.
						</video>
						{!isPlaying && (
							<button
								className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-lg"
								onClick={() => {
									if (videoRef.current) {
										videoRef.current.play();
										setIsPlaying(true);
									}
								}}
							>
								<MdPlayArrow size={40} />
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Header;
