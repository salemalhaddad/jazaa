const data = [
	{
		image: "/whatsapp-icon.png",
		title: "Automated WhatsApp Messaging",
		description:
			"Let Jazaa take care of notifying customers with monthly and/or weekly personalized discounts and offers you agree on.",
	},
	{
		image: "/visa.png",
		title: "Seamless & Flexible Payments",
		description:
			"Make it easier for your customers to pay online using credit/debit cards or buy now pay later options.",
	},
	{
		image: "/graph.png",
		title: "Insights Dashboard",
		description:
			"Track and monitor customer profiles, accepted/rejected offers, and other insights on customer loyalty.",
	},
];

const Benefits: React.FC = () => {
	return (
		<div id="features" className="flex flex-col items-start justify-center gap-12 min-h-[100vh] text-left px-[50px] lg:px-[200px]">
			<div className="flex flex-col items-start justify-start gap-2">
				<p className="font-semibold uppercase mt-14 text-primary">Why use Jazaa</p>
				<div className="flex items-center gap-20">
					<h1 className="text-[40px] font-semibold">
						Making Customer Retention Automated, Flexible, and Insightful
					</h1>
					{/* <p className="text-[18px] w-[500px] font-light">
						We provide a wide array of services to help you manage your
						finances. Our services are easy to use, simple to understand and
						affordable for everyone.
					</p> */}
				</div>
			</div>

			<div className="flex flex-wrap items-start justify-between gap-4 w-full">
				{data.map((item, index) => (
					<div
						className="flex flex-col items-start gap-4 w-[384px]"
						key={index}>
						<div className="min-h-[384px] w-[384px] bg-slate-800 rounded-lg"></div>
						<div className="flex flex-col items-start justify-start gap-2">
							<p className="font-semibold uppercase text-primary text-lg">
								{item.title}
							</p>
							<p className="text-[16px]">{item.description}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Benefits;



