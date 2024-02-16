'use client'
import Image from "next/image";
// Example import statement using the alias
import Layout from '@/app/layout';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { MdKeyboardArrowDown, MdNotifications, MdChat } from 'react-icons/md'; // Added MdChat for WhatsApp icon
import { FaWhatsapp } from 'react-icons/fa'
import { MdArrowDownward } from 'react-icons/md';
import { FaCreditCard, FaMoneyCheckAlt } from 'react-icons/fa'; // Import relevant icons
import { SiVisa, SiMastercard } from 'react-icons/si'; // Icons for Visa and Mastercard
import Cal, { getCalApi } from "@calcom/embed-react";
import ReactGA from 'react-ga';
import { initGA, logPageView } from '@/app/analytics'; // Import the utility you created

export default function Home() {


	useEffect(() => {
		initGA(); // Initialize Google Analytics
		logPageView(); // Log the initial page view

		const trackButtonClick = () => {
			ReactGA.event({
			  category: 'User',
			  action: 'Clicked Contact Sales Button'
			});

			console.log('It went!')
			// Your existing onClick functionality
			window.location.href = 'https://cal.com/jazaa/30min';
		  };
		// Add additional tracking logic as needed
	  }, []);

	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [alertMessage, setAlertMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');

	const handleSubmit = (event) => {
		event.preventDefault();
		setAlertMessage('');
		setSuccessMessage('');

		if (!phone) {
		setAlertMessage('Please enter your WhatsApp number.');
		return;
		}

		if(phone){
			setSuccessMessage('Your phone number is receieved. We will get back to you within 48 hours.');
		}

		// Handle the form submission here, such as sending data to your server
		console.log('Email:', email, 'Phone:', phone);
		// Redirect or show success message
	};



	interface NotificationMap {
		[key: string]: JSX.Element | string;
	}

	const notifications = [
		{ message: "Sarah groomed their pet last month. Their pet needs a new session. Would you like to offer a 10% discount for their next session?" },
		{ message: "Mohamed is a member for 6 months, would you like to reward him with a free month?" }
	  ];

	  const [currentNotification, setCurrentNotification] = useState(notifications[0].message);
	  const [notificationIndex, setNotificationIndex] = useState(0);

	  useEffect(() => {
		// Cycle through notifications every 4 seconds
		const intervalId = setInterval(() => {
		  setNotificationIndex((i) => {
			const nextIndex = (i + 1) % notifications.length;
			setCurrentNotification(notifications[nextIndex].message);
			return nextIndex;
		  });
		}, 4000);

		return () => clearInterval(intervalId);
	  }, []);

	  // Function to generate the WhatsApp message based on the notification
	  const notificationToWhatsAppMap: NotificationMap = {
			"Sarah groomed their pet last month. Their pet needs a new session. Would you like to offer a 10% discount for their next session?": (
			  <>Hi Sarah 👋, we missed you! Come back for a grooming session and get a 15% discount on your next visit. You can pay here: <a href="https://jazaa.co/pay/?id=719" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">https://jazaa.co/pay/?id=719</a>.</>
			),
			"Mohamed is a member for 6 months, would you like to reward him with a free month?": (
			  <>Congratulations Mohamed 🥳 on reaching the 6-month mark with us! Enjoy a free 1-month membership as a token of our appreciation. Offer is valid for 48 hours! You can pay here: <a href="https://jazaa.co/pay/?id=234" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">https://jazaa.co/pay/?id=234</a>.</>
			)
		  }


		const generateWhatsAppMessage = (notification: string) => {
			return notificationToWhatsAppMap[notification] || "Check out our latest offers and services!";
		};

	  // State for the WhatsApp message
	  const [whatsAppMessage, setWhatsAppMessage] = useState(generateWhatsAppMessage(currentNotification));

	  // Update the WhatsApp message whenever the notification changes
	  useEffect(() => {
		setWhatsAppMessage(generateWhatsAppMessage(currentNotification));
	  }, [currentNotification]);

  return (
    <div>
      <Head>
        <title>Jazaa - Double Your Repeat Business</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
	  {/* Navigation Bar*/}
	  <nav className="bg-white shadow-lg">
	  <div className="max-w-6xl mx-auto px-4">
    	<div className="flex justify-between items-center">
			{/* Website Logo */}
			<a href="#" className="flex items-center py-4">
				<Image src="/logo.png" alt="Jazaa Logo" width={150} height={150}  />
			</a>

			{/* Primary Navbar items */}
			<div className=" flex ">
				<a href="#features" className="py-4 px-4 text-blue-700 font-semibold hover:text-blue-500 transition duration-300">Features</a>
				<a href="#faq" className="py-4 px-2 mr-4 text-blue-700 font-semibold hover:text-blue-500 transition duration-300">FAQ</a>
				<a href="mailto:hello@jazaa.co" className="py-4 px-3 bg-blue-600 rounded font-semibold hover:text-blue-500 transition duration-300">Contact Sales</a>
			</div>
            {/* Secondary Navbar items */}
            {/* <div className="hidden md:flex items-center space-x-3">
              <a href="#contact" className="py-2 px-2 font-medium text-white bg-blue-600 rounded hover:bg-blue-500 transition duration-300">Get Started</a>
            </div> */}
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center px-6 md:px-12 py-20 md:py-32">
          <div className="md:w-1/2 space-y-6 md:space-y-8">
            <h1 className="text-5xl font-bold leading-tight md:text-6xl md:leading-snug">Jazaa: Turn your one-time visitors into recurring customers using AI</h1>
            <p className="text-xl font-light leading-relaxed md:text-2xl md:leading-relaxed">
              Jazaa helps service businesses, like gyms and spas, increase their repeat customers through powerful automation.
            </p>
            {/* <a href="mailto:hello@jazaa.com" className="inline-block bg-white text-blue-600 py-3 px-6 rounded-full text-lg font-medium transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg">
              Contact Sales
            </a> */}
			{/* <form onSubmit={handleSubmit} className="space-y-4 w-full">
				<input
					type="tel"
					value={phone}
					onChange={(e) => setPhone(e.target.value)}
					placeholder="Enter your WhatsApp number"
					className="rounded py-2 px-4 w-full text-gray-800 md:w-3/4"
				/>
				{alertMessage && (
					<p className="text-red-500">{alertMessage}</p>
				)}
				{successMessage && (
					<p className="text-green-500">{successMessage}</p>
				)}
				<button
					type="submit"
					className="bg-white text-blue-600 py-3 px-6 rounded-full text-lg font-medium transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg"
				>
					Get Early Access
				</button>
       		</form> */}
			   <button
					onClick={trackButtonClick} className="bg-white text-blue-600 py-3 px-6 rounded-full text-lg font-medium transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg"
				>
					Contact Sales
				</button>
          </div>
		  <div className="md:w-1/2 md:ml-10 mt-10 md:mt-0 flex flex-col items-center">
			{/* Notification box */}
			<div className="flex flex-col bg-blue-100 rounded-xl shadow-lg p-4 text-gray-800 w-full max-w-md">
				<div className="flex items-center mb-2">
					<MdNotifications className="text-4xl text-blue-500 flex-shrink-0" />
					<h3 className="text-lg font-semibold mb-2 ml-4">A suggested offer reaches you</h3>
				</div>
				<p className="flex-grow">{currentNotification}</p>
				{/* Buttons */}
				<div className="flex justify-center space-x-4 mt-5">
					<button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300">
					Confirm
					</button>
					<button className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-red-600 transition duration-300">
					Change Offer
					</button>
				</div>
			</div>
			{/* Arrow icon */}
			<MdArrowDownward className="text-4xl text-blue-500 my-4" />
			{/* WhatsApp message */}
			<div className="flex flex-col bg-green-100 rounded-xl shadow-lg p-4 text-gray-800 w-full max-w-md">
				<div className="flex items-center">
					<FaWhatsapp className="text-4xl text-green-500 flex-shrink-0" />
					<h3 className="text-lg font-semibold mb-2 ml-4">Automated WhatsApp message to customer</h3>
				</div>
				<p className="flex-grow">{whatsAppMessage}</p>
			</div>
		  </div>
		</div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-9">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center">
			<Image src="/whatsapp-icon.png" alt="wa" width={100} height={100}/>
              <h3 className="mt-6 text-2xl font-bold">Automated WhatsApp Messaging</h3>
              <p className="mt-2 text-lg">
                Let Jazaa take care of notifying customers with monthly and/or weekly personalized discounts and offers you agree on.
              </p>
            </div>
			<div className="flex flex-col items-center text-center">
			<div className="flex justify-center items-center space-x-2 bg-white p-4 rounded-full">
				{/* Replace these with actual image components */}
				<Image src="/visa.png" alt="Visa" width={50} height={50} />
				<Image src="/mastercard.png" alt="Mastercard" width={50} height={50} />
				<Image src="/tabby.png" alt="Tabby" width={50} height={50} />
				<Image src="/tamara.png" alt="Tamara" width={50} height={50} />
				{/* Add more images for other payment methods */}
			</div>
			<h3 className="mt-6 text-2xl font-bold">Seamless & Flexible Payments</h3>
			<p className="mt-2 text-lg">
				Make it easier for your customers to pay online using credit/debit cards or buy now pay later options.
			</p>
			</div>
			<div className="flex flex-col items-center text-center w-full max-w-xs mx-auto"> {/* Centering the 3rd feature */}
				<div className="bg-white shadow-md rounded-lg p-4 w-full">
					<h3 className="text-lg font-semibold mb-2 text-black">{"Today's Overview"}</h3>
					<div className="flex justify-between text-sm mb-4 ml-10 mr-10 mt-5">
						<div>
							<p className="font-medium text-blue-600">Offers</p>
							<p className="text-blue-600">14</p>
						</div>
						<div>
							<p className="font-medium text-black">Confirmed</p>
							<p className="text-black">8</p>
						</div>
						{/* <div>
							<p className="font-medium text-black">Waiting</p>
							<p className="text-red-600">3</p>
						</div> */}
					</div>
					{/* Placeholder for a chart */}

					<div className="flex justify-center items-center mb-4">
						<Image src="/graph.png" alt="wa" width={175} height={100}/>
					</div>
					{/* Quick stats */}
					<div className="text-sm">
						<p className="font-bold mb-1 text-black mb-4">Customer Insights</p>
						<div className="flex justify-between mb-2">
							<span className="text-black">Repeat Visits</span>
							<span className="font-medium text-black ">61%</span>
						</div>
						<div className="flex justify-between mb-2">
							<span className="text-black">Total payments</span>
							<span className="font-medium text-black ">101.4K AED</span>
						</div>
					</div>
 				</div>
			<h3 className="mt-6 text-2xl font-bold">Insights Dashboard</h3>
			<p className="mt-2 text-lg">
				Track and monitor customer profiles, accepted/rejected offers, and other insights on customer loyalty.
			</p>
			</div>

            {/* Feature 2 */}
            {/* ... other features */}
          </div>
        </div>
      </section>



	  {/* FAQ Section */}
      <section id="faq" className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <h2 className="text-3xl text-blue-600 font-bold text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* FAQ Item */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <details>
                <summary className="text-xl font-semibold text-gray-800">What is Jazaa?</summary>
                <p className="mt-2 text-gray-700">
                  Jazaa is a software-as-a-service that helps you turn inital customers into repeat customers. By aggregating your payment data, it helps you track customer profiles, ultimately offering them personalized discounts and offers.
                </p>
              </details>
            </div>
			<div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <details>
                <summary className="text-xl font-semibold text-gray-800">What features does Jazaa offer?</summary>
                <p className="mt-2 text-gray-700">
                  Jazaa mainly helps you with automating personalized WhatsApp weekly and/or monthly offers and tracking customer data in a insightful dashboard.
                </p>
              </details>
            </div>
			<div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <details>
                <summary className="text-xl font-semibold text-gray-800">What services does Jazaa offer?</summary>
                <p className="mt-2 text-gray-700">
                  Jazaa offers a comprehensive suite of tools designed to help service businesses maximize their repeat business.
                </p>
              </details>
            </div>
            {/* Repeat for other FAQ items */}
			<div className="bg-gray-100 p-6 rounded-lg shadow-md">
				<details>
				<summary className="text-xl font-semibold text-gray-800">How quickly can Jazaa be implemented?</summary>
				<p className="mt-2 text-gray-700">
					Jazaa is designed for rapid deployment. With our easy setup process, you can start seeing the benefits of Jazaa within a week. Our team is available to assist with onboarding to ensure a smooth transition.
				</p>
				</details>
			</div>
			{/* FAQ Item */}
			<div className="bg-gray-100 p-6 rounded-lg shadow-md">
				<details>
				<summary className="text-xl font-semibold text-gray-800">Is there a demo available for Jazaa?</summary>
				<p className="mt-2 text-gray-700">
					Yes, we offer a live demo that showcases the full capabilities of Jazaa. You can schedule a personalized walkthrough with one of our product experts to see how Jazaa can meet your specific needs.
				</p>
				</details>
			</div>
			{/* FAQ Item */}
			<div className="bg-gray-100 p-6 rounded-lg shadow-md">
				<details>
				<summary className="text-xl font-semibold text-gray-800">Do I need to have technical skills to use Jazaa?</summary>
				<p className="mt-2 text-gray-700">
					Not at all. Jazaa is built with a user-friendly interface that is easy to navigate, even for those without technical expertise. Plus, our support team is always ready to help should you have any questions.
				</p>
				</details>
			</div>
			{/* Additional FAQ items can be added here */}
          </div>
        </div>
      </section>


      {/* Call to Action Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl font-bold">Ready to grow your business?</h2>
          <p className="mt-4 text-lg">
            Get in touch with us to see how Jazaa can help you.
          </p>
          <div className="mt-8">
            <a href="mailto:hello@jazaa.co" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-full text-lg font-medium transition duration-300 ease-in-out transform hover:-translate-y-1">
              Contact Us
            </a>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-6 md:px-12 text-center">
		© Jazaa Technologies. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
