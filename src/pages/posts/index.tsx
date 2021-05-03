import { GetStaticProps } from 'next';
import { getPrimiscClient } from '../../services/prismic';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { dateFormatter } from '../../services/utils';
import Head from 'next/head';
import styles from './styles.module.scss';
import Link from 'next/link';

type Props = {
  posts: {
    slug: string;
    title: string;
    excerpt: string;
    updated_at: string | Date;
  }[];
};

const Posts = ({ posts }: Props) => {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link href={`/posts/${post.slug}`}>
              <a key={post.slug}>
                <time>{post.updated_at}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
};

export default Posts;

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrimiscClient();

  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'publication')],
    {
      pageSize: 20,
    }
  );

  const posts = response.results.map((post) => ({
    slug: post.uid,
    title: RichText.asText(post.data.title),
    excerpt:
      post.data.content.find(
        (content: any) =>
          content.type === 'paragraph' &&
          content.text.length > 0
      )?.text ?? '',
    updated_at: dateFormatter(post.last_publication_date),
  }));

  return {
    props: {
      posts,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
