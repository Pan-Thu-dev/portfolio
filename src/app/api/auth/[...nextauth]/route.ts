import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// Export a NextAuth handler for Next.js App Router
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 