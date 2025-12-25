import NextAuth, { AuthOptions, User, Account, Profile }  from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
// Import the types we need
// import { type User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';

import { compare } from 'bcryptjs';

// Import the singleton instance of PrismaClient
import prisma from 'database';
// DO NOT CREATE A NEW INSTANCE FOR EACH REQUEST
// const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValid = await compare(credentials.password, user.passwordHash);

        if (isValid) {
          return user;
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login', // Redirect to our custom login page
    // Define custom error page 
    // Redirect to login page with an error query param 
    error: '/login', 
  },

  callbacks: {
    async signIn({ user: user, account: account }: { user: User, account: Account | null}) {
      // This callback runs for all sign-ins, including OAuth (Google) and credentials
      if (account?.provider === 'credentials' || account?.provider === 'google') {
        const dbUser = await prisma.user.findUnique({ where: { email: user.email! } }); 

        // If the user exists in the db and is banned, prevent sign in
        if (dbUser?.isBanned) {
          // If banned return path to banned page
          // This will trigger a server-side redirect
          const bannedUrl = `/banned?name=${encodeURIComponent(dbUser.email || 'this account')}`;
          return bannedUrl; 
        }
      }

      // If not banned or a new user allow sign up 
      return true;
    },

    // This callback is called whenever a JWT is created or updated 
    jwt({ token, user }: { token: JWT, user?: User}){
      if (user) {
        // On initial sign in, the 'user' object is available 
        // We are adding the user's id to the token
        token.id = user.id; 
        token.isAdmin = user.isAdmin;
      }
      return token;
    },

    // This callback is called whenever a session is checked
    session({ session, token }: { session: Session, token: JWT }) {
      // We are taking the id from the token and adding it to the session's user object
      session.user.id = token.id as string;
      session.user.isAdmin = token.isAdmin as boolean;
      return session;
    }
  }
};

export default NextAuth(authOptions);