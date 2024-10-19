"use client";
import { SetStateAction, useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { MdArrowDownward } from "react-icons/md";
import { useSessionContext } from "@supabase/auth-helpers-react";
import Stripe from 'stripe';

const Onboarding = () => {
    const supabaseClient = useSupabaseClient();
    const router = useRouter();
    const { session } = useSessionContext();
    const user = session?.user;

    const [businessName, setBusinessName] = useState("");
    const [businessType, setBusinessType] = useState("");
	const [userName, setUserName] = useState("");
    const [reasonForRegistering, setReasonForRegistering] = useState("");
    const [frequency, setRewardFrequency] = useState("");
    const [frequency_unit, setRewardFrequencyUnit] = useState("");
    const [terms, setTerms] = useState(false);

    useEffect(() => {
        console.log("Component mounted");
    }, []);

	useEffect(() => {
		// const checkUserSession = async () => {
			// const { data: { session }, error } = await supabaseClient.auth.getSession();
			if (session?.user !== undefined) {
				// User is not signed in, redirect to sign-in page with current URL
				const currentUrl = '/create-payment-link';
			} else {
				setLoading(false);
				router.push(`/sign-in?redirect=${encodeURIComponent('create-payment-link')}`);
			}
		// };

		// checkUserSession();
	}, [router, session?.user]);


	  const createPaymentLink = async () => {
		if (!productName || !originalAmount || !discountAmount) {
		  console.error('Missing required parameters');
		  return;
		}

		console.log('Sending request with data:', { productName, originalAmount, discountAmount });

		const response = await fetch('api/create-stripe-link', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${process.env.YOUR_SECRET_KEY}`,
		  },
		  body: JSON.stringify({
			productName: productName,
			amount: parseFloat(originalAmount),
			discount: parseFloat(discountAmount),
			currency: 'aed',
		  }),
		});

		const data = await response.json();

		if (data.url) {
		  setPaymentLinkUrl(data.url);
		} else {
		  console.error('NO API RESPONSE:', data.error);
		}
	  };

	  if (session?.user == undefined) {
		return <div>Loading...</div>;
	  }

	const handleUserNameChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setUserName(e.target.value);
    };

    const handleBusinessNameChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setBusinessName(e.target.value);

    };

    const handleBusinessTypeChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setBusinessType(e.target.value);
    };

    const handleReasonForRegisteringChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setReasonForRegistering(e.target.value);
    };

    const handleRewardFrequencyChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setRewardFrequency(e.target.value);
    };

    const handleRewardFrequencyUnitChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setRewardFrequencyUnit(e.target.value);
    };

    const handleTermsChange = (e: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
        setTerms(e.target.checked);
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log("Form submitted", user?.user_metadata.full_name);

        if (!terms) {
            alert("Please accept the terms and conditions");
            return;
        }

        const { data, error } = await supabaseClient
            .from('jazaa-users')
            .insert([
                {
                    user_name: userName,
                    business_name: businessName,
                    businessType: businessType,
                    reasonForRegistering: reasonForRegistering,
                    frequency: frequency,
                    frequency_unit: frequency_unit
                }
            ]);


        if (error) {
            console.log("Error in onboarding page", error);
        } else {
            console.log("Data insertion successful: ");

            const { error: updateUserError } = await supabaseClient.auth.updateUser({
				data: { full_name: businessName }
			});

            console.log('business name 1: ', businessName);

			const { data, error } = await supabaseClient.auth.updateUser({
				data: { full_name: businessName }
			})

            if (error) {
                console.log('not working')
            }
            else {
                console.log('business name 2: ',  data.user.user_metadata.full_name, 'and data is: ', data);
            }



            // const account = await stripe.accounts.create({
            //     country: 'AE',
            //     business_type: 'company',
            //     type: 'standard',
            //     email: user?.user_metadata.email,
            //     company: {
            //         name: businessName
            //     }
            //   });

            //   const accountLink = await stripe.accountLinks.create({
            //     account: account.id,
            //     refresh_url: 'https://jazaa.co/sign-in',
            //     return_url: 'https://jazaa.co/dashboard',
            //     type: 'account_onboarding',
            //   });

            router.push('/onboarding/upload-data');
        }
    };



    return (
        <div className="grid grid-cols-2 items-center min-h-screen">
            <div className="w-full h-full bg-slate-900">
                <div className="flex flex-col items-center justify-center gap-4 h-full mx-7">
                    <h2 className="text-2xl font-bold text-white mb-4">Onboarding Steps</h2>
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-gray-400 mb-4">Step 1: Sign Up </p>
                        <MdArrowDownward className="h-8 w-8 text-blue-400 mb-4" />
                        <p className="text-blue-300 mb-4">Step 2: Enter your details </p>
                        <MdArrowDownward className="h-8 w-8 text-blue-400 mb-4" />
                        <p className="text-gray-300">Step 3: Connect Stripe for Payments</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <h1 className="text-3xl font-bold">Welcome to Jazaa</h1>
                    <p className="text-gray-500">Enter your details to continue!</p>
                    <div className="w-[350px]">
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
							<div>
                                <label htmlFor="businessName" className="block mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white">User name</label>
                                <input type="text" name="businessName" id="businessName" value={userName} onChange={handleUserNameChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your business name" required />
                            </div>
                            <div>
                                <label htmlFor="businessName" className="block mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white">Business Name</label>
                                <input type="text" name="businessName" id="businessName" value={businessName} onChange={handleBusinessNameChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your business name" required />
                            </div>
                            <div>
                                <label htmlFor="businessType" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Business Type</label>
                                <input type="text" name="businessType" id="businessType" value={businessType} onChange={handleBusinessTypeChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your business type" required />
                            </div>
                            <div>
                                <label htmlFor="reasonForRegistering" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Reason for Registering</label>
                                <input type="text" name="reasonForRegistering" id="reasonForRegistering" value={reasonForRegistering} onChange={handleReasonForRegisteringChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your reason for registering" required />
                            </div>
                            <div>
                                <label htmlFor="rewardFrequency" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Reward Frequency</label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="number"
                                        id="rewardFrequency"
                                        value={frequency}
                                        onChange={handleRewardFrequencyChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Frequency"
                                    />
                                    <select
                                        id="rewardFrequencyUnit"
                                        value={frequency_unit}
                                        onChange={handleRewardFrequencyUnitChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    >
                                        <option value="days">Days</option>
                                        <option value="weeks">Weeks</option>
                                        <option value="months">Months</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input id="terms" aria-describedby="terms" type="checkbox" checked={terms} onChange={handleTermsChange} className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
                                </div>
                            </div>
                            <button type="submit" className="w-full text-white bg-[#0D121F] hover:bg-8057f0 focus:ring-4 focus:outline-none focus:ring-8057f0 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-0D121F dark:hover:bg-8057f0 dark:focus:ring-8057f0">Create an account</button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Already have an account? <a href="/sign-in" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
