import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import axios from 'axios';
import { cookies } from 'next/headers';
import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16', // Use the latest Stripe API version
});

export async function POST() {
    const cookieStore = cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    cookieStore.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    cookieStore.set({ name, value: '', ...options });
                },
            },
        }
    );

    try {
        const { data, error } = await supabase
            .from('customer-visits')
            .select();

        if (error) {
            console.log('Error fetching data:', error);
            return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
        }

        if (data) {
            for (const row of data) {
                const current_customer = row.customer_name;
                const lastVisitDate = new Date('04-20-2024'); // Use the actual date from the database
                const currentDate = new Date();
                const differenceInDays = Math.round(((currentDate.getTime() - lastVisitDate.getTime()) / (1000 * 3600 * 24)) * 100) / 100;

                console.log(`Current customer: ${current_customer}, Last visit date: ${lastVisitDate.toISOString()}, Difference in days: ${differenceInDays}`);

              if (row.message_sent === false && differenceInDays >= 30) {
                      // Perform your action here
                      const sendMessage = async () => {
                        
                        // Create a new product
                        const product = await stripe.products.create({
                            name: row.offering,
                            description: 'You have been awarded a 10% discount'
                        });

                        // Create a price for the product
                        const price = await stripe.prices.create({
                            unit_amount: 3500,
                            currency: 'aed', // or any other currency you use
                            product: product.id,
                        });

                        const paymentLink = await stripe.paymentLinks.create({
                          line_items: [
                            {
                              price: price.id,
                              quantity: 1,
                            },
                          ],
                        });

                        const response = await axios.post('https://graph.facebook.com/v19.0/303726219482280/messages', {
                            messaging_product: "whatsapp",
                            to: "971506918436", // This should be dynamically set based on your requirements
                            type: "template",
                            template: {
                                name: "renewal_reminder", // Adjust template name as needed
                                language: {
                                    code: "en"
                                },
                                components: [
                                  {
                                    type: "body",
                                    parameters: [{
                                      type: "text",
                                      text: `${current_customer}`
                                    },
                                    {
                                      type: "text",
                                      text: "1 month"
                                    },
                                    {
                                      type: "text",
                                      text: "10%"
                                    },
                                    {
                                      type: "text",
                                      text: paymentLink.url
                                    }
                                  ]
                                  }

                                ]
                            }
                        }, {
                            headers: {
                                'Authorization': `Bearer EAANZC1exRZBM8BOZCND38In0n6lU5j0FqeC5dzfjkIZA0mdD9ZCZBwoR2I0XePTS830XJS7A0oZB8JoNY6a8aJxbP35nCvAlXrrHV7YI94OaPslxEDxx4Sj4aLWOsWWp3u21HYI58Wn8hbZBVgzh1T65V4aJ50SetkVgjrurqZAyIttTkATJvLM7IGTj5L1uMGBMWviie3ZAvkoyoCmFEy9jeCxu2ZAYfoZD`, // Replace YOUR_ACCESS_TOKEN with your actual access token
                                'Content-Type': 'application/json'
                            }
                        });
                      
                      console.log('Message sent successfully:', response.data);
                  };

                  await sendMessage().catch(MessageError => console.error('Error sending message:', MessageError));
                  
                  await supabase
                  .from('customer-visits')
                  .update({ message_sent: true })
                  .eq('customer_name', current_customer)
                  .select();

                }
            }
        }

        return NextResponse.json({ data: 'Success' }, { status: 200 });
    } catch (error) {
        console.log('Unexpected error:', error);
        return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
    }
}
