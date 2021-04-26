import { SubscribeButton } from '../SubscribeButton';
import styles from './styles.module.scss';

type Product = {
  product: {
    priceId: string;
    amount: number;
  };
};

const numberFormatter = (number: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number);

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
          <span>for {numberFormatter(product.amount)} month</span>
        </p>
        <SubscribeButton />
      </section>
      <img src="/images/avatar.svg" alt="Girl coding" />
    </main>
  );
};
