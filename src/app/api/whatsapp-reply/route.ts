// // src/app/api/whatsapp-reply/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

const VERIFY_TOKEN = '123456';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    // Handle the verification request from Meta
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

export async function POST(request: Request) {
  const body = await request.json();

  // Extract necessary data from the incoming WhatsApp webhook
  const entry = body.entry?.[0];
  const changes = entry?.changes?.[0];
  const message = changes?.value?.messages?.[0];
  const waId = message?.from;
  const messageBody = message?.text?.body;

  // For example, if the received message is '/imagine cars racing on Mars'
  if (messageBody?.startsWith('payment')) {
    // Call WhatsApp Cloud API to send a reply message
    await sendWhatsAppMessage(waId);
  }

  return NextResponse.json({ status: 'message received' });
}

const API_URL = `https://graph.facebook.com/v19.0/${process.env.PHONE_ID}/messages`;

async function sendWhatsAppMessage(waId: string) {
  const message = 'https://jazaa.co/create-payment-link'; // Customize or use environment variables
  try {
    const response = await axios.post(
      API_URL,
      {
        messaging_product: "whatsapp",
		to: waId, // This should be dynamically set based on your requirements
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
