import { NextResponse } from 'next/server';
import axios from 'axios';
import OpenAI from "openai";
import axiosInstance from '@/lib/axiosInstance';

const VERIFY_TOKEN = '123456';

const openai = new OpenAI();

export async function GET(request: Request) {
    const url = new URL(request.url);
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('Webhook verified');
            return new Response(challenge, { status: 200 });
        } else {
            return new Response('Forbidden', { status: 403 });
        }
    }

    return new Response('GET request received', { status: 200 });
}

async function createStripePaymentLink(productName: string, originalPrice: number, discount: number) {
    try {
        const response = await axiosInstance.post('/api/create-stripe-link', {
            productName,
            amount: originalPrice,
            discount,
        });

        return response.data.url;
    } catch (error) {
        if (error.code === 'ECONNRESET') {
            console.error('Connection reset by peer. Please check your network connection.');
        } else {
            console.error('Error creating Stripe payment link:', error);
        }
        throw new Error('Failed to create Stripe payment link');
    }
}

async function analyzeCsvData(csvFile: any) {
    return "CSV analysis results: [example insights]";
}

const tools = [
    {
        type: "function",
        function: {
            name: "createStripePaymentLink",
            description: "Create a payment link based on original price, discount, and product name",
            parameters: {
                type: "object",
                properties: {
                    productName: { type: 'string', description: 'Name of the product' },
                    originalPrice: { type: 'number', description: 'Original price of the product' },
                    discount: { type: 'number', description: 'Discount in percentage' },
                },
                required: ['productName', 'originalPrice', 'discount'],
                additionalProperties: false
            }
        }
    },
    {
        type: "function",
        function: {
            name: "analyzeCsvData",
            description: "Analyze a CSV file and return insights",
            parameters: {
                type: "object",
                properties: {
                    csvFile: { type: 'string', description: 'CSV file to analyze (base64 encoded or URL)' },
                },
                required: ['csvFile'],
                additionalProperties: false
            }
        }
    }
];

export async function POST(request: Request) {
    const body = await request.json();
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];
    const waId = message?.from;

    const gptResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant called Jazaa that helps small businesses create payment links.',
            },
            {
                role: 'user',
                content: "Hi, can you create a payment link with a discount?",
            },

        ],
        tools: tools,
        tool_choice: 'auto',
    });

    const functionCall = gptResponse.choices[0].message.tool_calls?.[0].function;

    try {

        if (functionCall) {

            const { name, arguments: functionArgs } = functionCall;
			console.log("that is a function call, ", functionCall)

            if (name === 'createStripePaymentLink') {
                const { originalPrice, discount, productName } = JSON.parse(functionArgs);
				console.log("originalPrice, discount, productName: ", originalPrice, discount, productName)
                const paymentLink = await createStripePaymentLink(productName, originalPrice, discount);
                await sendWhatsAppMessage(waId, `Here is your payment link: ${paymentLink}`);
            } else if (name === 'analyzeCsvData') {
                const { csvFile } = JSON.parse(functionArgs);
                const analysisResult = await analyzeCsvData(csvFile);
                await sendWhatsAppMessage(waId, `Here are your CSV analysis results: ${analysisResult}`);
            }
        }
    } catch (error) {
        console.error('Error processing function call:', error);
        await sendWhatsAppMessage(waId, 'Sorry, there was an error processing your request.');
    }

    return NextResponse.json({ status: 'message received' });
}

const API_URL = `https://graph.facebook.com/v19.0/${process.env.PHONE_ID}/messages`;

async function sendWhatsAppMessage(waId: string, message: string) {
    try {
        const response = await axios.post(
            API_URL,
            {
                messaging_product: "whatsapp",
                to: waId,
                type: "text",
                text: {
                    body: message
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('Message sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending message:', error.response?.data || error.message);
    }
}
