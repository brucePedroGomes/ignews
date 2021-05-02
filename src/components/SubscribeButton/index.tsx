import { signIn, useSession } from 'next-auth/client';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

export const SubscribeButton = (props: {
  priceId: string;
}) => {
  const [session] = useSession();

  const handleSubcribe = async () => {
    if (!session) {
      signIn('github');
      return;
    }

    try {
      const response = await api.post<{
        sessionId: string;
      }>('/subscribe');

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({
        sessionId: response.data.sessionId,
      });
    } catch (error) {
      alert(error);
    }
  };

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubcribe}
    >
      Subscribe now
    </button>
  );
};
