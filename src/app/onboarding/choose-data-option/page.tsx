'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Shopify from '@shopify/shopify-api';
import { fetchShopifyOrders } from '@/utils/shopifyApi';

export default function ChooseDataOption() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);

  const handleShopifyIntegration = () => {
    const shop = prompt('Please enter your Shopify store URL (e.g., myshop.myshopify.com):');
    const apiKey = process.env.NEXT_PUBLIC_SHOPIFY_API_KEY;
    const scopes = 'read_orders, read_customers';
    const redirectUri = `${window.location.origin}/api/shopify/callback`; // Update to your callback URL

    if (shop) {
      const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&redirect_uri=${redirectUri}`;
      window.location.href = installUrl;
    }
  };

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
      <h2 className="text-3xl font-bold mb-4">Select Your Data Integration</h2>
      <p className="text-lg mb-8">Choose how you&apos;d like to integrate your data with our system.</p>
      <div className="flex flex-col gap-4">
        <Button variant="primary" onClick={handleShopifyIntegration} className="bg-blue-500 hover:bg-blue-700 text-white py-3 px-6 rounded-lg shadow-md">Shopify</Button>
        <Button variant="primary" onClick={() => console.log('QuickBooks integration selected')} className="bg-blue-500 hover:bg-blue-700 text-white py-3 px-6 rounded-lg shadow-md">QuickBooks</Button>
        <Button variant="primary" onClick={() => console.log('Manual integration selected')} className="bg-blue-500 hover:bg-blue-700 text-white py-3 px-6 rounded-lg shadow-md">Manual</Button>
      </div>
      {/* Display fetched orders */}
      {orders.length > 0 && (
        <div className="mt-4">
          <h3 className="text-2xl font-bold">Fetched Orders:</h3>
          <ul>
            {orders.map(order => (
              <li key={order.id}>{order.name}</li> // Adjust based on your order structure
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
