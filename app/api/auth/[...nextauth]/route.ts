import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import  connectDB  from '@/lib/mongodb'
import  User  from '@/lib/models/User'

import { AuthOptions } from 'next-auth'

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          await connectDB()
          
          const user = await User.findOne({ email: credentials.email })
          if (!user) {
            return null
          }

          const isPasswordValid = await user.comparePassword(credentials.password)
          if (!isPasswordValid) {
            return null
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role as 'admin' | 'staff'
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'admin' | 'staff'
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }