import Stripe from 'stripe';

const stripeAuth = `Bearer ${process.env.STRIPE_SECRET_KEY}`;

export const stripe = new Stripe(stripeAuth, {
    apiVersion: "2023-08-16",
    appInfo: {
        name: 'jazaa',
        version: '0.1.0'
    }
});
