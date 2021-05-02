import { SubscribeButton } from '../SubscribeButton';
import styles from './styles.module.scss';

type Product = {
  product: {
    priceId: string;
    amount: number;
  };
};

export const Home = ({ product }: Product) => {
  return (
    <main className={styles.contentContainer}>
      <section className={styles.hero}>
        <span>👏 Hey, welcome</span>
        <h1>
          News about the <span>React</span> world.
        </h1>
        <p>
          Get access to all the publications <br />
          <span>for {product.amount} month</span>
        </p>
        <SubscribeButton priceId={product.priceId} />
      </section>
      <img src="/images/avatar.svg" alt="Girl coding" />
    </main>
  );
};
