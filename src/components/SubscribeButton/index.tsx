import styles from './styles.module.scss';

export const SubscribeButton = (props: { priceId: string }) => {
  return (
    <button type="button" className={styles.subscribeButton}>
      Subscribe now
    </button>
  );
};
