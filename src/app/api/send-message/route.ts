import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import axios from 'axios';
var cron = require('node-cron');
import { cookies } from 'next/headers'

export async function POST() {
    const cookieStore = cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value
            },
            set(name: string, value: string, options: CookieOptions) {
              cookieStore.set({ name, value, ...options })
            },
            remove(name: string, options: CookieOptions) {
              cookieStore.set({ name, value: '', ...options })
            },
          },
        }
      )

    try {
        const { data, error } = await supabase
        .from('customer-visits')
        .select()

        console.log(error)
        if (data) {
        for (const row of data) {
            const current_customer = row.customer_name;
            const lastVisitDate = new Date('2024-04-25'); // or row.last_visit
            const currentDate = new Date();
            const differenceInDays = Math.round(((currentDate.getTime() - lastVisitDate.getTime()) / (1000 * 3600 * 24)) * 100) / 100;
            console.log(`Current customer: ${current_customer}, Last visit date: ${lastVisitDate.toISOString()}, Difference in days: ${differenceInDays}`);

            if (row.message_sent == false && differenceInDays >= 30) {
                // Perform your action here
                const sendMessage = async () => {
                    const response = await axios.post('https://graph.facebook.com/v19.0/303726219482280/messages', {
                        messaging_product: "whatsapp",
                        to: '971563811553', // This should be dynamically set based on your requirements
                        type: "template",
                        template: {
                            name: "hello_world", // Adjust template name as needed
                            language: {
                                code: "en_US"
                            }
                        }
                    }, {
                        headers: {
                            'Authorization': `Bearer EAANZC1exRZBM8BOylZA1H1ODosU1sNOLOHFmLy6mG4kwwoQs0KZA8OccleKGgLjR1OVKpqZCcXVQAbCBUWWrV2AdfNhurlovZCUdjvZBiHoP150RJWHp8PsHWJgOIhH9trUuaucvcltNsBP4adNj7we4TyMERIFS8DJt0xZBoFHAXFsYWAYv7imru1dJJzY1TfMZBTEOZAxw04whKz3pn5dDdBU1jKUNAZD`, // Replace YOUR_ACCESS_TOKEN with your actual access token
                            'Content-Type': 'application/json'
                        }
                    });

                    console.log('Message sent successfully:', response.data);
                };

                sendMessage().catch(console.error);
                const { data, error } = await supabase
                .from('customer-visits')
                .update({ message_sent: true })
                .eq('customer_name', current_customer)
                .select()

                console.log('and the result is...', data, ' where the error is ', error)
            }
        }
      }


        return NextResponse.json({ data: 'Success', status: 200 });

    } catch (error) {
        console.log('Its an error broo')
        return NextResponse.json({ error: error }, { status: 500 })
    }
}
