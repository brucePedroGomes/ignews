import { fauna } from '../../../services/fauna';
import { query as q } from 'faunadb';
import { stripe } from '../../../services/stripe';

export const saveSubscription = async ({
  subscriptionId,
  customerId,
}: {
  subscriptionId: string;
  customerId: string;
}) => {
  const userRef = await fauna.query(
    q.Select(
      ['ref'],
      q.Get(
        q.Match(
          q.Index('user_by_stripe_customer_id'),
          customerId
        )
      )
    )
  );

  const subscription = await stripe.subscriptions.retrieve(
    subscriptionId
  );

  await fauna.query(
    q.If(
      q.Exists(
        q.Match(
          q.Index('subscription_by_id'),
          subscription.id
        )
      ),
      q.Update(
        q.Select(
          ['ref'],
          q.Get(
            q.Match(
              q.Index('subscription_by_id'),
              subscription.id
            )
          )
        ),
        {
          data: {
            status: subscription.status,
            updated_at: new Date().toString(),
          },
        }
      ),
      q.Create(q.Collection('subscriptions'), {
        data: {
          id: subscription.id,
          user_id: userRef,
          status: subscription.status,
          price_id: subscription.items.data[0].price.id,
          created_at: new Date().toString(),
        },
      })
    )
  );
};
