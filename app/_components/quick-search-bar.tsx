import Image from "next/image"
import Link from "next/link"
import { quickSearchOptions } from "../_constants/search"
import { Button } from "./ui/button"

/**
 *  Componente funcional que renderiza uma barra de navegação horizontal
 * com botões de busca rápida, cada um levando a uma página de barbearias
 * filtradas pela opção selecionada.
 *
 * @returns {JSX.Element} Componente QuickSearchBar
 */
export function QuickSearchBar() {
  return (
    <div className="mt-6 flex gap-3 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
      {quickSearchOptions.map((option) => (
        <Button
          className="gap-2"
          variant="secondary"
          key={option.title}
          asChild
        >
          <Link href={`/barbershops?service=${option.title}`}>
            <Image
              src={option.imageUrl}
              width={16}
              height={16}
              alt={option.title}
            />
            {option.title}
          </Link>
        </Button>
      ))}
    </div>
  )
}
