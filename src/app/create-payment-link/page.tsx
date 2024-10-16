"use client";
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';


const CreatePaymentLinkPage = () => {
  const [productName, setProductName] = useState('');
  const [originalAmount, setOriginalAmount] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');

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
      window.location.href = data.url;
    } else {
      console.error('NO API RESPONSE:', data.error);
    }
  };

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
    </div>
  );
};

export default CreatePaymentLinkPage;
