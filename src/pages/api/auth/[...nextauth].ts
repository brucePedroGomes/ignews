import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { query as q } from 'faunadb';
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
  // jwt: {
  //   signingKey: process.env.SIGNING_KEY,
  // },
  callbacks: {
    async signIn(user, _account, _profile) {
      try {
        await fauna.query(
          q.If(
            q.Exists(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            ),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            ),
            q.Create(q.Collection('users'), {
              data: {
                email: user.email,
                name: user.name,
              },
            })
          )
        );

        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
  },

  // database: process.env.DATABASE_URL,
});
