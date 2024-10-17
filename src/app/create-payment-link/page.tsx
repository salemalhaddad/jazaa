"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
	useSessionContext,
	useSupabaseClient,
} from "@supabase/auth-helpers-react";

const CreatePaymentLinkPage = () => {
  const [productName, setProductName] = useState('');
  const [originalAmount, setOriginalAmount] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [paymentLinkUrl, setPaymentLinkUrl] = useState('');
  const [user, setUser] = useState(null);
//   const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabaseClient = useSupabaseClient();
  const { session } = useSessionContext();
  const router = useRouter();




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

  return (
    <div className="max-w-md mx-auto my-10 bg-white p-8 border border-gray-200 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create Stripe Payment Link</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        createPaymentLink();
      }}>
        <div className="mb-4">
          <input
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <input
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="number"
            placeholder="Product's Original Price"
            value={originalAmount}
            onChange={(e) => setOriginalAmount(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <input
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="number"
            placeholder="Discount Amount"
            value={discountAmount}
            onChange={(e) => setDiscountAmount(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Create Payment Link
        </button>
      </form>
      {paymentLinkUrl && (
        <div className="mt-4 text-center">
          <p className="text-blue-500 hover:text-green-700">Your payment link is ready!</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href={paymentLinkUrl} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-700">Click here to view</a>
            <button onClick={() => {
              navigator.clipboard.writeText(paymentLinkUrl);
              // Removed alert and added inline text display for copied link confirmation
			  if (paymentLinkUrl) {
				const linkCopiedConfirmation = document.getElementById("linkCopiedConfirmation");
				if (linkCopiedConfirmation) {
					linkCopiedConfirmation.style.display = "block";
				}
			} }} className="text-green-500 hover:text-green-700">Copy Link</button>
            <button onClick={() => {
              const shareData = {
                title: 'Payment Link',
                text: 'Here is the payment link:',
                url: paymentLinkUrl,
              };
              if (navigator.share) {
                navigator.share(shareData)
                  .then(() => console.log('Link shared successfully'))
                  .catch((error) => console.log('Error sharing', error));
              }
            }} className="text-green-500 hover:text-green-700">Share Link</button>
          </div>
          <p id="linkCopiedConfirmation" style={{display: 'none', color: 'green'}}>Link copied ✅</p>
        </div>
      )}
	</div>
  );
};

export default CreatePaymentLinkPage;
