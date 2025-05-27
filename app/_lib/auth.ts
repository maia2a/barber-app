import { PrismaAdapter } from "@auth/prisma-adapter"
import { AuthOptions } from "next-auth"
import { Adapter } from "next-auth/adapters"
import GoogleProvider from "next-auth/providers/google"
import { db } from "./prisma"

// This file configures NextAuth.js for authentication in the application.
// It uses Prisma as the adapter for database interactions and Google as the authentication provider.
// The authOptions object defines the authentication settings, including the adapter, providers, callbacks, and secret.
export const authOptions: AuthOptions = {
  // Use PrismaAdapter to connect NextAuth with the Prisma database
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    // Google authentication provider configuration
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  // Callbacks to customize session behavior
  callbacks: {
    // This callback is called whenever a session is checked
    async session({ session, user }) {
      // Ensure the session user has an ID from the user object
      session.user = {
        ...(session.user ?? {}),
        id: user.id, // Ensure the session user has an ID
      }
      // Return the modified session object
      // This allows us to access the user ID in the session throughout the app
      return session
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
}
