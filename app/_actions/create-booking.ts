"use server"

import { authOptions } from "@/app/_lib/auth"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"

interface CreateBookingParams {
  userId: string
  serviceId: string
  date: Date
}
export const createBooking = async (params: CreateBookingParams) => {
  const user = await getServerSession(authOptions)
  if(!user) {
    throw new Error("User not authenticated")
  }
  await db.booking.create({
    data:{...params, userId: (user.user as any).id},
  })
  revalidatePath("/barbershops/[id]")
  revalidatePath("/bookings")
}
