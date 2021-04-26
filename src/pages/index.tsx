import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { Home } from '../components/Home';
import { stripe } from '../services/stripe';

type Product = {
  product: {
    priceId: string;
    amount: number;
  };
};

export default function Index(props: Product) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <Home product={props.product} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const price = await stripe.prices.retrieve('price_1IkQgEFvv4fIhzAZVcEe8IM2', {
    expand: ['product'],
  });

  const product = {
    priceId: price.id,
    amount: price.unit_amount / 100,
  };

  return {
    props: {
      product,
    },
  };
};
