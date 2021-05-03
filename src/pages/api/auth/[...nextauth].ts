import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { query as q } from 'faunadb';
import { fauna } from '../../../services/fauna';
import { session } from 'next-auth/client';

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
    async session(session) {
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  'ref',
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'),
                'active'
              ),
            ])
          )
        );
        return {
          ...session,
          activeSubscription: userActiveSubscription,
        };
      } catch (error) {
        return {
          ...session,
          activeSubscription: null,
        };
      }
    },
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
            q.Update(
              q.Select(
                ['ref'],
                q.Get(
                  q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(user.email)
                  )
                )
              ),
              {
                data: {
                  name: user.name,
                  image: user.image,
                },
              }
            ),
            q.Create(q.Collection('users'), {
              data: {
                email: user.email,
                name: user.name,
                image: user.image,
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
