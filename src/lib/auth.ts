import { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

// Define custom user type with role
interface CustomUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Simple admin authentication using credentials
export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        // This is a simple check that should be replaced with proper authentication
        if (credentials?.username === process.env.ADMIN_USERNAME && 
            credentials?.password === process.env.ADMIN_PASSWORD) {
          return { 
            id: '1', 
            name: 'Admin',
            email: 'admin@example.com',
            role: 'admin'
          } as CustomUser;
        }
        return null;
      }
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as CustomUser).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 