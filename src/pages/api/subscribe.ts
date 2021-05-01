import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { stripe } from '../../services/stripe';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'POST') {
    const session = await getSession({ req });

    const stripeCustomer = await stripe.customers.create({
      email: session.user.email,
    });

    const stripeCheckout = await stripe.checkout.sessions.create(
      {
        customer: stripeCustomer.id,
        payment_method_types: ['card'],
        billing_address_collection: 'required',
        line_items: [
          {
            price: 'price_1IkQgEFvv4fIhzAZVcEe8IM2',
            quantity: 1,
          },
        ],
        mode: 'subscription',
        allow_promotion_codes: true,
        success_url: `${process.env.STRIPE_URL}/posts`,
        cancel_url: process.env.STRIPE_URL,
      }
    );

    res.status(200).json({ sessionId: stripeCheckout.id });
    return;
  }

  res.setHeader('Allow', 'POST');
  res.status(405).end('method not allowed');
};
