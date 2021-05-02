import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import Stripe from 'stripe';
import { stripe } from '../../services/stripe';
import { saveSubscription } from './_lib/manageSubscription';

const buffer = async (readable: Readable) => {
  const chuncks = [];

  for await (const chunck of readable) {
    chuncks.push(
      typeof chunck === 'string'
        ? Buffer.from(chunck)
        : chunck
    );
  }

  return Buffer.concat(chuncks);
};

// disabled to consume a stream
export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

export default async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'POST') {
    const buf = await buffer(req);

    const secret = req.headers['stripe-signature'];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        secret,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      return res
        .status(400)
        .send(`Weebhook error: ${error.message}`);
    }

    const { type } = event;

    if (relevantEvents.has(type)) {
      switch (type) {
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          const subscription = event.data
            .object as Stripe.Subscription;

          await saveSubscription({
            subscriptionId: subscription.id,
            customerId: subscription.customer.toString(),
          });

          break;
        case 'checkout.session.completed':
          const checkoutSession = event.data
            .object as Stripe.Checkout.Session;

          await saveSubscription({
            subscriptionId: checkoutSession.subscription.toString(),
            customerId: checkoutSession.customer.toString(),
          });

          break;
        default:
          return;
      }
    }

    res.status(200).json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method not allowed');
  }
};
