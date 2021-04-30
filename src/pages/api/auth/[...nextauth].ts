import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { query } from 'faunadb';
import { fauna } from '../../../services/fauna';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: 'read:user',
    }),
  ],
  callbacks: {
    async signIn(user, _account, _profile) {
      await fauna.query(
        query.Create(query.Collection('users'), {
          data: {
            email: user.email,
          },
        })
      );
      return true;
    },
  },

  // database: process.env.DATABASE_URL,
});
