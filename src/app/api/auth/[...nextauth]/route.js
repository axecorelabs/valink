import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import Partner from '@/models/Partner';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          await dbConnect();

          const partner = await Partner.findOne({ email: credentials.email });

          if (!partner) {
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, partner.password);

          if (!isValid) {
            return null;
          }

          return {
            id: partner._id.toString(),
            email: partner.email,
            name: `${partner.firstName} ${partner.lastName}`,
            partnerCode: partner.partnerCode,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.partnerCode = user.partnerCode;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.partnerCode = token.partnerCode;
      }
      return session;
    },
  },
  pages: {
    signIn: '/partners',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
