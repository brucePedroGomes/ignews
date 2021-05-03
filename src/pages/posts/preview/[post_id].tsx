import {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
} from 'next';
import { getSession, useSession } from 'next-auth/client';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import Link from 'next/link';
import { RichText } from 'prismic-dom';
import { useEffect } from 'react';
import { getPrimiscClient } from '../../../services/prismic';
import { dateFormatter } from '../../../services/utils';
import styles from './styles.module.scss';

type Props = {
  post: {
    slug: string;
    title: string;
    content: string;
    updated_at: string;
  };
};

const Preview = ({ post }: Props) => {
  const { push } = useRouter();
  const [session] = useSession();

  useEffect(() => {
    if (session?.activeSubscription) {
      push(`/posts/${post.slug}`);
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updated_at}</time>
          <div
            className={`${styles.content} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{
              __html: post.content,
            }}
          />
          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
};

export default Preview;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
}) => {
  const { post_id } = params;

  const prismic = getPrimiscClient();

  const response = await prismic.getByUID(
    'publication',
    post_id.toString(),
    {}
  );

  const post = {
    slug: post_id,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(
      response.data.content.splice(0, 3)
    ),
    updated_at: dateFormatter(
      response.last_publication_date
    ),
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 30, // 30 minutes
  };
};
