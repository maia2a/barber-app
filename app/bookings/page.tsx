import type { Prisma } from "@prisma/client"
import { getServerSession, type Session } from "next-auth"
import { notFound } from "next/navigation"
import { BookingItem } from "../_components/booking-item"
import Header from "../_components/header"
import { authOptions } from "../_lib/auth"
import { db } from "../_lib/prisma"

type RawBookingWithDetails = Prisma.BookingGetPayload<{
  include: {
    service: {
      include: {
        barbershop: true
      }
    }
  }
}>

type OriginalServiceType = RawBookingWithDetails["service"]

export type SerializedBookingWithDetails = Omit<
  RawBookingWithDetails,
  "service"
> & {
  /** The service associated with the booking, retaining its original Prisma type. */
  service: Omit<OriginalServiceType, 'price'> & {
    price: string
  }
}

const makeBookingSerializable = (
  booking: RawBookingWithDetails,
): SerializedBookingWithDetails => {
  return {
    ...booking,
    service: {
      ...booking.service,
      price: Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(booking.service.price)),
    },
  }
}

const Bookings = async () => {
  const session: Session | null = await getServerSession(authOptions)
  if (!session?.user || !session) {
    return notFound()
  }
  const rawConfirmedBookings = await db.booking.findMany({
    where: {
      userId: (session.user.id),
      date: {
        gte: new Date(),
      },
    },
    include: {
      service: {
        include: {
          barbershop: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  })
  const rawConcludedBookings = await db.booking.findMany({
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
    orderBy: {
      date: "asc",
    },
  })

  const confirmedBookings = rawConfirmedBookings.map(makeBookingSerializable)
  const concludedBookings = rawConcludedBookings.map(makeBookingSerializable)
  return (
    <>
      <Header />
      <div className="space-y-3 p-5">
        <h2 className="text-xl font-bold">Agendamentos</h2>

        {/* Confirmed bookings */}
        <div>
          <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
            Confirmados
          </h2>
          {confirmedBookings.length > 0 ? (
            <div className="space-y-4">
              {confirmedBookings.map((booking) => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <p className="text-sm text-gray-400">
                Nenhum agendamento confirmado
              </p>
            </div>
          )}
        </div>

        {/* Concluded bookings */}
        <div>
          <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
            Finalizados
          </h2>
          {concludedBookings.length > 0 ? (
            <div className="space-y-4">
              {concludedBookings.map((booking) => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <p className="text-sm text-gray-400">
                Nenhum agendamento finalizado
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Bookings
