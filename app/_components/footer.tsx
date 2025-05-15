import { Card, CardContent } from "./ui/card"

export const Footer = () => {
  return (
    <footer className="mt-6 flex w-full items-center justify-center border-t border-gray-200 py-5">
      <Card>
        <CardContent className="flex justify-between p-0">
          <div className="flex flex-col gap-2 py-5 pl-5">
            <h3 className="font-semibold">Sobre nós</h3>
            <p className="text-sm text-gray-500">
              A FSW Barber é uma plataforma de agendamento de serviços de
              beleza.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center border-solid px-5">
            <p className="text-sm">Desenvolvido por</p>
            <p className="text-2xl">Gabriell</p>
          </div>
        </CardContent>
      </Card>
    </footer>
  )
}
