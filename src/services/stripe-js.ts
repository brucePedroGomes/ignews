import { loadStripe } from '@stripe/stripe-js';

export const getStripeJs = async () =>
  await loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
  );
