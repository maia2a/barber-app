import { getServerSession, type Session } from "next-auth"
import { notFound } from "next/navigation"
import { BookingItem } from "../_components/booking-item"
import Header from "../_components/header"
import { authOptions } from "../_lib/auth"
import { db } from "../_lib/prisma"

const Bookings = async () => {
  const session: Session | null = await getServerSession(authOptions)
  if (!session?.user || !session) {
    return notFound()
  }
  const confirmedBookings = await db.booking.findMany({
    where: {
      userId: session.user.id,
      date:{
        gte: new Date(),
      }
    },
    include: {
      service: {
        include: {
          barbershop: true,
        },
      },
    },
  })
  const concludedBookings = await db.booking.findMany({
    where: {
      userId: session.user.id,
      date: {
        lt: new Date(),
      },
    },
    include: {
      service: {
        include: {
          barbershop: true,
        },
      },
    },
  })
  return (
    <>
      <Header />
      <div className="space-y-3 p-5">
        <h2 className="text-xl font-bold">Agendamentos</h2>
         <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Confirmados
        </h2>
        {confirmedBookings.map((booking) => (
          <BookingItem key={booking.id} booking={booking} />
        ))}
        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Finalizados
        </h2>
        {concludedBookings.map((booking) => (
          <BookingItem key={booking.id} booking={booking} />
        ))}
      </div>
    </>
  )
}

export default Bookings
