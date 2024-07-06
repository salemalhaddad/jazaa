'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ChooseDataOption() {
  const router = useRouter();

  const handleShopifyIntegration = () => {
    const shop = prompt('Please enter your Shopify store URL (e.g., myshop.myshopify.com):');
	const api_key = process.env.NEXT_PUBLIC_SHOPIFY_API_KEY
	const scopes = 'read_orders, read_customers'
	const redirect_uri = process.env.NEXT_PUBLIC_SHOPIFY_REDIRECT_URI

    if (shop) {
      const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${api_key}&scope=${scopes}&redirect_uri=${redirect_uri}`;
      window.location.href = installUrl;
    }
  };

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
      <h2 className="text-3xl font-bold mb-4">Choose Your Data Integration Option</h2>
      <p className="text-lg mb-8">Select how you&apos;d like to integrate your data with our system.</p>
      <div className="flex flex-col gap-4">
        <Button variant="default" onClick={handleShopifyIntegration} className="bg-blue-500 hover:bg-blue-700 text-white py-3 px-6 rounded-lg shadow-md">Shopify</Button>
        <Button variant="default" onClick={() => console.log('QuickBooks integration selected')} className="bg-blue-500 hover:bg-blue-700 text-white py-3 px-6 rounded-lg shadow-md">QuickBooks</Button>
        <Button variant="default" onClick={() => console.log('Manual integration selected')} className="bg-blue-500 hover:bg-blue-700 text-white py-3 px-6 rounded-lg shadow-md">Manual</Button>
    </div>
	</div>
  );
}
