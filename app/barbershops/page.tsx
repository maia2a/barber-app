import BarbershopItem from "../_components/barbershop-item"
import Header from "../_components/header"
import SearchBar from "../_components/SearchBar"
import { db } from "../_lib/prisma"

//Interface para os parâmetros da URL
interface BarbershopsPageProps {
  searchParams: {
    title?: string
    service?: string
  }
}
/**
 * Página de listagem de barbearias.
 *
 * Mostra uma lista de barbearias filtradas por:
 * - Nome (`title`)
 * - Serviço oferecido (`service`)
 */
const BarbershopsPage = async ({ searchParams }: BarbershopsPageProps) => {
  // Aguarde o acesso aos paramêtros de busca
  const { title, service } = await searchParams
  /**
   * Busca as barbearias no banco de dados com base nos filtros fornecidos.
   *
   * - Se houver `title`, filtra pelo nome da barbearia.
   * - Se houver `service`, filtra pelas barbearias que possuem esse serviço.
   */
  const barbershops = await db.barbershop.findMany({
    where: {
      OR: [
        title
          ? {
              name: {
                contains: title,
                mode: "insensitive",
              },
            }
          : {},
        service
          ? {
              services: {
                some: {
                  name: {
                    contains: service,
                    mode: "insensitive",
                  },
                },
              },
            }
          : {},
      ],
    },
  })

  return (
    <div>
      {/* Cabeçalho da página */}
      <Header />
      {/* Campo de busca */}
      <div className="my-6 px-5">
        <SearchBar />
      </div>
      {/* Resultados da busca */}
      <div className="px-5">
        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Resultados para &quot;{title || service}&quot;
        </h2>
        {/* Grade de barbearias */}
        <div className="grid grid-cols-2 gap-4">
          {barbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BarbershopsPage
