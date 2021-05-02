import Head from 'next/head';
import { GetStaticProps } from 'next';
import { Home } from '../components/Home';
import { stripe } from '../services/stripe';
import { priceFormatter } from '../services/utils';

type Product = {
  product: {
    priceId: string;
    amount: number;
  };
};

export default function Index({ product }: Product) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <Home product={product} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve(
    process.env.SUBSCRIPTION_PRICE,
    {
      expand: ['product'],
    }
  );

  const product = {
    priceId: price.id,
    amount: priceFormatter(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
