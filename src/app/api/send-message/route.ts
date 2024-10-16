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

                        const chat_response = await fetch("https://api.openai.com/v1/chat/completions", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${process.env.YOUR_OPENAI_API_KEY}`,
                            },
                            body: JSON.stringify({
                                model: "gpt-3.5-turbo",
                                messages: [
                                    {role: "system", content: "You are a helpful assistant."},
                                    {role: "user", content: `Is this Arabic name a male or female name? ${row.customer_name}. Reply only with 'male' or 'female'.`},
                                ],
                                max_tokens: 10,
                                stop: ["\n"],
                                temperature: 0,
                            }),
                        });

                        const data = await chat_response.json();
						let isMale = false;
						if (data.choices[0].message.content) {
							isMale = data.choices[0].message.content === 'male';
							console.log(data.choices[0].message.content);
						} else {
							console.error('No choices found in the response. CANNOT continue. Check code.');
						}

                        const wa_message_en = `Hi ${row.customer_name}! 🎉 We're excited to offer you an exclusive ${row.discount} discount on ${row.offering_name}. This special offer is only valid for the next 24 hours, so don't miss out! Click here to pay: ${paymentLink.url} and enjoy your discount today!`;

						const wa_message_ar = `أهلا ${row.customer_name} 👋! مضى شهر على شراءك لمنتجنا (${row.offering_name}). ولأنني أقدر اختيارك لمنتجاتنا 🤝، أقدم لك خصم ${row.discount} على طلبك السابق. إذا كنت مهتماً في العرض، فهو متاح لمدة 24 ساعة ⏰ .`;

						const wa_message_sh_male = `السلام عليكم اخ ${row.customer_name}، كيف حالك، قلت بتطمن عليك كيف معاك ${row.offering_name}، عاجبك؟ ان شاء الله كان عند حسن ظنك. اذا عاجبك و بدك تاخذ حبة جديدة، بقدم لك خصم ${row.discount} مخصوص الك`;

						const wa_message_sh_female = `السلام عليكم اختي ${row.customer_name}، كيف حالِك، قلت بتطمن عليك كيف معاك ${row.offering_name}، عاجبك؟ ان شاء الله كان عند حسن ظنكم. اذا عاجبك و بَدك تاخذي حبة جديدة، بقدم لِك خصم ${row.discount} مخصوص الك`;

						const wa_message_ar_2 = `أهلاً ${row.customer_name} 👋! مضى شهر على اختيارك لمنتجنا (${row.offering_name}). واحتفاءً بثقتك، يسرني أن أقدم لك خصم ${row.discount} على طلبك. العرض ساري لمدة 24 ساعة ⏰.`;

						const wa_message_ar_3 = `مرحباً ${row.customer_name} 👋! شرفتنا باختيارك لمنتجنا (${row.offering_name}) منذ شهر. لنشكرك، نقدم لك خصم ${row.discount}. العرض ساري لمدة 24 ساعة فقط ⏰.`;

						const wa_message_ar_4 = `أهلاً ${row.customer_name} 👋! مضى شهر على شرائك لمنتجنا (${row.offering_name}). شكراً لك على اختيارك لنا 🤝، استمتع بخصم ${row.discount} على طلبك الأخير. العرض صالح لـ 24 ساعة فقط ⏰.`;

						const wa_message_ar_5 = `مرحباً ${row.customer_name} 👋! شكرًا لاختيارك لمنتجنا (${row.offering_name}) قبل شهر. نقدر ولاءك ونقدم لك خصم ${row.discount} على طلبك السابق. العرض متاح لمدة 24 ساعة ⏰.`;

						const wa_message_ar_6 = `أهلاً وسهلاً ${row.customer_name} 👋! مرت 30 يوماً على شرائك لمنتجنا (${row.offering_name}). تقديراً لك، نقدم لك خصم ${row.discount} على طلبك. يسري العرض لمدة 24 ساعة فقط ⏰.`;

						const wa_message_ar_7 = `مرحباً ${row.customer_name} 👋! شكرًا لثقتك في منتجنا (${row.offering_name}). لنحتفل بمرور شهر على شرائك، نقدم لك خصم خاص بقيمة ${row.discount}. العرض متاح لـ 24 ساعة ⏰.`;

						const wa_message_ar_8 = `أهلاً ${row.customer_name} 👋! مضى شهر على اختيارك لمنتجنا (${row.offering_name}). كعربون شكر، نمنحك خصم ${row.discount} على طلبك السابق. العرض ساري لمدة 24 ساعة فقط ⏰.`;

						const wa_message_ar_9 = `مرحباً ${row.customer_name} 👋! لقد مضى شهر منذ شرائك (${row.offering_name}). نشكرك على ولائك ونقدم لك خصم ${row.discount} على طلبك السابق. العرض متاح لـ 24 ساعة ⏰.`;

						const wa_message_ar_10 = `أهلاً ${row.customer_name} 👋! مضى شهر منذ اختيارك لمنتجنا (${row.offering_name}). احتفاءً بثقتك بنا، نقدم لك خصم ${row.discount}. العرض ساري لمدة 24 ساعة ⏰.`;

                        const arabicMessages = [
                            wa_message_ar,
                            wa_message_ar_2,
                            wa_message_ar_3,
                            wa_message_ar_4,
                            wa_message_ar_5,
                            wa_message_ar_6,
                            wa_message_ar_7,
                            wa_message_ar_8,
                            wa_message_ar_9,
                            wa_message_ar_10
                        ];
                        const randomIndex = Math.floor(Math.random() * arabicMessages.length);

                        let encodedMessage = row.Arabic ? (isMale ? encodeURIComponent(wa_message_sh_male) : encodeURIComponent(wa_message_sh_female)) : encodeURIComponent(wa_message_en);

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
							const bitlyResponse = await fetch('https://api-ssl.bitly.com/v4/shorten', {
								method: 'POST',
								headers: {
									'Authorization': `Bearer ${bitlyToken}`,
									'Content-Type': 'application/json'
								},
								body: JSON.stringify({ "long_url": waMessageURL, "domain": "bit.ly" })
							});
							const data = await bitlyResponse.json();
							shortenedUrl = data.link;
							console.log(`Shortened URL: ${shortenedUrl}`);
						} catch (error) {
							console.error('Error shortening URL:', error);
						}

						const dis = row.discount + '%'

                        const FB_response = await axios.post(`https://graph.facebook.com/v19.0/${process.env.PHONE_ID}/messages`, {
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

						if (!row.business_no || !row.business || !row.customer_name || !row.frequency || !row.frequency_unit || !row.offering_name || !discount || !shortenedUrl) {
                          console.error('Missing required row values');
                        }

                      console.log('Message sent successfully:', FB_response.data);
                      if(FB_response.data.messages[0].message_status == 'accepted') {
                        messageSent = true
                      }
                  };

                  try {
                    await sendMessage();
                    if(messageSent = true) {
                      await supabase
                      .from('customer-visits')
                      .update({ message_sent: true, message_sent_date: new Date(), sent_time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) })
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
