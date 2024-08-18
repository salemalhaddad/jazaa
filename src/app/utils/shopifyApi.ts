export async function fetchShopifyOrders(shop: string, accessToken: string) {
	const response = await fetch('/api/shopify', {
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json',
	  },
	  body: JSON.stringify({ shop, accessToken }),
	});

	if (!response.ok) {
	  throw new Error('Failed to fetch Shopify orders');
	}

	return response.json();
  }
