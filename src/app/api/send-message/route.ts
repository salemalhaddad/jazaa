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
                const lastVisitDate = new Date(row.last_visit_date); // Use the actual date from the database
                const currentDate = new Date();
                const differenceInDays = Math.round(((currentDate.getTime() - lastVisitDate.getTime()) / (1000 * 3600 * 24)) * 100) / 100;

                console.log(`Current customer: ${current_customer}, Last visit date: ${lastVisitDate.toISOString()}, Difference in days: ${differenceInDays}`);

              if (row.message_sent === false && differenceInDays >= 30) {
                      // Perform your action here
                      const sendMessage = async () => {

                        // Create a new product
                        const product = await stripe.products.create({
                            name: row.offering_name,
                            description: `You have been awarded a ${row.discount} discount from ${row.business}`
                        });

                        const { data, error: updateError } = await supabase
                        .rpc('decrypt_price', { last_date: row.last_visit_date })

                        // Create a price for the product
                        const price = await stripe.prices.create({
                            unit_amount:  data[0]?.decrypted_offering_price*100*(1 - (data[0]?.decrypted_offering_price*row.discount)),
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

                        const response = await axios.post('https://graph.facebook.com/v19.0/324321154106179/messages', {
                            messaging_product: "whatsapp",
                            to: row.whatsapp_no, // This should be dynamically set based on your requirements
                            type: "template",
                            template: {
                                name: "business_reminder", // Adjust template name as needed
                                language: {
                                    code: "en"
                                },
                                components: [
                                  {
                                    type: "body",
                                    parameters: [{
                                      type: "text",
                                      text: row.business
                                    },
                                    {
                                      type: "text",
                                      text: row.customer_name
                                    },
                                    {
                                      type: "text",
                                      text: "1 month"
                                    },
                                    {
                                      type: "text",
                                      text: row.offering_name
                                    },
                                    {
                                      type: "text",
                                      text: row.discount
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
                                'Authorization': `Bearer EAANZC1exRZBM8BO1kdNspMWZBGZBBBDacl1fhbwKD3WGn4BQvDBkfq6z5K0VZBYF7nWmrpw5MhRkbwhaMMiupNQvKvos4RsZCCOvgU63QyyXfd1AD7K22VOI3D0NgekzGS95qRFuVV0J6ueZACkEF533KOl25GjpHolWxeNuLwmHfoPrZAdhMiCM32ZBxeTNZCRkgEhOnraM9fQDhLrUinqEQH54PgxT8h`, // Replace YOUR_ACCESS_TOKEN with your actual access token
                                'Content-Type': 'application/json'
                            }
                        });

                      console.log('Message sent successfully:', response.data);
                  };

                  try {
                    await sendMessage();
                    await supabase
                    .from('customer-visits')
                    .update({ message_sent: true })
                    .eq('customer_name', current_customer)
                    .select();
                    console.log('Message sent successfully!');
                } catch (MessageError) {
                    console.error('Error sending message:', MessageError);
                }



                }
            }
        }

        return NextResponse.json({ data: 'Success' }, { status: 200 });
    } catch (error) {
        console.log('Unexpected error:', error);
        return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
    }
}
