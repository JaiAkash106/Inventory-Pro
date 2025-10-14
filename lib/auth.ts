import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Simple authentication for development
        // You can replace this with database user check
        if (credentials?.email === "admin@example.com" && credentials?.password === "admin") {
          return {
            id: "1",
            email: "admin@example.com",
            name: "Admin User"
          }
        }
        
        // Add more users if needed
        if (credentials?.email === "user@example.com" && credentials?.password === "user") {
          return {
            id: "2", 
            email: "user@example.com",
            name: "Test User"
          }
        }
        
        return null
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
      }
      return session
    }
  }
}