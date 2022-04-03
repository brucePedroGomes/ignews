import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";

export const SubscribeButton = (props: { priceId: string }) => {
  const [session] = useSession();
  const { push } = useRouter();

  const handleSubscribe = async () => {
    if (!session) {
      signIn("github");
      return;
    }

    if (session?.activeSubscription) {
      push("/posts");
    }

    try {
      const response = await api.post<{
        sessionId: string;
      }>("/subscribe");

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
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
};
