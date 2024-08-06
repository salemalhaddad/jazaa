import { Button } from "@/components/ui/button";

const Footer: React.FC = () => {
	return (
		<footer>
			<div className="mx-auto w-full lg:py-5">
				<div className="flex flex-col items-center justify-center">
					<a href="/" className="flex items-center mb-4">
						<span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
							Jazaa™
						</span>
					</a>
					<a href="mailto:hello@jazaa.co"><Button>Contact Us</Button></a>
					<span className="text-sm text-gray-500 mt-4 dark:text-gray-400">
						© 2024 Jazaa. All Rights Reserved.
					</span>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
