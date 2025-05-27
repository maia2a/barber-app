import { DefaultSession, DefaultUser } from "next-auth"

// This file extends the NextAuth types to include a user ID in the session.
// It allows us to access the user ID in the session object throughout the application.
// This is useful for identifying the user in server actions and other parts of the app.
declare module "next-auth" {
  /**
   * The `session` object returned by NextAuth will have a user property
   * that includes the user's ID.
   */
  interface Session extends DefaultSession {
    // The user property will now include an ID
    user: User
  }

  /**
   * The `user` object returned by NextAuth will have an ID property.
   * This is useful for identifying the user in server actions and other parts of the app.
   */
  interface User extends DefaultUser {
    // The user ID is a string that uniquely identifies the user
    id: string
  }
}
