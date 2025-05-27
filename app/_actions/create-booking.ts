/**
 * @file Server action for creating new bookings.
 * This module handles the logic for adding a new booking to the system,
 * including user authentication, data persistence, and cache invalidation.
 */

"use server"

import { authOptions } from "@/app/_lib/auth"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"

/** Input parameters for booking creation. */
interface CreateBookingParams {
  userId?: string
  serviceId: string
  date: Date
}
/** Expected structure of the session user object containing an ID. */
interface SessionUser {
  /** User's unique identifier. */
  id: string
}

/**
 * Creates a booking after authenticating the user via session.
 * Persists the booking and revalidates relevant cache paths.
 *
 * @param {CreateBookingParams} params - Contains `serviceId` and `date`. `params.userId` is ignored.
 * @returns {Promise<void>} Resolves upon successful booking creation and cache revalidation.
 * @throws {Error} If authentication fails, session is invalid, or session user ID is invalid.
 */
export const createBooking = async (params: CreateBookingParams) => {
  // Retrieve current user session
  const session = await getServerSession(authOptions)

  // Validate session and presence of user data.
  if (!session || !session.user) {
    throw new Error("User not authenticated or session is invalid")
  }

  // Extract user ID from session, asserting 'SessionUser' structure.
  const userIdFromSession = (session.user as SessionUser).id

  // Validate the extracted session user ID.
  if (
    typeof userIdFromSession !== "string" ||
    userIdFromSession.trim() === ""
  ) {
    throw new Error("User ID is not a valid string")
  }

  // Create booking in the database, using the validated session user ID
  await db.booking.create({
    data: { ...params, userId: userIdFromSession },
  })

  // Revalidate cache for pages affected by the new booking.
  revalidatePath("/barbershops/[id]") // Revalidate specific barbershop page
  revalidatePath("/bookings") // Revalidate bookings overview page
}
