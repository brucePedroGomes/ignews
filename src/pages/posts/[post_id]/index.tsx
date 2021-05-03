import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import Head from 'next/head';
import { RichText } from 'prismic-dom';
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

const Post = ({ post }: Props) => {
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
            className={styles.content}
            dangerouslySetInnerHTML={{
              __html: post.content,
            }}
          />
        </article>
      </main>
    </>
  );
};

export default Post;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = await getSession({ req });

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const { post_id } = params;

  const prismic = getPrimiscClient(req);

  const response = await prismic.getByUID(
    'publication',
    post_id.toString(),
    {}
  );

  const post = {
    slug: post_id,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updated_at: dateFormatter(
      response.last_publication_date
    ),
  };

  return {
    props: {
      post,
    },
  };
};
