import Image from "next/image"

/**
 * Componente funcional que renderiza um banner promocional na página inicial.
 * O banner é responsivo e ocupa toda a largura disponível.
 *
 * @returns {JSX.Element} O elemento JSX do componente Banner.
 */

export function Banner() {
  return (
    <div className="relative mt-6 h-[150px] w-full">
      <Image
        src="/banner.png"
        alt="Agende nos melhores com FSW Barber"
        fill
        className="rounded-xl object-cover"
      />
    </div>
  )
}
