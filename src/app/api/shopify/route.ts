// import { NextResponse } from 'next/server';
// import Shopify from '@shopify/shopify-api';

// export async function POST(req: Request) {
//   const { shop, accessToken } = await req.json();

//   const client = new Shopify.Clients.Rest(shop, accessToken);

//   try {
//     const response = await client.get({
//       path: 'orders',
//       query: { status: 'any', limit: 250 },
//     });

// 	console.log(response.body)

//     return NextResponse.json(response.body);
//   } catch (error) {
//     console.error('Error fetching Shopify orders:', error);
//     return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
//   }
// }
