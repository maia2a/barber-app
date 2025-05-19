import Header from "@/app/_components/header"
import BarbershopItem from "../_components/barbershop-item"
import SearchBar from "../_components/SearchBar"
import { db } from "../_lib/prisma"

interface BarbershopPageProps {
  searchParams: {
    search?: string
  }
}

const BarbershopPage = async ({ searchParams }: BarbershopPageProps) => {
  const barbershops = await db.barbershop.findMany({
    where: {
      name: {
        contains: searchParams?.search,
        mode: "insensitive",
      },
    },
  })
  return (
    <div>
      <Header />
      <div className="my-6 px-5">
        <SearchBar />
      </div>
      <div className="px-5">
        <div className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          <h2>Resultados para &quot;${searchParams?.search}&quot;</h2>

          <div className="grid grid-cols-2 gap-4">
            {barbershops.map((barbershop) => {
              return (
                <BarbershopItem key={barbershop.id} barbershop={barbershop} />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BarbershopPage
