import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { fauna } from '../../services/fauna';
import { query as q } from 'faunadb';
import { stripe } from '../../services/stripe';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'POST') {
    const session = await getSession({ req });

    const user = await fauna.query<{
      ref: {
        id: string;
      };
      data: {
        stripe_customer_id?: string;
      };
    }>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session.user.email)
        )
      )
    );

    let customerId = user.data.stripe_customer_id;

    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
      });

      await fauna.query(
        q.Update(
          q.Ref(q.Collection('users'), user.ref.id),
          {
            data: {
              stripe_customer_id: stripeCustomer.id,
            },
          }
        )
      );

      customerId = stripeCustomer.id;
    }

    const stripeCheckout = await stripe.checkout.sessions.create(
      {
        customer: customerId,
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

    return res
      .status(200)
      .json({ sessionId: stripeCheckout.id });
  }

  res.setHeader('Allow', 'POST');
  res.status(405).end('method not allowed');
};
