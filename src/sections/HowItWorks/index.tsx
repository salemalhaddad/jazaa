import { Button } from "@/components/ui/button";
import { MdDiscount, MdMessage } from "react-icons/md";
import { FaRegCreditCard } from "react-icons/fa";

const data = [
    {
        step: "01",
        title: "Choose when and how you'd like to reward customers",
        icon: <MdDiscount className="text-4xl text-blue-500 mb-4" />,
        description: "Select the rewards you want to offer to your customers after their last visit."
    },
    {
        step: "02",
        title: "Automated message is sent",
        icon: <MdMessage className="text-4xl text-blue-500 mb-4" />,
        description: "Send automated WhatsApp or SMS messages to customers X days after their last visit with a reward of Y."
    },
    {
        step: "03",
        title: "Online payment is then received",
        icon: <FaRegCreditCard className="text-4xl text-blue-500 mb-4" />,
        description: "Our AI agent will follow up with your customers to ensure they receive their rewards and are satisfied with your service."
    }
];

const HowItWorks: React.FC = ({}) => {
    return (
        <div id="hiw" className="flex flex-col items-center justify-start gap-16 min-h-[40vh] text-center mt-16 mb-16">
            <div className="flex flex-col items-center justify-center gap-2">
                <p className="font-semibold uppercase text-primary">How it works?</p>
                <h1 className="text-[40px] font-semibold">Few Easy Steps and Done</h1>
                <p className="text-slate-500 mb-10">
                    Follow these simple steps to automate your customer engagement process. <br />
                    Ensure consistent communication and rewards with our streamlined system.
                </p>
            </div>

            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-20">
                {data.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center justify-center gap-2 relative">
                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full bg-primary absolute top-[-20px] left-[-20px]">
                            <p className="text-white">{item.step}</p>
                        </div>
                        <div className="h-[200px] w-[200px] rounded-lg bg-slate-800 flex flex-col items-center justify-center p-4 text-white">
                            {item.icon}
                            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                            <p className="text-slate-300">
                            </p>
                        </div>
                    </div>
                ))}
            </div>


        </div>
    );
};

export default HowItWorks;
