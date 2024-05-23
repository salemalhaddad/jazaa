import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { stripe } from '../../../lib/stripe';
import {
    upsertProductRecord,
    upsertPriceRecord,
    manageSubscriptionStatusChange
} from "../../../lib/supabaseAdmin";

const relevantEvents = new Set([
    'product.created',
    'product.updated',
    'price.created',
    'price.updated',
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted'
]);

export async function POST(
    request: Request
) {
    const body = await request.json(); // Assuming the request body will be JSON
    const recipientNumber = body.to; // Assuming 'to' contains the recipient WhatsApp number
    const messageTemplate = body.template; // Assuming 'template' contains the message template name

    const sendMessage = async () => {
        const response = await fetch('https://graph.facebook.com/v19.0/303726219482280/messages', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer EAANZC1exRZBM8BOx8wnWr6dQOFfDxL9DhuzOi2gDA5MPoAH1vZBCdPGUBB4c3TVMIkiTfMK1ZAeUtw1EtV7apZBb4A8xqmeDTlLeUUYpfTt9wwCGSLsAf8OXCSZBqQn0NUBtGGoPceayC2J5TaQV1iYGmlbNZCgMJTS5fzPYZBcTGKyPZBNAhwpNoTzyKXyX1D0EO8YSZBeuwkN6FqvZCGBLOQcQhbkHGMZD',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "messaging_product": "whatsapp",
                "to": "971563811553",
                "type": "template",
                "template": {
                    "name": "reward_reminder",
                    "language": {
                        "code": "en_US"
                    }
                }
            })
        });

        const result = await response.json();
        if (!response.ok) {
            console.log(`❌ Error sending message: ${result.error.message}`);
            return new NextResponse(`Webhook Error: ${result.error.message}`, { status: 400 });
        }

        console.log(`✅ Message sent successfully to ${recipientNumber}`);
        return NextResponse.json({ success: true, message: `Message sent successfully to ${recipientNumber}` }, { status: 200 });
    };

    await sendMessage();
};
