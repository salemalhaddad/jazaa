// import { NextResponse } from 'next/server';
// import { getAccessToken } from '@shopify/shopify-api';
// import { useSupabaseClient } from '@supabase/auth-helpers-react'

// export async function GET(req: Request) {
// 	const supabaseClient = useSupabaseClient();
//   const { searchParams } = new URL(req.url);
//   const shop = searchParams.get('shop');
//   const code = searchParams.get('code');
//   const hmac = searchParams.get('hmac');

//   // Verify the request (optional but recommended)
//   // You can verify the HMAC here to ensure the request is from Shopify
//   const shopifySecret = process.env.SHOPIFY_API_SECRET;
//   const providedHmac = hmac;
//   const generatedHmac = require('crypto').createHmac('sha256', shopifySecret)
//     .update(new URLSearchParams(searchParams).toString())
//     .digest('hex');

//   if (generatedHmac !== providedHmac) {
//     console.error('HMAC validation failed');
//     return NextResponse.redirect('/error'); // Redirect to an error page if HMAC validation fails
//   }

//   try {
//     // Exchange the code for an access token
//     const accessToken = await getAccessToken(shop, code); // Updated this line

//     // Store the access token securely in Supabase's session
//     const { data, error } = await supabase.auth.api.setAuthCookie(req, accessToken);
//     if (error) throw error;

//     // Redirect to a specific URL after successful authentication
//     return NextResponse.redirect('/success-onboarding'); // Change this to your desired URL
//   } catch (error) {
//     console.error('Error during Shopify OAuth callback:', error);
//     return NextResponse.redirect('/error'); // Redirect to an error page if needed
//   }
// }
