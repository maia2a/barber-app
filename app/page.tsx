"use client"
import Image from "next/image"
import Header from "./_components/header"
import SearchBar from "./_components/SearchBar"
import { Avatar, AvatarImage } from "./_components/ui/avatar"
import { Badge } from "./_components/ui/badge"
import { Card, CardContent } from "./_components/ui/card"

const Home = () => {
  const handleSearch = (query: string) => {
    console.log("Search query:", query)
  }
  return (
    <div>
      {/* header */}
      <Header />
      {/* main content */}
      <div className="p-5">
        <h2 className="text-xl font-bold">Olá Gabriell</h2>
        <p className="text-sm text-gray-500">Segunda-feira, 05 de agosto</p>

        {/* Search Bar */}
        <SearchBar placeholder="Faça sua busca..." onSearch={handleSearch} />

        {/* Imagem */}
        <div className="relative mt-6 h-[150px] w-full">
          <Image
            src="/banner.png"
            alt="Agende nos melhores com FSW Barber"
            fill
            className="rounded-xl object-cover"
          />
        </div>

        {/* AGENDAMENTO */}

        <h2 className="mt-6 text-xl font-bold">Agendamentos</h2>

        <Card className="mt-6">
          <CardContent className="flex justify-between p-0">
            <div className="flex flex-col gap-2 py-5 pl-5">
              <Badge>Confirmado</Badge>
              <h3 className="font-semibold">Corte de cabelo</h3>

              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={
                      "https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png"
                    }
                  />
                </Avatar>
                <p className="text-sm font-semibold">Barbearia do Zé</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center border-solid px-5">
              <p className="text-sm">Maio</p>
              <p className="text-2xl">05</p>
              <p className="text-sm">20:00</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
export default Home
