import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/lib/db';
import { Resend } from 'resend';
import * as schema from '@/lib/schema';

const compare = async (password: string, hash: string) => {
  const { compare } = await import('bcryptjs');
  return compare(password, hash);
};

const resend = new Resend(process.env.RESEND_API_KEY);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: schema.users,
    accountsTable: schema.accounts,
    sessionsTable: schema.sessions,
    verificationTokensTable: schema.verificationTokens,
  }),
  session: { strategy: 'jwt' },
  debug: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await db.query.users.findFirst({
          where: (users, { eq }) =>
            eq(users.email, credentials.email as string),
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await compare(
          credentials.password as string,
          user.password
        );
        if (!isValid) {
          return null;
        }

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
    {
      id: 'magic-link',
      name: 'Magic Link',
      type: 'email' as const,
      async sendVerificationRequest({ identifier, url }) {
        try {
          await resend.emails.send({
            from: 'AUTHWITHDB <onboarding@resend.dev>',
            to: identifier,
            subject: 'Login to Your App',
            html: `<p>Click <a href="${url}">here</a> to login. This link expires in 24 hours.</p>`,
          });
        } catch (error) {
          console.error(error);
          throw new Error('Unable to send verification email');
        }
      },
    },
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});
