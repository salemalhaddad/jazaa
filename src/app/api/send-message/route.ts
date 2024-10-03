import { MdDiscount } from 'react-icons/md';
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
                let messageSent = false;

              if (row.message_sent === false && differenceInDays >= 30) {
                      // Perform your action here
                      const sendMessage = async () => {

                        // Create a new product
                        const product = await stripe.products.create({
                            name: row.offering_name,
                            description: `You have been awarded a ${row.discount} discount on ${row.offering_name} from ${row.business}`
                        });




                        let discount = row.discount
                        let number = parseInt(discount.replace('%', ''));


                        // Create a price for the product
                        const price = await stripe.prices.create({
                            unit_amount: Math.round(row.offering_price*10*(1 - number*0.01)),
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

                        const wa_message_en = `Hi ${row.customer_name}! 🎉 We're excited to offer you an exclusive ${row.discount} discount on ${row.offering_name}. This special offer is only valid for the next 24 hours, so don't miss out! Click here to pay: ${paymentLink.url} and enjoy your discount today!`;
						const wa_message_ar = `أهلا ${row.customer_name} 👋! مضى شهر على شراءك لمنتجنا (${row.offering_name}). ولأنني أقدر اختيارك لمنتجاتنا 🤝، أقدم لك خصم ${row.discount} على طلبك السابق. إذا كنت مهتماً في العرض، فهو متاح لمدة 24 ساعة ⏰ .`;
                        const encodedMessage = row.Arabic ? encodeURIComponent(wa_message_ar) : encodeURIComponent(wa_message_en);

						const waNo = row.whatsapp_no.replace(/[\s-]/g, '');
						
						console.log(`WhatsApp number: ${waNo}`);
                        const waMessageURL = `https://wa.me/${waNo}?text=${encodedMessage}`;

						console.log(waMessageURL)

						let shortenedUrl;
						const bitlyToken = process.env.BITLY_TOKEN;
						if (!bitlyToken) {
							console.error('BITLY_TOKEN is not set');
							return;
						}
						try {
							const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
								method: 'POST',
								headers: {
									'Authorization': `Bearer ${bitlyToken}`,
									'Content-Type': 'application/json'
								},
								body: JSON.stringify({ "long_url": waMessageURL, "domain": "bit.ly" })
							});
							const data = await response.json();
							shortenedUrl = data.link;
							console.log(`Shortened URL: ${shortenedUrl}`);
						} catch (error) {
							console.error('Error shortening URL:', error);
						}

						const dis = row.discount + '%'

                        const response = await axios.post(`https://graph.facebook.com/v19.0/${process.env.PHONE_ID}/messages`, {
                            messaging_product: "whatsapp",
                            to: row.business_no, // This should be dynamically set based on your requirements
                            type: "template",
                            template: {
                                name: "business_reminder", // Adjust template name as needed
                                language: {
                                    code: "ar"
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
                                      text: `${row.frequency} ${row.frequency_unit}`
                                    },
                                    {
                                      type: "text",
                                      text: row.offering_name
                                    },
                                    {
                                      type: "text",
                                      text: discount
                                    },
                                    {
                                      type: "text",
                                      text: shortenedUrl
                                    }

                                  ]
                                  }

                                ]
                            }
                        }, {
                            headers: {
                                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`, // Replace YOUR_ACCESS_TOKEN with your actual access token
                                'Content-Type': 'application/json'
                            }
                        });

                      console.log('Message sent successfully:', response.data);
                      if(response.data.messages[0].message_status == 'accepted') {
                        messageSent = true
                      }
                  };

                  try {
                    await sendMessage();
                    if(messageSent = true) {
                      await supabase
                      .from('customer-visits')
                      .update({ message_sent: true })
                      .eq('customer_name', current_customer)
                      .select();
                      console.log('Message sent successfully!');
                    }

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
