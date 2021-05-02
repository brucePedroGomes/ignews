import Primisc from '@prismicio/client';

export const getPrimiscClient = (req?: unknown) =>
  Primisc.client(process.env.PRISMIC_ENDPOINT, {
    req,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });
