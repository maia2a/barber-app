import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getServerSession, type Session } from "next-auth"
import { Banner } from "./_components/banner"
import BarbershopItem from "./_components/barbershop-item"
import { BookingItem } from "./_components/booking-item"
import Header from "./_components/header"
import { QuickSearchBar } from "./_components/quick-search-bar"
import SearchBar from "./_components/SearchBar"
import { authOptions } from "./_lib/auth"
import { db } from "./_lib/prisma"
import {
  makeBookingSerializable,
  type RawBookingWithDetails,
  type SerializedBookingWithDetails,
} from "./_lib/types"

const Home = async () => {
  // Get the current session to check if the user is authenticated
  const session: Session | null = await getServerSession(authOptions)
  // Fetch barbershops from the database
  const barbershops = await db.barbershop.findMany({})
  // Fetch popular barbershops from the database, ordered by name in descending order
  const popularBarbershops = await db.barbershop.findMany({
    orderBy: {
      name: "desc",
    },
  })
  const rawConfirmedBookings: RawBookingWithDetails[] = session?.user
    ? await db.booking.findMany({
        where: {
          userId: session.user.id,
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
    : []

  const confirmedBookings: SerializedBookingWithDetails[] =
    rawConfirmedBookings.map(makeBookingSerializable)
  return (
    <div>
      {/* header */}
      <Header />
      {/* Main content */}
      <div className="p-5">
        <h2 className="text-xl font-bold">
          Olá {session?.user?.name || "Visitante"}
        </h2>

        <p>
          <span className="text-sm capitalize text-gray-400">
            {format(new Date(), "EEEE, dd", { locale: ptBR })}
          </span>
          <span className="text-sm text-gray-400">&nbsp;de&nbsp;</span>
          <span className="text-sm capitalize text-gray-400">
            {format(new Date(), "MMMM", { locale: ptBR })}
          </span>
        </p>

        {/* Search Bar */}
        <div>
          <SearchBar />
        </div>

        {/* Quick Search Bar */}
        <QuickSearchBar />

        {/* Banner */}
        <Banner />

        {/* AGENDAMENTO */}
        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Agendamentos
        </h2>
        <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {confirmedBookings.map((booking) => (
            <BookingItem key={booking.id} booking={booking} />
          ))}
        </div>

        {/* Recomendados */}

        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Recomendados
        </h2>
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershops) => (
            <BarbershopItem key={barbershops.id} barbershop={barbershops} />
          ))}
        </div>

        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Populares
        </h2>
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {popularBarbershops.map((barbershops) => (
            <BarbershopItem key={barbershops.id} barbershop={barbershops} />
          ))}
        </div>
      </div>
    </div>
  )
}
export default Home
