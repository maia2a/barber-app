/**
 * Tipo que define as propriedades de uma opção na barra de busca rápida
 */
interface QuickSearchOption {
  imageUrl: string
  title: string
}
/**
 * Lista de opções pré-definidas para a barra de busca rápida.
 * Cada item contém um título e uma imagem associada.
 *
 * @example
 * - "Cabelo" com imagem "/cabelo.svg"
 * - "Barba" com imagem "/barba.svg"
 * - "Acabamento" com imagem "/acabamento.svg"
 * - "Massagem" com imagem "/massagem.svg"
 * - "Sobrancelha" com imagem "/sobrancelha.svg"
 * - "Hidratação" com imagem "/hidratacao.svg"
 */
export const quickSearchOptions: QuickSearchOption[] = [
  {
    imageUrl: "/cabelo.svg",
    title: "Cabelo",
  },
  {
    imageUrl: "/barba.svg",
    title: "Barba",
  },
  {
    imageUrl: "/acabamento.svg",
    title: "Acabamento",
  },
  {
    imageUrl: "/massagem.svg",
    title: "Massagem",
  },
  {
    imageUrl: "/sobrancelha.svg",
    title: "Sobrancelha",
  },
  {
    imageUrl: "/hidratacao.svg",
    title: "Hidratação",
  },
]
