import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2023-08-16', // Use the latest Stripe API version
  });

export async function POST(request, res) {

  const body = await request.json();
  console.log(body)


  try {

    // const { productName, amount, discount, currency = 'aed' } = req.body;
	console.log('Received data:', body);

    if (!body.productName) {
      return NextResponse.json({ error: 'Missing product name' }, { status: 400 });
    }
    if (!body.amount) {
      return NextResponse.json({ error: 'Missing amount' }, { status: 400 });
    }
    if (body.discount === undefined) {
      return NextResponse.json({ error: 'Missing discount' }, { status: 400 });
    }
    if (isNaN(body.amount)) {
      return NextResponse.json({ error: 'Amount must be a number' }, { status: 400 });
    }
    if (body.discount < 0 || body.discount > 100) {
      return NextResponse.json({ error: 'Discount must be between 0 and 100' }, { status: 400 });
    }

    const discountPercentage = body.discount ? 1 - (Number(body.discount) / 100) : 1;
    const discountedAmount = Math.round(Number(body.amount) * 100 * discountPercentage);

	console.log('Received data:', { productName: body.productName, amount: body.amount, discount: body.discount });

    let product;
    try {
      product = await stripe.products.create({
        name: body.productName,
        description: `Special offer: ${body.discount}% off on ${body.productName}`,
      });
    } catch (productError) {
      console.error('Error creating product:', productError);
      let errorResponse = { error: 'Failed to create product.' };
      if (productError.param) {
        errorResponse.error += ` Invalid parameter: ${productError.param}`;
      } else {
        errorResponse.error += ' No specific parameters were identified as invalid.';
      }
      if (productError.raw && productError.raw.param) {
        errorResponse.error += ` Details: ${productError.raw.param.join(', ')}`;
      }
      return NextResponse.json(errorResponse, { status: 500 });
    }

    let price;

	const currency = body.currency || 'aed';

    try {
      price = await stripe.prices.create({
        unit_amount: discountedAmount,
        currency,
        product: product.id,
      });
    } catch (priceError) {
      console.error('Error creating price:', priceError);
      return NextResponse.json({ error: 'Failed to create price' }, { status: 500 });
    }

    console.log(`Created price: ${price.id}`);

    let paymentLink;
    try {
      paymentLink = await stripe.paymentLinks.create({
        line_items: [{
          price: price.id,
          quantity: 1,
        }],
      });

    } catch (paymentLinkError) {
      console.error('Error creating payment link:', paymentLinkError);
      return NextResponse.json({ error: 'Failed to create payment link' }, { status: 500 });
    }

    return NextResponse.json({ url: paymentLink.url }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
