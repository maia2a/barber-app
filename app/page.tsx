import { Banner } from "./_components/banner"
import BarbershopItem from "./_components/barbershop-item"
import { BookingItem } from "./_components/booking-item"
import Header from "./_components/header"
import { QuickSearchBar } from "./_components/quick-search-bar"
import SearchBar from "./_components/SearchBar"
import { db } from "./_lib/prisma"

const Home = async () => {
  // Fetch barbershops from the database
  const barbershops = await db.barbershop.findMany({})
  const popularBarbershops = await db.barbershop.findMany({
    orderBy: {
      name: "desc",
    },
  })
  return (
    <div>
      {/* header */}
      <Header />
      {/* Main content */}
      <div className="p-5">
        <h2 className="text-xl font-bold">Olá Gabriell</h2>
        <p className="text-sm text-gray-500">Segunda-feira, 05 de agosto</p>

        {/* Search Bar */}
        <SearchBar placeholder="Faça sua busca..." />

        {/* Quick Search Bar */}
        <QuickSearchBar />

        {/* Banner */}
        <Banner />

        {/* AGENDAMENTO */}
        <BookingItem />

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
